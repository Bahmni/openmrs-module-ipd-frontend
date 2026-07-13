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

const buildExtensionMap = (extensions) =>
  (extensions || []).reduce((acc, e) => {
    acc[e.url] = e.valueString !== undefined ? e.valueString : e.valueBoolean;
    return acc;
  }, {});

export const fhirDosageToDisplayStage = (dosage) => {
  const extMap = buildExtensionMap(dosage.extension);
  const dr = dosage.doseAndRate && dosage.doseAndRate[0];
  const isLoadingDose = extMap.isLoadingDose === true;
  const durationUnit = fromUcumDurationUnit(
    dosage.timing?.repeat?.durationUnit
  );
  const duration = isLoadingDose
    ? "1 Occurrence(s)"
    : dosage.timing?.repeat
    ? `${dosage.timing.repeat.duration} ${durationUnit}`
    : "";
  const durationDays = isLoadingDose
    ? 0
    : normalizeToDays(dosage.timing?.repeat?.duration, durationUnit);

  return {
    stageName: dosage.text || String(dosage.sequence || ""),
    dose: dr
      ? `${dr.doseQuantity.value} ${dr.doseQuantity.unit || ""}`.trim()
      : "",
    frequency: dosage.timing?.code?.text || "",
    duration,
    durationDays,
    isLoadingDose,
    instructions: dosage.additionalInstruction?.[0]?.text || "",
    additionalInstructions: dosage.patientInstruction || "",
    rate: dr?.rateQuantity?.value ? String(dr.rateQuantity.value) : "",
    additives: extMap.additives || "",
  };
};

export const computeStageStartDates = (fhirDosages, effectiveStartDate) => {
  let cumulativeDays = 0;
  return (fhirDosages || []).map((dosage) => {
    const startDate = effectiveStartDate + cumulativeDays * 24 * 60 * 60 * 1000;
    const stage = fhirDosageToDisplayStage(dosage);
    cumulativeDays += stage.durationDays;
    return startDate;
  });
};
