import { getDosageBySequence, fhirDosageToDisplayStage } from "./FhirDosingUtils";

const makeFhirDosage = (sequence, isLoadingDose = false) => ({
  sequence,
  text: `Stage ${sequence}`,
  timing: {
    code: { text: "Once a day" },
    repeat: isLoadingDose ? { count: 1 } : { duration: 1, durationUnit: "d" }
  },
  doseAndRate: [{ doseQuantity: { value: 10, unit: "mg" } }],
  additionalInstruction: [],
  patientInstruction: ""
});

describe("getDosageBySequence", () => {
  const fhirDosages = [makeFhirDosage(1), makeFhirDosage(2), makeFhirDosage(3)];

  it("returns the dosage matching the given sequence", () => {
    const result = getDosageBySequence(fhirDosages, 2);
    expect(result).toBeDefined();
    expect(result.sequence).toBe(2);
    expect(result.text).toBe("Stage 2");
  });

  it("returns null when sequence not found", () => {
    const result = getDosageBySequence(fhirDosages, 99);
    expect(result).toBeNull();
  });

  it("returns null when fhirDosages is null", () => {
    const result = getDosageBySequence(null, 1);
    expect(result).toBeNull();
  });

  it("returns null when fhirDosages is empty", () => {
    const result = getDosageBySequence([], 1);
    expect(result).toBeNull();
  });

  it("returns null when sequence is null", () => {
    const result = getDosageBySequence(fhirDosages, null);
    expect(result).toBeNull();
  });

  it("returns null when sequence is undefined", () => {
    const result = getDosageBySequence(fhirDosages, undefined);
    expect(result).toBeNull();
  });
});

describe("fhirDosageToDisplayStage with CodeableConcept coding arrays", () => {
  it("extracts frequency text from CodeableConcept with coding array", () => {
    const dosageWithCoding = {
      sequence: 1,
      text: "Stage 1",
      timing: {
        code: {
          text: "Once a day",
          coding: [{ code: "freq-uuid-123", display: "Once a day" }]
        },
        repeat: { duration: 3, durationUnit: "d" }
      },
      doseAndRate: [{ doseQuantity: { value: 10, unit: "mg" } }],
      additionalInstruction: [],
      patientInstruction: ""
    };
    const stage = fhirDosageToDisplayStage(dosageWithCoding);
    expect(stage.frequency).toBe("Once a day");
  });

  it("extracts frequency text from CodeableConcept without coding array (backward compat)", () => {
    const dosageTextOnly = {
      sequence: 1,
      text: "Stage 1",
      timing: {
        code: { text: "Three times a day" },
        repeat: { duration: 5, durationUnit: "d" }
      },
      doseAndRate: [{ doseQuantity: { value: 5, unit: "Tablet(s)" } }],
      additionalInstruction: [],
      patientInstruction: ""
    };
    const stage = fhirDosageToDisplayStage(dosageTextOnly);
    expect(stage.frequency).toBe("Three times a day");
  });
});
