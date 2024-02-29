export const testDrugInfo = {
  uuid: "6a41be7c-7418-41dd-8ac0-5675f252d69b",
  name: "Amoxicillin/Clavulanic Acid  125 mg/31.25 mg/5 mL Powder for Oral Suspension",
  dosingInstructions: {
    route: "Topical",
    dosage: "10mg",
    asNeeded: false,
    frequency: "Three times a day",
    instructions: {
      instructions: "As directed",
    },
  },
  duration: "5 Day(s)",
  slots: [
    {
      id: 55,
      uuid: "34f88276-0ad0-47dc-b270-4be75e295d09",
      serviceType: "MedicationRequest",
      status: "SCHEDULED",
      startTime: 1706495400,
      medicationAdministration: null,
      notes: "",
      administrationSummary: {
        performerName: "",
        notes: "",
        status: "Late",
      },
    },
  ],
  dateStopped: null,
  firstSlotStartTime: 1706077800,
  notes: null,
};

export const testDrugInfoWithAdministeredLateStatus = {
  uuid: "d2cd8d35-4c40-4656-abb3-469e6200ccfb",
  name: "Combintation Chlorpheniramine, Paracetamol and Pseudophedrine 100 mL Syrup (Cough and Cold Syrup)",
  dosingInstructions: {
    route: "Oral",
    dosage: "10ml",
    asNeeded: false,
    frequency: "Four times a day",
    instructions: {
      instructions: "As directed",
    },
  },
  duration: "10 Day(s)",
  slots: [
    {
      id: 20,
      uuid: "ae90d8e8-22b9-44f3-afdf-d899c034d451",
      serviceType: "MedicationRequest",
      status: "COMPLETED",
      startTime: 1706495400,
      notes: "",
      administrationSummary: {
        performerName: "Super Man",
        notes: "Done",
        status: "Administered-Late",
      },
    },
  ],
  dateStopped: null,
  firstSlotStartTime: 1706085000,
  notes: null,
};

export const testDrugInfoWithAdministeredStatus = {
  uuid: "d2cd8d35-4c40-4656-abb3-469e6200ccfb",
  name: "Combintation Chlorpheniramine, Paracetamol and Pseudophedrine 100 mL Syrup (Cough and Cold Syrup)",
  dosingInstructions: {
    route: "Oral",
    dosage: "10ml",
    asNeeded: false,
    frequency: "Four times a day",
    instructions: {
      instructions: "As directed",
    },
  },
  duration: "10 Day(s)",
  slots: [
    {
      id: 22,
      uuid: "709b89a9-906b-4edc-aebe-7fd3cd9eba2e",
      serviceType: "MedicationRequest",
      status: "COMPLETED",
      startTime: 1706517000,
      notes: "",
      administrationSummary: {
        performerName: "Super Man",
        notes: "Done on time",
        status: "Administered",
      },
    },
  ],
  dateStopped: null,
  firstSlotStartTime: 1706085000,
  notes: null,
};
