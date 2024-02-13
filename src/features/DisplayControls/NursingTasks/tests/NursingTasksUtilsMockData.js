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
        status: "STOPPED",
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
        status: "STOPPED",
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
      isDisabled: true,
    },
  ],
];

export const mockExtractedMedicationNursingTasksDataForAllTasks = [
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
      serviceType: "MedicationRequest",
      isDisabled: false,
    },
  ],
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
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
      serviceType: "MedicationRequest",
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
    startDate: 1704434402,
    endDate: null,
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
            display: "Amoxicillin 250 mg/5 mL Powder for Oral Suspension",
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
];
