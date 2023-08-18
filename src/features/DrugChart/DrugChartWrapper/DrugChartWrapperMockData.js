export const drugChartData = [
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
      {
        id: 2,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867cyu721",
        orderId: 11,
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690916550,
      },
      {
        id: 3,
        uuid: "738aa77d-03fc-438f-a87a-a3ed8a8867c421",
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690918550,
      },
    ],
  },
];
