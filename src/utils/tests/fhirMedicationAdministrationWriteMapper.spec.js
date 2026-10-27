import {
  mapScheduledPayloadToFhirMedicationAdministration,
  mapEmergencyPayloadToFhirMedicationAdministration,
  normaliseFhirCreateResponse,
  buildAmendmentPatch,
  buildAcknowledgementRequest,
} from "../fhirMedicationAdministrationWriteMapper";

const scheduled = {
  patientUuid: "p1",
  orderUuid: "o1",
  providers: [{ providerUuid: "pr1", function: "Performer" }],
  notes: [{ authorUuid: "pr1", text: "done" }],
  status: "completed",
  slotUuid: "s1",
  administeredDateTime: 1703670985,
};

describe("fhirMedicationAdministrationWriteMapper", () => {
  it("maps scheduled payload", () => {
    const r = mapScheduledPayloadToFhirMedicationAdministration(scheduled);
    expect(r.resourceType).toBe("MedicationAdministration");
    expect(r.status).toBe("completed");
    expect(r.subject.reference).toBe("Patient/p1");
    expect(r.request.reference).toBe("MedicationRequest/o1");
    expect(r.performer[0].actor.reference).toBe("Practitioner/pr1");
    expect(r.performer[0].function.coding[0].code).toBe("Performer");
    expect(r.note[0]).toEqual({
      authorReference: { reference: "Practitioner/pr1" },
      text: "done",
    });
    expect(r.effectiveDateTime).toBe("2023-12-27T09:56:25.000Z");
    expect(r.extension).toEqual([
      {
        url: "http://fhir.openmrs.org/ext/ipd/medication-administration/slot",
        valueString: "s1",
      },
    ]);
  });

  it("maps emergency payload", () => {
    const r = mapEmergencyPayloadToFhirMedicationAdministration({
      patientUuid: "p1",
      drugUuid: "d1",
      dose: "2",
      doseUnits: "Tablet",
      route: "Oral",
      providers: [
        { providerUuid: "a", function: "Performer" },
        { providerUuid: "b", function: "Witness" },
      ],
      notes: [],
      status: "completed",
      administeredDateTime: 1703670985,
    });
    expect(r.category.coding[0].code).toBe("emergency");
    expect(r.medicationReference.reference).toBe("Medication/d1");
    expect(r.dosage.dose).toEqual({ value: 2, unit: "Tablet" });
    expect(r.dosage.route).toEqual({ text: "Oral" });
    expect(r.performer).toHaveLength(2);
    expect(r.extension).toBeUndefined();
  });

  describe("normaliseFhirCreateResponse", () => {
    it("normalises 201 to 200", () => {
      expect(
        normaliseFhirCreateResponse({ status: 201, data: {} }).status
      ).toBe(200);
    });
    it("passes through errors and undefined", () => {
      expect(normaliseFhirCreateResponse({ status: 500 }).status).toBe(500);
      expect(normaliseFhirCreateResponse(undefined)).toBeUndefined();
    });
  });

  it("builds amendment patch without previous-note extension", () => {
    const patch = buildAmendmentPatch({
      authorUuid: "a1",
      recordedTime: 1703670985,
      text: "t",
      statusReasonUuid: "r1",
    });
    expect(patch).toHaveLength(1);
    expect(patch[0].op).toBe("add");
    expect(patch[0].path).toBe("/note/-");
    expect(patch[0].value.authorReference.reference).toBe("Practitioner/a1");
    expect(patch[0].value.time).toBe("2023-12-27T09:56:25.000Z");
    expect(patch[0].value.extension).toEqual([
      {
        url: "http://fhir.openmrs.org/ext/ipd/note/amendment-reason",
        valueCodeableConcept: { coding: [{ code: "r1" }] },
      },
    ]);
  });

  it("builds acknowledgement request", () => {
    const { url, body } = buildAcknowledgementRequest("ma1", {
      remarks: "ok",
    });
    expect(url).toMatch(/\/ws\/fhir2\/R4\/Task$/);
    expect(body).toEqual({
      resourceType: "Task",
      status: "completed",
      intent: "order",
      focus: { reference: "MedicationAdministration/ma1" },
      note: [{ text: "ok" }],
    });
  });
});
