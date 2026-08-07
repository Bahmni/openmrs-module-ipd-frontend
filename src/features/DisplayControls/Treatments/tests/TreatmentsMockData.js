const FHIR_DOSING_INSTRUCTION_TYPE =
  "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FhirDosingInstructions";

export const variableDoseStopDrugOrder = {
  drugOrder: {
    uuid: "vdp-1",
    effectiveStartDate: 1704785404,
    dateStopped: null,
    dateActivated: 1704785404,
    dosingInstructionType: FHIR_DOSING_INSTRUCTION_TYPE,
    dosingInstructions: {
      dose: null,
      doseUnits: "Tablet(s)",
      route: "Oral",
      frequency: null,
      asNeeded: false,
      administrationInstructions: JSON.stringify([
        {
          sequence: 1,
          text: "Stage 1",
          timing: {
            code: { text: "Once a day" },
            repeat: { duration: 3, durationUnit: "d" },
          },
          doseAndRate: [{ doseQuantity: { value: 1, unit: "Tablet(s)" } }],
        },
      ]),
    },
    drug: { name: "VDP Drug" },
    duration: 3,
    durationUnits: "Day(s)",
    careSetting: "INPATIENT",
  },
  drugOrderSchedule: {
    stageSchedules: [
      {
        variableDosageSequence: 1,
        isScheduled: true,
        administrationStarted: true,
        pendingSlotsAvailable: true,
        allAttended: false,
      },
    ],
    medicationAdministrationStarted: true,
  },
  provider: { name: "Dr. Jane Smith" },
};
