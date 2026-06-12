import { getDosageBySequence } from "./FhirDosingUtils";

const makeFhirDosage = (sequence) => ({
  sequence,
  text: `Stage ${sequence}`,
  timing: { code: { text: "Once a day" } },
  doseAndRate: [{ doseQuantity: { value: 10, unit: "mg" } }],
  additionalInstruction: [],
  patientInstruction: "",
  extension: [{ url: "isLoadingDose", valueBoolean: false }],
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
