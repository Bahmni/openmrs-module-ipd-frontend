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
      duration: 3,
      durationUnits: {
        uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
        display: "Day(s)",
      },
    },
    slots: [
      {
        id: 1,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        orderId: 11,
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
        display: "mg",
      },
      duration: 3,
      durationUnits: {
        uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
        display: "Day(s)",
      },
    },
    slots: [
      {
        id: 1,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        orderId: 11,
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690906550,
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
    order: {
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
    },
    slots: [
      {
        id: 1,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        orderId: 11,
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690906550,
      },
      {
        id: 2,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        orderId: 11,
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690907550,
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
      dosage: 25,
      doseType: "mg",
      startTimeInEpochSeconds: 1690906550,
      startTime: "04:15 PM",
    },
    {
      drugName: "Paracetamol 120 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: 25,
      doseType: "mg",
      startTimeInEpochSeconds: 1690906550,
      startTime: "04:15 PM",
    },
  ],
  [
    {
      drugName: "Paracetamol 120 mg (Tablet)",
      drugRoute: "Oral",
      duration: "3 Day(s)",
      dosage: 25,
      doseType: "mg",
      startTimeInEpochSeconds: 1690907550,
      startTime: "04:32 PM",
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
      startTime: "04:15 PM",
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
      startTime: "04:15 PM",
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
      startTime: "04:15 PM",
    },
  ],
];
