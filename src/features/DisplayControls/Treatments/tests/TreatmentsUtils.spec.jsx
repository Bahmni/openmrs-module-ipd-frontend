import React from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import {
  stopDrugOrders,
  getEncounterType,
  getDrugName,
  setDosingInstructions,
  updateDrugOrderList,
  getActiveStageIndex,
  buildStageDrugOrder,
} from "../utils/TreatmentsUtils";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";
import "@testing-library/jest-dom/extend-expect";

const FHIR_DOSING_INSTRUCTION_TYPE =
  "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FhirDosingInstructions";

jest.mock("axios");

const stoppedDrugOrder = [
  {
    drugOrders: [
      {
        dateStopped: "2024-01-18T10:30:35.749Z",
        action: "DISCONTINUE",
        previousOrderUuid: "62042b9e-6c99-4119-8205-3484b75657f3",
        dateActivated: null,
        orderReasonText: "reason",
        drugOrder: {
          uuid: "62042b9e-6c99-4119-8205-3484b75657f3",
          orderType: "Drug Order",
          dateStopped: null,
          action: "NEW",
          previousOrderUuid: null,
          dateActivated: 1705569674000,
          orderReasonText: "stop",
        },
      },
    ],
    patientUuid: "354dd5e9-1f25-48a6-8477-6f7281c9946f",
    providers: [
      {
        uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
      },
    ],
    visitType: "IPD",
    visitUuid: "0ce60d41-50c8-4f16-8f64-b6fa2ab0ea0e",
    encounterTypeUuid: "81852aee-3f10-11e4-adec-0800271c1b75",
    locationUuid: "0fbbeaf4-f3ea-11ed-a05b-0242ac120002",
  },
];

describe("updateDrugOrderList", () => {
    const buildDrugOrder = (frequency, isLoadingDose) => ({
      drugOrder: {
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          frequency,
          route: "Oral",
          administrationInstructions: JSON.stringify({ isLoadingDose }),
        },
        durationUnits: "Day(s)",
      },
    });

    it("should set uniformDosingType.frequency to 'Loading Dose' when isLoadingDose is true", () => {
      const drugOrderList = [buildDrugOrder("STAT (Immediately)", true)];
      const result = updateDrugOrderList(drugOrderList);
      expect(result[0].uniformDosingType.frequency).toBe("Loading Dose");
    });

    it("should keep original frequency in uniformDosingType when isLoadingDose is false", () => {
      const drugOrderList = [buildDrugOrder("Once a day", false)];
      const result = updateDrugOrderList(drugOrderList);
      expect(result[0].uniformDosingType.frequency).toBe("Once a day");
    });
  });

describe("TreatmentsUtils", () => {
  it("should save stopped drug order successfully", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { message: "Medication stopped successfully" },
    });

    const response = await stopDrugOrders(stoppedDrugOrder);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      message: "Medication stopped successfully",
    });
  });

  it("should handle error during medication stop", async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 500, data: { error: "Internal Server Error" } },
    });

    const response = await stopDrugOrders(stoppedDrugOrder);

    expect(response).toBeUndefined();
  });

  it("should return encounter type when encounter type api is called", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        uuid: "81852aee-3f10-11e4-adec-0800271c1b75",
        display: "Consultation",
      },
    });

    const response = await getEncounterType("Consultation");

    await waitFor(() => {
      expect(response).toEqual({
        display: "Consultation",
        uuid: "81852aee-3f10-11e4-adec-0800271c1b75",
      });
    });
  });

  it("should return drug name with strike-through when dateStopped is present and instructions are not assigned", () => {
    const drugOrderObject = {
      drugOrder: {
        drug: { name: "Paracetamol" },
        dateStopped: "2023-01-01",
      },
      instructions: null,
      additionalInstructions: null,
    };

    const { queryByTestId, queryByText, getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        {getDrugName(drugOrderObject)}
      </IPDContext.Provider>
    );

    expect(queryByText("Paracetamol")).toBeTruthy();
    const strikeThroughElement =
      getByText("Paracetamol").closest(".strike-through");
    expect(strikeThroughElement).toBeInTheDocument();
    expect(queryByTestId("notes-icon")).toBeFalsy();
  });


  describe("updateDrugOrderList", () => {
    it("should keep original frequency in uniformDosingType for regular orders", () => {
      const drugOrderList = [
        {
          drugOrder: {
            dosingInstructions: {
              dose: 1,
              doseUnits: "mg",
              frequency: "Once a day",
              route: "Oral",
              administrationInstructions: JSON.stringify({
                isLoadingDose: false,
              }),
            },
            durationUnits: "Day(s)",
          },
        },
      ];
      const result = updateDrugOrderList(drugOrderList);
      expect(result[0].uniformDosingType.frequency).toBe("Once a day");
    });
  });

  it("should return drug name without strike-through when dateStopped is null and anyone of the instructions is present", () => {
    const drugOrderObject = {
      drugOrder: {
        drug: { name: "Paracetamol" },
        dateStopped: null,
      },
      instructions: "Sample Instruction",
      additionalInstructions: null,
    };

    const { queryByText, queryByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        {getDrugName(drugOrderObject)}
      </IPDContext.Provider>
    );

    expect(queryByText("Paracetamol")).toBeTruthy();
    expect(
      queryByText("Paracetamol").classList.contains("strike-through")
    ).toBeFalsy();
    expect(queryByTestId("notes-icon")).toBeTruthy();
  });

  describe("setDosingInstructions", () => {
    it("should return Variable Dosage Protocol for variable dose orders", () => {
      const drugOrder = {
        dosingInstructionType: FHIR_DOSING_INSTRUCTION_TYPE,
        dosingInstructions: { dose: 10, doseUnits: "mg", route: null },
        dateStopped: null,
      };
      const { getByText } = render(setDosingInstructions(drugOrder));
      expect(getByText("Variable Dosage Protocol")).toBeInTheDocument();
    });

    it("should return regular dosage string for non-variable dose orders", () => {
      const drugOrder = {
        dosingInstructionType: "FlexibleDosingInstructions",
        dosingInstructions: {
          dose: 100,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
        },
        duration: 5,
        durationUnits: "Day(s)",
        dateStopped: null,
      };
      const { getByText } = render(setDosingInstructions(drugOrder));
      expect(getByText(/100 mg - Oral - Once a day/)).toBeInTheDocument();
    });
  });

  describe("getActiveStageIndex", () => {
    const ONE_DAY_MS = 86400000;
    const pastDate = Date.now() - ONE_DAY_MS;
    const futureDate = Date.now() + ONE_DAY_MS;

    const dosage = (sequence) => ({ sequence });
    const scheduled = (sequence, allAttended = false) => ({
      variableDosageSequence: sequence,
      isScheduled: true,
      allAttended,
    });

    it("should return index of first unscheduled stage whose start date has passed", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [scheduled(1, true)];
      const startDates = [pastDate, pastDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(1);
    });

    it("should return -1 when a scheduled stage is not yet attended", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [scheduled(1, false)];
      const startDates = [pastDate, pastDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(-1);
    });

    it("should return -1 when all stages are attended", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [scheduled(1, true), scheduled(2, true)];
      const startDates = [pastDate, pastDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(-1);
    });

    it("should return -1 when next stage start date is in the future", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [scheduled(1, true)];
      const startDates = [pastDate, futureDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(-1);
    });

    it("should return -1 when no stages are scheduled and start date is in the future", () => {
      const fhirDosages = [dosage(1)];
      const stageSchedules = [];
      const startDates = [futureDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(-1);
    });

    it("should return 0 when first stage is unscheduled and start date has passed", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [];
      const startDates = [pastDate, futureDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(0);
    });

    it("should return -1 when stageSchedules is null", () => {
      const fhirDosages = [dosage(1)];
      const startDates = [futureDate];
      expect(getActiveStageIndex(fhirDosages, null, startDates)).toBe(-1);
    });
  });

  describe("buildStageDrugOrder", () => {
    const baseDrugOrderObject = {
      drugOrder: { uuid: "order-uuid", drug: { name: "TestDrug" } },
      route: null,
    };

    const buildFhirDosage = (duration, durationUnit) => ({
      sequence: 1,
      doseAndRate: [
        {
          doseQuantity: { value: 10, unit: "mg" },
          rateQuantity: { value: 5 },
        },
      ],
      route: { text: "Oral" },
      timing: {
        code: { text: "Once a day" },
        repeat: { duration, durationUnit },
      },
      extension: [],
    });

    it("should store raw duration matching the durationUnits for day units", () => {
      const dosage = buildFhirDosage(5, "d");
      const stageInfo = {
        frequency: "Once a day",
        instructions: null,
        additionalInstructions: null,
        rate: null,
        additives: null,
        isLoadingDose: false,
        durationDays: 5,
      };

      const result = buildStageDrugOrder(
        baseDrugOrderObject,
        dosage,
        stageInfo
      );

      expect(result.drugOrder.duration).toBe(5);
      expect(result.drugOrder.durationUnits).toBe("Day(s)");
    });

    it("should store raw duration matching the durationUnits for week units", () => {
      const dosage = buildFhirDosage(2, "wk");
      const stageInfo = {
        frequency: "Once a day",
        instructions: null,
        additionalInstructions: null,
        rate: null,
        additives: null,
        isLoadingDose: false,
        durationDays: 14,
      };

      const result = buildStageDrugOrder(
        baseDrugOrderObject,
        dosage,
        stageInfo
      );

      expect(result.drugOrder.duration).toBe(2);
      expect(result.drugOrder.durationUnits).toBe("Week(s)");
    });

    it("should store raw duration matching the durationUnits for month units", () => {
      const dosage = buildFhirDosage(1, "mo");
      const stageInfo = {
        frequency: "Once a day",
        instructions: null,
        additionalInstructions: null,
        rate: null,
        additives: null,
        isLoadingDose: false,
        durationDays: 30,
      };

      const result = buildStageDrugOrder(
        baseDrugOrderObject,
        dosage,
        stageInfo
      );

      expect(result.drugOrder.duration).toBe(1);
      expect(result.drugOrder.durationUnits).toBe("Month(s)");
    });

    it("should set duration to 0 for loading dose stages", () => {
      const dosage = buildFhirDosage(1, "d");
      const stageInfo = {
        frequency: null,
        instructions: null,
        additionalInstructions: null,
        rate: null,
        additives: null,
        isLoadingDose: true,
        durationDays: 0,
      };

      const result = buildStageDrugOrder(
        baseDrugOrderObject,
        dosage,
        stageInfo
      );

      expect(result.drugOrder.duration).toBe(0);
      expect(result.durationDisplayValue).toBe(1);
    });

    it("should handle missing timing.repeat gracefully", () => {
      const dosage = {
        sequence: 1,
        doseAndRate: [{ doseQuantity: { value: 10, unit: "mg" } }],
        route: { text: "Oral" },
        timing: { code: { text: "Once a day" } },
        extension: [],
      };
      const stageInfo = {
        frequency: "Once a day",
        instructions: null,
        additionalInstructions: null,
        rate: null,
        additives: null,
        isLoadingDose: false,
        durationDays: 0,
      };

      const result = buildStageDrugOrder(
        baseDrugOrderObject,
        dosage,
        stageInfo
      );

      expect(result.drugOrder.duration).toBe(0);
      expect(result.drugOrder.durationUnits).toBe("Day(s)");
    });
  });
});
