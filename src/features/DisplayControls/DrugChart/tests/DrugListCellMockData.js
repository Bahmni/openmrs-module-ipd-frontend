export const testDrugInfo = {
  drugName: "Suxamethonium Chloride 100 mg/2 mL Ampoule (50 mg/mL )",
  drugRoute: "Intravenous",
  administrationInfo: [],
  duration: "4 Day(s)",
  dosage: 2,
  doseType: "mg",
};

export const testDrugInfoWithAdministeredLateStatus = {
  drugName: "Enalapril 5 mg Tablet",
  drugRoute: "Oral",
  administrationInfo: [
    {
      time: 8.45,
      kind: "Administered-Late",
    },
  ],
  duration: "4 Day(s)",
  dosage: 1,
  doseType: "Tablet(s)",
  dosingInstructions:
    '{"instructions":"Before meals","additionalInstructions":"sample additional instruction"}',
};

export const testDrugInfoWithAdministeredStatus = {
  drugName: "Enalapril 5 mg Tablet",
  drugRoute: "Oral",
  administrationInfo: [
    {
      time: 8.45,
      kind: "Administered",
    },
  ],
  duration: "4 Day(s)",
  dosage: 1,
  doseType: "Tablet(s)",
};
