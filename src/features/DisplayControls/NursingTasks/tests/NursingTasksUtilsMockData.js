export const mockResponse = {
  data: {
    id: 1,
    uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    serviceType: "Medication Administration",
    comment: "some comment",
    startDate: 1690906304,
    endDate: 1691165503,
    patient: {
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    },
    slots: [
      {
        id: 1,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        order: {
          drug: {
            display: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "ml",
          },
          dosingInstructions: {
            asNeeded: false,
            frequency: {
              display: "Once a day",
            },
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
        },
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690906550,
      },
    ],
  },
};

export const mockNursingTasksResponse = [
  {
    id: 1,
    uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    serviceType: "Medication Administration",
    comment: "some comment",
    startDate: 1690906304,
    endDate: 1691165503,
    patient: {
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    },
    slots: [
      {
        id: 1,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690906550,
        order: {
          uuid: "1e9d8a0f-fac8-46bc-a229-7e2345750884",
          drug: {
            display: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
      },
    ],
  },
  {
    id: 2,
    uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    serviceType: "Medication Administration",
    comment: "some comment",
    startDate: 1690906304,
    endDate: 1691165503,
    patient: {
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    },
    slots: [
      {
        id: 1,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690906550,
        order: {
          uuid: "1e9d8a0f-fac8-46bc-a229-7e2345750885",
          drug: {
            display: "Paracetamol 120 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
      },
      {
        id: 2,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        order: {
          uuid: "1e9d8a0f-fac8-46bc-a229-7e2345750885",
          drug: {
            display: "Paracetamol 120 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690907550,
      },
    ],
  },
];

export const mockNursingTasksResponseForCompleted = [
  {
    id: 1,
    uuid: "ebcd69a3-b117-4e75-8a79-2f41bd4e22aa",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1702627307,
    endDate: null,
    slots: [
      {
        id: 16,
        uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1702650600,
        order: {
          uuid: "paracetamol-120mg-tablet-uuid",
          drug: {
            display: "Paracetamol 120 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        medicationAdministration: {
          uuid: "6da58aca-0334-48ef-9c98-8db3b5f5d7b1",
          notes: "Administered as per instruction on time",
          administeredDateTime: 1702670700,
          status: "MA-Completed",
          orderUuid: null,
          patientUuid: "3b10b68e-ba8a-43b9-b322-33d872e80bcb",
          providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
        },
      },
    ],
  },
  {
    id: 2,
    uuid: "ebcd69a3-b117-4e75-8a79-2f41bd4e22aa",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1702627307,
    endDate: null,
    slots: [
      {
        id: 16,
        uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1702650600,
        order: {
          uuid: "paracetamol-125mg-tablet-uuid",
          drug: {
            display: "Paracetamol 125 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        medicationAdministration: {
          uuid: "6da58aca-0334-48ef-9c98-8db3b5f5d7b1",
          notes: "Administered as per instruction on time",
          administeredDateTime: 1702650700,
          status: "MA-Completed",
          orderUuid: null,
          patientUuid: "3b10b68e-ba8a-43b9-b322-33d872e80bcb",
          providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
        },
      },
    ],
  },
];
export const mockNursingTasksResponseForStopped = [
  {
    id: 1,
    uuid: "ebcd69a3-b117-4e75-8a79-2f41bd4e22aa",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1702627307,
    endDate: null,
    slots: [
      {
        id: 16,
        uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1702650600,
        order: {
          uuid: "paracetamol-120mg-tablet-uuid",
          drug: {
            display: "Paracetamol 120 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          dateStopped: 1234567890,
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        medicationAdministration: {
          uuid: "6da58aca-0334-48ef-9c98-8db3b5f5d7b1",
          notes: "Administered as per instruction on time",
          administeredDateTime: 1702670700,
          status: "MA-Completed",
          orderUuid: null,
          patientUuid: "3b10b68e-ba8a-43b9-b322-33d872e80bcb",
          providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
        },
      },
    ],
  },
  {
    id: 2,
    uuid: "ebcd69a3-b117-4e75-8a79-2f41bd4e22aa",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1702627307,
    endDate: null,
    slots: [
      {
        id: 16,
        uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1702650600,
        order: {
          uuid: "paracetamol-125mg-tablet-uuid",
          dateStopped: 1234567890,
          drug: {
            display: "Paracetamol 125 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        medicationAdministration: {
          uuid: "6da58aca-0334-48ef-9c98-8db3b5f5d7b1",
          notes: "Administered as per instruction on time",
          administeredDateTime: 1702650700,
          status: "MA-Completed",
          orderUuid: null,
          patientUuid: "3b10b68e-ba8a-43b9-b322-33d872e80bcb",
          providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
        },
      },
    ],
  },
];

export const mockNursingTasksResponseForAllTasks = [
  {
    id: 1,
    uuid: "ebcd69a3-b117-4e75-8a79-2f41bd4e22aa",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1702627307,
    endDate: null,
    slots: [
      {
        id: 16,
        uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1702650700,
        order: {
          uuid: "paracetamol-120mg-tablet-uuid",
          drug: {
            display: "Paracetamol 120 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        medicationAdministration: {
          uuid: "6da58aca-0334-48ef-9c98-8db3b5f5d7b1",
          notes: "Administered as per instruction on time",
          administeredDateTime: 1702670800,
          status: "MA-Completed",
          orderUuid: null,
          patientUuid: "3b10b68e-ba8a-43b9-b322-33d872e80bcb",
          providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
        },
      },
      {
        id: 17,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        order: {
          uuid: "paracetamol-125mg-tablet-uuid",
          drug: {
            display: "Paracetamol 125 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690917550,
      },
      {
        id: 18,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        order: {
          uuid: "paracetamol-200mg-tablet-uuid",
          drug: {
            display: "Paracetamol 200 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690937550,
      },
    ],
  },
  {
    id: 2,
    uuid: "ebcd69a3-b117-4e75-8a79-2f41bd4e22aa",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1702627307,
    endDate: null,
    slots: [
      {
        id: 2,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        order: {
          uuid: "paracetamol-500mg-tablet-uuid",
          drug: {
            display: "Paracetamol 500 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690997550,
      },
      {
        id: 16,
        uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1702650600,
        order: {
          uuid: "paracetamol-125mg-tablet-uuid",
          drug: {
            display: "Paracetamol 125 mg (Tablet)",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          dose: 25,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "mg",
          },
          duration: 3,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
          },
          asNeeded: false,
          frequency: { display: "Once a day" },
        },
        medicationAdministration: {
          uuid: "6da58aca-0334-48ef-9c98-8db3b5f5d7b1",
          notes: "Administered as per instruction on time",
          administeredDateTime: 1702650700,
          status: "MA-Completed",
          orderUuid: null,
          patientUuid: "3b10b68e-ba8a-43b9-b322-33d872e80bcb",
          providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
        },
      },
    ],
  },
];

export const mockExtractedMedicationNursingTasksData = [
  [
    {
      drugName: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: "25mg",
      doseType: undefined,
      startTimeInEpochSeconds: 1690906550,
      startTime: "16:15",
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      dosingInstructions: { asNeeded: false, frequency: "Once a day" },
      isDisabled: false,
      orderId: "1e9d8a0f-fac8-46bc-a229-7e2345750884",
    },
    {
      drugName: "Paracetamol 120 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: "25mg",
      doseType: undefined,
      startTimeInEpochSeconds: 1690906550,
      startTime: "16:15",
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      dosingInstructions: { asNeeded: false, frequency: "Once a day" },
      isDisabled: false,
      orderId: "1e9d8a0f-fac8-46bc-a229-7e2345750885",
    },
  ],
  [
    {
      drugName: "Paracetamol 120 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: "25mg",
      doseType: undefined,
      startTimeInEpochSeconds: 1690907550,
      startTime: "16:32",
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      dosingInstructions: { asNeeded: false, frequency: "Once a day" },
      orderId: "1e9d8a0f-fac8-46bc-a229-7e2345750885",
      isDisabled: false,
    },
  ],
];

export const mockExtractedMedicationNursingTasksDataForCompleted = [
  [
    {
      administeredTime: "14:31",
      administeredTimeInEpochSeconds: 1702650700,
      dosage: "25mg",
      doseType: undefined,
      drugName: "Paracetamol 125 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      startTime: "14:30",
      startTimeInEpochSeconds: 1702650600,
      uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      isDisabled: true,
      orderId: "paracetamol-125mg-tablet-uuid",
    },
  ],
  [
    {
      administeredTime: "20:05",
      administeredTimeInEpochSeconds: 1702670700,
      dosage: "25mg",
      doseType: undefined,
      drugName: "Paracetamol 120 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      startTime: "14:30",
      startTimeInEpochSeconds: 1702650600,
      uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      isDisabled: true,
      orderId: "paracetamol-120mg-tablet-uuid",
    },
  ],
];
export const mockExtractedMedicationNursingTasksDataForStopped = [
  [
    {
      dosage: "25mg",
      doseType: undefined,
      drugName: "Paracetamol 120 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      startTime: "14:30",
      stopTime: 1234567890,
      startTimeInEpochSeconds: 1702650600,
      uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      orderId: "paracetamol-120mg-tablet-uuid",
      isDisabled: true,
    },
  ],
  [
    {
      dosage: "25mg",
      doseType: undefined,
      drugName: "Paracetamol 125 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      startTime: "14:30",
      stopTime: 1234567890,
      startTimeInEpochSeconds: 1702650600,
      uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      orderId: "paracetamol-125mg-tablet-uuid",
      isDisabled: true,
    },
  ],
];

export const mockExtractedMedicationNursingTasksDataForAllTasks = [
  [
    {
      drugName: "Paracetamol 200 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: "25mg",
      doseType: undefined,
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      startTimeInEpochSeconds: 1690937550,
      startTime: "00:52",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      orderId: "paracetamol-200mg-tablet-uuid",
      isDisabled: false,
    },
  ],
  [
    {
      drugName: "Paracetamol 500 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: "25mg",
      doseType: undefined,
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      startTimeInEpochSeconds: 1690997550,
      startTime: "17:32",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      orderId: "paracetamol-500mg-tablet-uuid",
      isDisabled: false,
    },
  ],
  [
    {
      drugName: "Paracetamol 125 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: "25mg",
      doseType: undefined,
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      startTimeInEpochSeconds: 1690917550,
      startTime: "19:19",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      orderId: "paracetamol-125mg-tablet-uuid",
      isDisabled: false,
    },
  ],
  [
    {
      drugName: "Paracetamol 125 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: "25mg",
      doseType: undefined,
      uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
      startTimeInEpochSeconds: 1702650600,
      startTime: "14:30",
      administeredTimeInEpochSeconds: 1702650700,
      administeredTime: "14:31",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      orderId: "paracetamol-125mg-tablet-uuid",
      isDisabled: true,
    },
  ],
  [
    {
      drugName: "Paracetamol 120 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: "25mg",
      doseType: undefined,
      uuid: "0991b63f-3c9a-4964-9978-dff5766b7005",
      startTimeInEpochSeconds: 1702650700,
      startTime: "14:31",
      administeredTimeInEpochSeconds: 1702670800,
      administeredTime: "20:06",
      dosingInstructions: {
        asNeeded: false,
        frequency: "Once a day",
      },
      isDisabled: true,
      orderId: "paracetamol-120mg-tablet-uuid",
    },
  ],
];

export const mockTaskTileData = [
  [
    {
      drugName: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: 25,
      doseType: "mg",
      startTimeInEpochSeconds: 1690906550,
      startTime: "16:15",
      orderId: "paracetamol-120mg-tablet-uuid",
      isDisabled: true,
    },
  ],
];

export const mockTaskTileDataForGroupedTask = [
  [
    {
      drugName: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: 25,
      doseType: "mg",
      startTimeInEpochSeconds: 1690906550,
      startTime: "16:15",
    },
  ],
  [
    {
      drugName: "Paracetamol 120 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: 25,
      doseType: "mg",
      startTimeInEpochSeconds: 1690906550,
      startTime: "16:15",
    },
  ],
];

export const mockMedicationTasks = [
  {
    drugName:
      "Amoxicillin/Clavulanic Acid  125 mg/31.25 mg/5 mL Powder for Oral Suspension",
    drugRoute: "Topical",
    duration: "4 Day(s)",
    dosage: "30mg",
    uuid: "d9ae1992-63ac-4e05-8dfb-13f021102ec6",
    startTimeInEpochSeconds: 1700620200,
    startTime: "08:00",
  },
  {
    drugName: "Sodium Chloride 0.9% (1 L) Infusion Bag (Normal Saline)",
    drugRoute: "Intravenous",
    duration: "6 Day(s)",
    dosage: "25mg",
    uuid: "b9904678-eb07-4eb0-8d03-53fcaa1d20d0",
    startTimeInEpochSeconds: 1700620200,
    startTime: "08:00",
  },
];

export const mockCompletedTaskTileData = [
  {
    drugName: "Halothane/Fluothane 250 mL Inhalation Anesthetic Liquid",
    drugRoute: "Oral",
    duration: "2 Day(s)",
    dosage: "1ml",
    uuid: "f2959937-691a-4f52-82e9-4879ac7eff4b",
    startTimeInEpochSeconds: 1703586600,
    startTime: "16:00",
    orderId: "5a893957-b535-431c-a2be-3e37406f941a",
    isDisabled: true,
    administeredTimeInEpochSeconds: 1703575408,
    administeredTime: "04:36",
  },
];

export const mockPendingTaskTileData = [
  {
    drugName: "Paracetamol 500 mg Tablet",
    drugRoute: "Oral",
    duration: "3 Day(s)",
    dosage: 1,
    doseType: "Tablet(s)",
    uuid: "72af0cfa-be74-42a8-b650-45f6978314dd",
    startTimeInEpochSeconds: 1703601000,
    startTime: "20:00",
    orderId: "703ce1a1-8839-44ab-a349-8a6ca758f6b8",
    isDisabled: false,
  },
];

export const mockShiftResponse = [
  {
    id: 14,
    uuid: "eda9afb2-11f6-4545-b8e2-12fbf12d7a6c",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1704375236,
    endDate: null,
    slots: [
      {
        id: 96,
        uuid: "65aebc01-3f56-4e3b-bbd0-ff9572de8b99",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1704375300,
        order: {
          uuid: "4174fbda-3bd5-4479-9a25-58209d001811",
          orderNumber: "ORD-17503",
          accessionNumber: null,
          patient: {
            uuid: "889f81f8-a5d1-4006-8092-ecd5d63e884c",
            display: "ET54174 - new patient",
          },
          concept: {
            uuid: "627a6041-ad81-4968-8adf-2f49aec4433b",
            display: "Amoxicillin",
          },
          action: "NEW",
          careSetting: {
            uuid: "c365e560-c3ec-11e3-9c1a-0800200c9a66",
            name: "Inpatient",
            description: "In-patient care setting",
            retired: false,
            careSettingType: "INPATIENT",
            display: "Inpatient",
          },
          previousOrder: null,
          dateActivated: "2024-01-05T9:04:56.000+0530",
          scheduledDate: "2024-01-05T9:04:55.000+0530",
          dateStopped: null,
          autoExpireDate: "2024-01-06T19:04:54.000+0530",
          encounter: {
            uuid: "44108a1e-ca87-484d-b0fa-67f3ea418eae",
            display: "Consultation 01/04/2024",
          },
          orderer: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Bailly RURANGIRWA",
          },
          orderReason: null,
          orderReasonNonCoded: null,
          orderType: {
            uuid: "131168f4-15f5-102d-96e4-000c29c2a5d7",
            display: "Drug Order",
            name: "Drug Order",
            javaClassName: "org.openmrs.DrugOrder",
            retired: false,
            description: "An order for a medication to be given to the patient",
            conceptClasses: [
              {
                uuid: "8d490dfc-c2cc-11de-8d13-0010c6dffd0f",
                display: "Drug",
              },
            ],
            parent: null,
          },
          urgency: "ON_SCHEDULED_DATE",
          instructions: null,
          commentToFulfiller: null,
          display:
            "(NEW) Amoxicillin 250 mg/5 mL Powder for Oral Suspension: null",
          auditInfo: {
            creator: {
              uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
              display: "bailly.rurangirwa",
            },
            dateCreated: "2024-01-04T19:04:56.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "59cfab90-288c-43f4-a055-e57f30e30150",
            display: "Amoxicillin 250 mg/5 mL Powder for Oral Suspension",
          },
          dosingType:
            "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FlexibleDosingInstructions",
          dose: 3,
          doseUnits: {
            uuid: "9d6691d8-3f10-11e4-adec-0800271c1b75",
            display: "mg",
            name: {
              display: "mg",
              uuid: "9d66b14e-3f10-11e4-adec-0800271c1b75",
              name: "mg",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d6694d8-3f10-11e4-adec-0800271c1b75",
                display: "mg",
              },
              {
                uuid: "9d66b14e-3f10-11e4-adec-0800271c1b75",
                display: "mg",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
            ],
            descriptions: [],
            mappings: [],
            answers: [],
            setMembers: [],
            attributes: [],
          },
          frequency: {
            uuid: "9d7d0641-3f10-11e4-adec-0800271c1b75",
            display: "Twice a day",
          },
          asNeeded: false,
          asNeededCondition: null,
          quantity: 12,
          quantityUnits: {
            uuid: "9d6691d8-3f10-11e4-adec-0800271c1b75",
            display: "mg",
            name: {
              display: "mg",
              uuid: "9d66b14e-3f10-11e4-adec-0800271c1b75",
              name: "mg",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75?v=full",
                  resourceAlias: "name",
                },
              ],
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptdatatype",
                },
              ],
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d492774-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptclass",
                },
              ],
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d6694d8-3f10-11e4-adec-0800271c1b75",
                display: "mg",
              },
              {
                uuid: "9d66b14e-3f10-11e4-adec-0800271c1b75",
                display: "mg",
              },
            ],
            descriptions: [],
            mappings: [],
            answers: [],
            setMembers: [],
            attributes: [],
          },
          numRefills: 0,
          dosingInstructions: '{"instructions":"As directed"}',
          duration: 2,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
            name: {
              display: "Day(s)",
              uuid: "9d743e1d-3f10-11e4-adec-0800271c1b75",
              name: "Day(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d743b33-3f10-11e4-adec-0800271c1b75",
                display: "day(s)",
              },
              {
                uuid: "9d743e1d-3f10-11e4-adec-0800271c1b75",
                display: "Day(s)",
              },
            ],
            descriptions: [],
            mappings: [
              {
                uuid: "e48507e5-d490-11e5-b193-0800270d80ce",
                display: "SNOMED: 258703001 (Day(s))",
              },
            ],
            answers: [],
            setMembers: [],
            attributes: [],
          },
          route: {
            uuid: "33b16adb-8a92-11e4-977f-0800271c1b75",
            display: "Topical",
          },
          brandName: null,
          dispenseAsWritten: false,
          drugNonCoded: null,
          type: "drugorder",
          resourceVersion: "1.10",
        },
        medicationAdministration: {
          uuid: "79e5c6a0-bb8f-47ea-bfe3-ab7e866f7647",
          patientUuid: "889f81f8-a5d1-4006-8092-ecd5d63e884c",
          encounterUuid: null,
          orderUuid: "4174fbda-3bd5-4479-9a25-58209d001811",
          providers: [
            {
              uuid: "f137dda1-cd19-4ee3-8a09-a17395dbe84f",
              provider: {
                uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
                display: "Bailly RURANGIRWA",
              },
              function: "Performer",
            },
          ],
          notes: [],
          status: "Completed",
          statusReason: null,
          drug: null,
          dosingInstructions: null,
          dose: null,
          doseUnits: null,
          route: null,
          site: null,
          administeredDateTime: 1704375534000,
        },
      },
    ],
  },
];
