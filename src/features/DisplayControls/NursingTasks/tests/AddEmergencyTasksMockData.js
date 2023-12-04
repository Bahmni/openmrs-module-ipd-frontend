export const DrugOrderConfigMockData = {
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
};

export const MedicationConfigMockData = {
  tabConfig: {
    allMedicationTabConfig: {
      inputOptionsConfig: {
        drugFormDefaults: {
          Ayurvedic: {
            doseUnits: "Teaspoon",
            route: "Oral",
          },
          Capsule: {
            doseUnits: "Capsule(s)",
            route: "Oral",
          },
        },
      },
    },
  },
};

export const providersMockData = {
  results: [
    {
      person: {
        display: "Unknown Provider",
        gender: "M",
      },
      uuid: "__provider_uuid__",
      retired: false,
    },
  ],
};
