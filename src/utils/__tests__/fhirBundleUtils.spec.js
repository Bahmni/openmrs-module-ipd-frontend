import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchAllBundleEntries } from "../fhirBundleUtils";

describe("fetchAllBundleEntries", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("returns entries from a single page", async () => {
    mock.onGet("/page1").reply(200, {
      resourceType: "Bundle",
      entry: [{ resource: { id: "1" } }],
      link: [{ relation: "self", url: "/page1" }],
    });

    const bundle = await fetchAllBundleEntries("/page1");

    expect(bundle.entry).toHaveLength(1);
    expect(bundle.entry[0].resource.id).toBe("1");
  });

  it("follows next links until exhausted", async () => {
    mock.onGet("/page1").reply(200, {
      resourceType: "Bundle",
      entry: [{ resource: { id: "1" } }],
      link: [{ relation: "next", url: "/page2" }],
    });
    mock.onGet("/page2").reply(200, {
      resourceType: "Bundle",
      entry: [{ resource: { id: "2" } }],
      link: [{ relation: "self", url: "/page2" }],
    });

    const bundle = await fetchAllBundleEntries("/page1");

    expect(bundle.entry.map((entry) => entry.resource.id)).toEqual(["1", "2"]);
  });

  it("stops when the next link loops back to a visited page", async () => {
    mock.onGet("/page1").reply(200, {
      resourceType: "Bundle",
      entry: [{ resource: { id: "1" } }],
      link: [{ relation: "next", url: "/page1" }],
    });

    const bundle = await fetchAllBundleEntries("/page1");

    expect(bundle.entry).toHaveLength(1);
  });

  it("returns an empty entry array when the response has no entries", async () => {
    mock.onGet("/empty").reply(200, { resourceType: "Bundle" });

    const bundle = await fetchAllBundleEntries("/empty");

    expect(bundle.entry).toEqual([]);
  });

  it("keeps the next page on the original origin when HAPI returns an internal host", async () => {
    mock.onGet("/page1").reply(200, {
      resourceType: "Bundle",
      entry: [{ resource: { id: "1" } }],
      link: [
        {
          relation: "next",
          url: "http://internal-hapi:8080/openmrs/ws/fhir2/R4/MedicationRequest?_getpagesoffset=100",
        },
      ],
    });
    mock
      .onGet("/openmrs/ws/fhir2/R4/MedicationRequest?_getpagesoffset=100")
      .reply(200, {
        resourceType: "Bundle",
        entry: [{ resource: { id: "2" } }],
      });

    const bundle = await fetchAllBundleEntries("/page1");

    expect(bundle.entry.map((entry) => entry.resource.id)).toEqual(["1", "2"]);
  });

  it("keeps the original origin when the request URL is absolute", async () => {
    mock.onGet("https://fhir.example.com/page1").reply(200, {
      resourceType: "Bundle",
      entry: [{ resource: { id: "1" } }],
      link: [{ relation: "next", url: "http://internal-hapi:8080/page2" }],
    });
    mock.onGet("https://fhir.example.com/page2").reply(200, {
      resourceType: "Bundle",
      entry: [{ resource: { id: "2" } }],
    });

    const bundle = await fetchAllBundleEntries(
      "https://fhir.example.com/page1"
    );

    expect(bundle.entry.map((entry) => entry.resource.id)).toEqual(["1", "2"]);
  });
});
