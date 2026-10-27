import {
  saveMedicationAmendmentNote,
  saveMedicationAcknowledgementNote,
} from "../utils/DrugChartUtils";
import axios from "axios";
jest.mock("axios");

describe("DrugChartUtils note saves", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => console.error.mockRestore());

  const amendment = {
    medicationAdministrationUuid: "ma1",
    amendedReason: "reason-uuid",
    amendedText: "text",
    amendedByUuid: "prov1",
  };
  const ack = {
    medicationAdministrationUuid: "ma1",
    acknowledgementNotes: "ok",
    acknowledgedByUuid: "prov1",
  };

  describe("saveMedicationAmendmentNote", () => {
    it("posts to the legacy REST endpoint by default", async () => {
      axios.post.mockResolvedValueOnce({ status: 200 });
      await saveMedicationAmendmentNote(amendment);
      expect(axios.post).toHaveBeenCalledWith(
        "/openmrs/ws/rest/v1/ipd/medicationAdministration/ma1/note",
        expect.objectContaining({
          authorUuid: "prov1",
          text: "text",
          statusReasonUuid: "reason-uuid",
          recordedTime: expect.any(Number),
        })
      );
      expect(axios.patch).not.toHaveBeenCalled();
    });

    it("rethrows on legacy error", async () => {
      axios.post.mockRejectedValueOnce(new Error("boom"));
      await expect(saveMedicationAmendmentNote(amendment)).rejects.toThrow(
        "boom"
      );
    });

    it("sends a JSON patch to FHIR when enabled", async () => {
      axios.patch.mockResolvedValueOnce({ status: 200 });
      await saveMedicationAmendmentNote(amendment, true);
      const [url, body, options] = axios.patch.mock.calls[0];
      expect(url).toMatch(/\/ws\/fhir2\/R4\/MedicationAdministration\/ma1$/);
      expect(body[0].op).toBe("add");
      expect(body[0].path).toBe("/note/-");
      expect(body[0].value.text).toBe("text");
      expect(body[0].value.authorReference.reference).toBe(
        "Practitioner/prov1"
      );
      expect(JSON.stringify(body)).not.toContain("previous-note-id");
      expect(options.withCredentials).toBe(true);
      expect(options.headers["Content-Type"]).toBe(
        "application/json-patch+json"
      );
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("rethrows on FHIR error", async () => {
      axios.patch.mockRejectedValueOnce(new Error("boom"));
      await expect(
        saveMedicationAmendmentNote(amendment, true)
      ).rejects.toThrow("boom");
    });
  });

  describe("saveMedicationAcknowledgementNote", () => {
    it("posts to the legacy REST endpoint by default", async () => {
      axios.post.mockResolvedValueOnce({ status: 200 });
      await saveMedicationAcknowledgementNote(ack);
      expect(axios.post).toHaveBeenCalledWith(
        "/openmrs/ws/rest/v1/ipd/medicationAdministration/ma1/acknowledgement",
        { remarks: "ok", approvedByUuid: "prov1" }
      );
    });

    it("rethrows on legacy error", async () => {
      axios.post.mockRejectedValueOnce(new Error("boom"));
      await expect(saveMedicationAcknowledgementNote(ack)).rejects.toThrow(
        "boom"
      );
    });

    it("posts a FHIR Task when enabled", async () => {
      axios.post.mockResolvedValueOnce({ status: 201 });
      await saveMedicationAcknowledgementNote(ack, true);
      const [url, body, options] = axios.post.mock.calls[0];
      expect(url).toMatch(/\/ws\/fhir2\/R4\/Task$/);
      expect(body).toEqual({
        resourceType: "Task",
        status: "completed",
        intent: "order",
        focus: { reference: "MedicationAdministration/ma1" },
        note: [{ text: "ok" }],
      });
      expect(options.withCredentials).toBe(true);
    });

    it("rethrows on FHIR error", async () => {
      axios.post.mockRejectedValueOnce(new Error("boom"));
      await expect(
        saveMedicationAcknowledgementNote(ack, true)
      ).rejects.toThrow("boom");
    });
  });
});
