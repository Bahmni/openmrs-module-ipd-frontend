import axios from "axios";
import mockAdapter from "axios-mock-adapter";
import { fetchDraftsForProvider } from "../draftService";
import { FORM_DRAFT_LIST_URL } from "../../constants";

let mockAxios;

beforeEach(() => {
  mockAxios = new mockAdapter(axios);
});

afterEach(() => {
  mockAxios.restore();
});

describe("draftService", () => {
  describe("fetchDraftsForProvider", () => {
    it("should return the draft list on success", async () => {
      const drafts = [
        {
          draftUuid: "draft-uuid-1",
          patientName: "John Doe",
          patientUuid: "patient-uuid-1",
          patientIdentifier: "IQ000001",
          timestamp: 1705313400000,
        },
      ];
      mockAxios
        .onGet(FORM_DRAFT_LIST_URL, { params: { providerUuid: "provider-uuid-1" } })
        .reply(200, drafts);

      const result = await fetchDraftsForProvider("provider-uuid-1");
      expect(result).toEqual(drafts);
    });

    it("should propagate error on network failure", async () => {
      mockAxios.onGet(FORM_DRAFT_LIST_URL).networkError();

      await expect(fetchDraftsForProvider("provider-uuid-1")).rejects.toThrow();
    });

    it("should propagate error on server error response", async () => {
      mockAxios.onGet(FORM_DRAFT_LIST_URL).reply(500, { error: "Server error" });

      await expect(fetchDraftsForProvider("provider-uuid-1")).rejects.toThrow();
    });
  });
});
