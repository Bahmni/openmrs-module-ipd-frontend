export const mockWardList = [
  {
    ward: {
      uuid: "baf7bd38-d225-11e4-9c67-080027b662ec",
      display: "General Ward",
      name: "General Ward",
      description: null,
      address1: null,
      address2: "Admission Location",
      retired: false,
      attributes: [],
      address7: null,
      address8: null,
      address9: null,
      address10: null,
      address11: null,
      address12: null,
      address13: null,
      address14: null,
      address15: null,
      resourceVersion: "2.0",
    },
    totalBeds: 40,
    occupiedBeds: 27,
  },
];
export const mockNonMedicationData = [
  {
    patientUuid: "98a4a9c5-c26e-46a1-8efc-ae6df95842bf",
    tasks: [
      {
        uuid: "2de6214d-9d50-4ea5-85b1-8293fbb3fb56",
        name: "Non Medication Task 1",
        patientUuid: "98a4a9c5-c26e-46a1-8efc-ae6df95842bf",
        requestedStartTime: 1711384200000,
        requestedEndTime: 1711395000000,
        status: "REQUESTED",
        intent: "ORDER",
        partOf: null,
        taskType: {
          uuid: "91e3eeba-e840-11ee-b597-0242ac120005",
          display: "nursing_activity",
        },
        creator: {
          uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
          display: "superman",
        },
      },
      {
        uuid: "41ad6aa9-6756-4db4-a072-8ded979bb73b",
        name: "Non Medication Task 2",
        patientUuid: "98a4a9c5-c26e-46a1-8efc-ae6df95842bf",
        requestedStartTime: 1711384200000,
        requestedEndTime: 1711395000000,
        status: "COMPLETED",
        intent: "ORDER",
        partOf: null,
        taskType: {
          uuid: "91e3eeba-e840-11ee-b597-0242ac120005",
          display: "nursing_activity",
        },
        creator: {
          uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
          display: "Nurse One",
        },
      },
      {
        uuid: "41ad6aa9-6756-4db4-a072-8ded979bb73b",
        name: "Non Medication Task 3",
        patientUuid: "98a4a9c5-c26e-46a1-8efc-ae6df95842bf",
        requestedStartTime: 1711384200000,
        requestedEndTime: 1711395000000,
        status: "REJECTED",
        intent: "ORDER",
        partOf: null,
        taskType: {
          uuid: "91e3eeba-e840-11ee-b597-0242ac120005",
          display: "nursing_activity",
        },
        creator: {
          uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
          display: "Nurse One",
        },
      },
    ],
  },
];

export const mockSlotsData = [
  {
    patientUuid: "3ab51ec0-4650-4400-9aaa-75f30ece0208",
    prescribedOrderSlots: [
      {
        orderUuid: "d806bd4c-e2b3-4ed7-9adc-9b713a805f87",
        currentSlots: [
          {
            id: 197,
            uuid: "4619c2ef-1b1e-47b1-ad55-d126447c8482",
            serviceType: "MedicationRequest",
            status: "SCHEDULED",
            startTime: 1672575400,
            order: {
              uuid: "d806bd4c-e2b3-4ed7-9adc-9b713a805f87",
              display: "(NEW) Amoxicillin/Clavulanic Acid 1000 mg Tablet: null",
              drug: {
                uuid: "0a6169b3-2192-4035-9e7d-4099af53ce76",
                display: "Amoxicillin/Clavulanic Acid 1000 mg Tablet",
              },
              dose: 2,
              doseUnits: {
                uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
                display: "Tablet(s)",
              },
              route: {
                uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
                display: "Oral",
              },
            },
            medicationAdministration: null,
          },
        ],
      },
      {
        orderUuid: "d01425dc-d0e6-4fca-aaec-772f26b3e5ff",
        currentSlots: [
          {
            id: 364,
            uuid: "57b1be4e-7367-49e7-ad01-b682c8179ff4",
            serviceType: "MedicationRequest",
            status: "COMPLETED",
            startTime: 1672554600,
            order: {
              uuid: "d01425dc-d0e6-4fca-aaec-772f26b3e5ff",
              drug: {
                uuid: "f518e8af-2405-4a1d-b9f5-19e70273057a",
                display: "Adrenaline 1 mg/mL (1 mL) Ampoule",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/drug/f518e8af-2405-4a1d-b9f5-19e70273057a",
                    resourceAlias: "drug",
                  },
                ],
              },
              dose: 2,
              doseUnits: {
                display: "mg",
              },
              route: {
                display: "Intravenous",
              },
            },
            medicationAdministration: {
              uuid: "d1234b6e-7407-4fad-ac21-b8ae120a25e1",
              patientUuid: "3ab51ec0-4650-4400-9aaa-75f30ece0208",
              encounterUuid: null,
              orderUuid: "d01425dc-d0e6-4fca-aaec-772f26b3e5ff",
              providers: [
                {
                  uuid: "819bf8db-46e4-42f2-b91f-2968f24d1134",
                  provider: {
                    uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
                    display: "Super Man",
                    links: [
                      {
                        rel: "self",
                        uri: "http://localhost/openmrs/ws/rest/v1/provider/c1c26908-3f10-11e4-adec-0800271c1b75",
                        resourceAlias: "provider",
                      },
                    ],
                  },
                  function: "Performer",
                },
              ],
              notes: [
                {
                  uuid: "850f486f-4e91-4e00-b5e6-1125ba0e3b9f",
                  author: {
                    uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
                    display: "Super Man",
                    links: [
                      {
                        rel: "self",
                        uri: "http://localhost/openmrs/ws/rest/v1/provider/c1c26908-3f10-11e4-adec-0800271c1b75",
                        resourceAlias: "provider",
                      },
                    ],
                  },
                  recordedTime: 1709283718000,
                  text: "sample",
                },
              ],
              status: "Completed",
              statusReason: null,
              drug: null,
              dosingInstructions: null,
              dose: null,
              doseUnits: null,
              route: null,
              site: null,
              administeredDateTime: 1672555200000,
            },
          },
          {
            id: 365,
            uuid: "03750aac-73ce-4a7d-9410-fc877bafbd35",
            serviceType: "MedicationRequest",
            status: "SCHEDULED",
            startTime: 1672559600,
            order: {
              uuid: "d01425dc-d0e6-4fca-aaec-772f26b3e5ff",
              drug: {
                display: "Adrenaline 1 mg/mL (1 mL) Ampoule",
              },
              dose: 2,
              doseUnits: {
                display: "mg",
              },
              route: {
                display: "Intravenous",
              },
            },
            medicationAdministration: null,
          },
          {
            id: 366,
            uuid: "e1df052a-29da-4f1b-8023-7df44b5f1adc",
            serviceType: "MedicationRequest",
            status: "SCHEDULED",
            startTime: 1672559600,
            order: {
              uuid: "d01425dc-d0e6-4fca-aaec-772f26b3e5ff",
              drug: {
                display: "Adrenaline 1 mg/mL (1 mL) Ampoule",
              },
              dose: 2,
              doseUnits: {
                display: "mg",
              },
              route: {
                display: "Intravenous",
              },
            },
            medicationAdministration: null,
          },
        ],
      },
    ],
    emergencyMedicationSlots: null,
  },
];
export const mockColumnData = [
  {
    id: 197,
    uuid: "4619c2ef-1b1e-47b1-ad55-d126447c8482",
    serviceType: "MedicationRequest",
    status: "SCHEDULED",
    startTime: 1672575400,
    order: {
      uuid: "d806bd4c-e2b3-4ed7-9adc-9b713a805f87",
      display: "(NEW) Amoxicillin/Clavulanic Acid 1000 mg Tablet: null",
      drug: {
        uuid: "0a6169b3-2192-4035-9e7d-4099af53ce76",
        display: "Amoxicillin/Clavulanic Acid 1000 mg Tablet",
      },
      dose: 2,
      doseUnits: {
        uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
        display: "Tablet(s)",
      },
      route: {
        uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
        display: "Oral",
      },
    },
    medicationAdministration: null,
  },
];
