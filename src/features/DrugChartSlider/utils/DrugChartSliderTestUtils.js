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

export const mockScheduleDrugOrderAsNeeded = {
  drugOrder: {
    uuid: "e2b966e0-1d5f-11e0-b929-000c29ad1d07",
    dateActivated: "2010-12-22T00:00:00.000+0530",
    drug: {
      uuid: "e2b83a8c-1d5f-11e0-b929-000c29ad1d07",
      name: "Aspirin",
    },
    duration: 10,
    durationUnit: "Days",
    dosingInstructions: {
      asNeeded: true,
    },
    instructions: "",
    additionalInstructions: "",
    route: "Oral",
  },
  uniformDosingType: {
    dose: 10,
    doseUnits: "Tablet",
    frequency: "Twice a day",
  },
  drugOrderSchedule: null,
};

export const mockScheduleDrugOrderForEdit = {
  drugOrder: {
    uuid: "e2b966e0-1d5f-11e0-b929-000c29ad1d07",
    dateActivated: "2010-12-22T00:00:00.000+0530",
    drug: {
      uuid: "e2b83a8c-1d5f-11e0-b929-000c29ad1d07",
      name: "Aspirin",
    },
    duration: 10,
    durationUnit: "Days",
    instructions: "",
    additionalInstructions: "",
    route: "Oral",
  },
  uniformDosingType: {
    dose: 10,
    doseUnits: "Tablet",
    frequency: "Twice a day",
  },
  drugOrderSchedule: {
    firstDaySlotsStartTime: [1704682800],
    dayWiseSlotsStartTime: [1704769200, 1704796200],
    remainingDaySlotsStartTime: [1705546800],
    slotStartTime: null,
    medicationAdministrationStarted: false,
  },
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

export const mockScheduleFrequenciesWithTimings = [
  {
    name: "Twice a day",
    frequencyPerDay: 2,
    scheduleTiming: ["8:00", "16:00"],
  },
  {
    name: "Thrice a day",
    frequencyPerDay: 3,
    scheduleTiming: ["8:00", "10:00", "20:00"],
  },
  {
    name: "Four times a day",
    frequencyPerDay: 4,
    scheduleTiming: ["8:00", "10:00", "14:00", "20:00"],
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
  "Nocte (At Night)",
  "Every 30 minutes",
];

export const mockDrugOrderFrequencies = [
  {
    uuid: "9d7c32a2-3f10-11e4-adec-0800271c1b75",
    frequencyPerDay: 1,
    name: "Once a day",
  },
  {
    uuid: "9d7d0641-3f10-11e4-adec-0800271c1b75",
    frequencyPerDay: 2,
    name: "Twice a day",
  },
  {
    uuid: "9d838148-3f10-11e4-adec-0800271c1b75",
    frequencyPerDay: 3,
    name: "Thrice a day",
  },
  {
    uuid: "9d84890a-3f10-11e4-adec-0800271c1b75",
    frequencyPerDay: 4,
    name: "Four times a day",
  },
  {
    uuid: "33443dad-8a92-11e4-977f-0800271c1b75",
    frequencyPerDay: 24,
    name: "Every Hour",
  },
  {
    uuid: "3345a0d3-8a92-11e4-977f-0800271c1b75",
    frequencyPerDay: 12,
    name: "Every 2 hours",
  },
  {
    uuid: "334c9330-8a92-11e4-977f-0800271c1b75",
    frequencyPerDay: 8,
    name: "Every 3 hours",
  },
  {
    uuid: "334d6ca5-8a92-11e4-977f-0800271c1b75",
    frequencyPerDay: 6,
    name: "Every 4 hours",
  },
  {
    uuid: "334e5025-8a92-11e4-977f-0800271c1b75",
    frequencyPerDay: 4,
    name: "Every 6 hours",
  },
  {
    uuid: "334f3890-8a92-11e4-977f-0800271c1b75",
    frequencyPerDay: 3,
    name: "Every 8 hours",
  },
  {
    uuid: "33500c00-8a92-11e4-977f-0800271c1b75",
    frequencyPerDay: 2,
    name: "Every 12 hours",
  },
  {
    uuid: "0",
    frequencyPerDay: 1,
    name: "Immediately",
  },
  {
    uuid: "8545fc4a-310c-11ee-bcc6-0242c0a82008",
    frequencyPerDay: 1,
    name: "Nocte (At Night)",
  },
  {
    uuid: "85494fb0-310c-11ee-bcc6-0242c0a82008",
    frequencyPerDay: 48,
    name: "Every 30 minutes",
  },
];
