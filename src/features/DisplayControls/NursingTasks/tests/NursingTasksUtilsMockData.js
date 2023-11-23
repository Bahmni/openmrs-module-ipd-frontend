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
      },
      {
        id: 2,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
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
      dosage: "25mg",
      doseType: undefined,
      startTimeInEpochSeconds: 1690906550,
      startTime: "16:15",
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
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
