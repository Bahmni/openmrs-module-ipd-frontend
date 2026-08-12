import moment from "moment";

const safeParseJson = (str) => {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

const isFhirDosageArray = (parsed) => Array.isArray(parsed);

export const parseFhirDosages = (adminInstructionsStr) => {
  const parsed = safeParseJson(adminInstructionsStr);
  if (!parsed || !isFhirDosageArray(parsed)) return null;
  return parsed;
};

export const parseFlatAdminInstructions = (adminInstructionsStr) => {
  const parsed = safeParseJson(adminInstructionsStr);
  if (!parsed || isFhirDosageArray(parsed)) return {};
  return parsed;
};

export const isVariableDoseOrder = (dosingInstructionType) =>
  dosingInstructionType ===
  "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FhirDosingInstructions";

export const LOADING_DOSE_DURATION_DISPLAY = "Occurrence(s)";
export const LOADING_DOSE_FREQUENCY = "Once";
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const MEDICATION_ADDITIVES_EXTENSION_URL = "http://fhir.bahmni.org/ext/medication-additives";

const UCUM_TO_DISPLAY = { d: "Day(s)", wk: "Week(s)", mo: "Month(s)" };
const DISPLAY_TO_DAYS = {
  "day(s)": 1,
  "week(s)": 7,
  "month(s)": 30,
  occurrence: 0,
  "occurrence(s)": 0,
};

export const fromUcumDurationUnit = (ucum) => UCUM_TO_DISPLAY[ucum] || "Day(s)";

const normalizeToDays = (duration, displayUnit) => {
  const d = parseFloat(duration) || 0;
  const multiplier =
    DISPLAY_TO_DAYS[(displayUnit || "").toLowerCase().trim()] ?? 1;
  return d * multiplier;
};

export const fhirDosageToDisplayStage = (dosage) => {
  const additives = (dosage.extension || []).find(e => e.url === MEDICATION_ADDITIVES_EXTENSION_URL)?.valueString || "";
  const dr = dosage.doseAndRate && dosage.doseAndRate[0];
  const isLoadingDose = !!(dosage.timing?.repeat?.count === 1);
  const durationUnit = fromUcumDurationUnit(
    dosage.timing?.repeat?.durationUnit
  );
  const duration = isLoadingDose
    ? `1 ${LOADING_DOSE_DURATION_DISPLAY}`
    : dosage.timing?.repeat
    ? `${dosage.timing.repeat.duration} ${durationUnit}`
    : "";
  const durationDays = isLoadingDose
    ? 0
    : normalizeToDays(dosage.timing?.repeat?.duration, durationUnit);

  const frequency = isLoadingDose
    ? LOADING_DOSE_FREQUENCY
    : (dosage.timing?.code?.text || "");

  return {
    stageName: dosage.text || String(dosage.sequence || ""),
    dose: dr
      ? `${dr.doseQuantity.value} ${dr.doseQuantity.unit || ""}`.trim()
      : "",
    frequency,
    duration,
    durationDays,
    isLoadingDose,
    instructions: dosage.additionalInstruction?.[0]?.text || "",
    additionalInstructions: dosage.patientInstruction || "",
    rate: dr?.rateQuantity?.value ? String(dr.rateQuantity.value) : "",
    additives,
  };
};

export const computeStageStartDates = (fhirDosages, effectiveStartDate) => {
  const startOfPrescriptionDay = moment(effectiveStartDate).startOf("day").valueOf();
  let cumulativeDays = 0;
  return (fhirDosages || []).map((dosage) => {
    const startDate =
      cumulativeDays === 0
        ? effectiveStartDate
        : startOfPrescriptionDay + cumulativeDays * MS_PER_DAY;
    const stage = fhirDosageToDisplayStage(dosage);
    cumulativeDays += stage.durationDays;
    return startDate;
  });
};

export const getDosageBySequence = (fhirDosages, sequence) =>
  (fhirDosages || []).find((d) => d.sequence === sequence) || null;
