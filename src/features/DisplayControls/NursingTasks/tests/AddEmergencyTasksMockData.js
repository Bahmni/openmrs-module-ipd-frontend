export const DrugOrderConfigMockData = {
  data: {
    doseUnits: [
      {
        name: "Capsule(s)",
        rootConcept: null,
      },
      {
        name: "Tablet(s)",
        rootConcept: null,
      },
      {
        name: "ml",
        rootConcept: null,
      },
    ],
    routes: [
      {
        name: "Oral",
        rootConcept: null,
      },
      {
        name: "Intravenous",
        rootConcept: null,
      },
    ],
  },
  status: 200,
};

export const MedicationConfigMockData = {
  Ayurvedic: {
    doseUnits: "Teaspoon",
    route: "Oral",
  },
  Capsule: {
    doseUnits: "Capsule(s)",
    route: "Oral",
  },
  Tablet: {
    doseUnits: "Tablet(s)",
    route: "Oral",
  },
};

export const providersMockData = {
  data: {
    results: [
      {
        person: {
          display: "Dr. Test",
          gender: "M",
        },
        uuid: "__provider_uuid__",
        retired: false,
      },
    ],
  },
  status: 200,
};

export const searchDrugMockData = {
  data: {
    results: [
      {
        uuid: "cf9d3fbe-6bb0-4b93-80e6-a2e99ff5e442",
        name: "Paracetamol 250 mg Suppository",
        dosageForm: {
          uuid: "33b0b316-8a92-11e4-977f-0800271c1b75",
          display: "Tablet",
        },
      },
      {
        uuid: "a5e9270f-dd5a-49a1-9287-2fd611e59205",
        name: "Combintation Chlorpheniramine, Paracetamol and Pseudophedrine 100 mL Syrup (Cough and Cold Syrup)",
        dosageForm: {
          uuid: "60990734-cdad-4e94-8160-422c3796a30b",
          display: "Syrup",
        },
      },
    ],
  },
  status: 200,
};
