export const mockScheduleDrugOrder = {
  uuid: "e2b966e0-1d5f-11e0-b929-000c29ad1d07",
  dateActivated: "2010-12-22T00:00:00.000+0530",
  drug: {
    uuid: "e2b83a8c-1d5f-11e0-b929-000c29ad1d07",
    name: "Aspirin",
  },
  duration: 10,
  durationUnit: "Days",
  uniformDosingType: {
    dose: 10,
    doseUnits: "Tablet",
    frequency: "Twice a day",
  },
  instructions: "",
  additionalInstructions: "",
  route: "Oral",
};

export const mockStartTimeDrugOrder = {
  uuid: "e2b966e0-1d5f-11e0-b929-000c29ad1d07",
  dateActivated: "2010-12-22T00:00:00.000+0530",
  drug: {
    uuid: "e2b83a8c-1d5f-11e0-b929-000c29ad1d07",
    name: "Aspirin",
  },
  duration: 10,
  durationUnit: "Days",
  uniformDosingType: {
    dose: 10,
    doseUnits: "Tablet",
    frequency: "Once a day",
  },
  instructions: "",
  additionalInstructions: "",
  route: "Oral",
};

export const mockScheduleFrequencies = [
  {
    name: "Twice a day",
    frequencyPerDay: 2,
  },
  {
    name: "Thrice a day",
    frequencyPerDay: 3,
  },
  {
    name: "Four times a day",
    frequencyPerDay: 4,
  },
];

export const mockStartTimeFrequencies = [
  "Every Hour",
  "Every 2 hours",
  "Every 3 hours",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "Once a day",
];
