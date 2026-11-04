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
});
