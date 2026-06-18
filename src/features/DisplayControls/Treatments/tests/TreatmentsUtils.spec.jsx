import React from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import {
  stopDrugOrders,
  getEncounterType,
  getDrugName,
  setDosingInstructions,
  getPRNIntervalInMinutes,
  isPRNEligibleForNextDose,
  updateDrugOrderList,
  shouldIncludeInIPDDashboard,
  getActiveStageIndex,
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

  describe("getPRNIntervalInMinutes", () => {
    it("should return interval from configMap when frequency is present", () => {
      const configMap = { "Once a day": 60, "Twice a day": 30 };
      expect(getPRNIntervalInMinutes("Once a day", configMap)).toBe(60);
      expect(getPRNIntervalInMinutes("Twice a day", configMap)).toBe(30);
    });

    it("should return 0 when frequency is not in configMap", () => {
      const configMap = { "Once a day": 60 };
      expect(getPRNIntervalInMinutes("Every 4 hours", configMap)).toBe(0);
    });

    it("should return 0 when configMap is empty", () => {
      expect(getPRNIntervalInMinutes("Once a day", {})).toBe(0);
    });

    it("should return 0 when configMap is not provided", () => {
      expect(getPRNIntervalInMinutes("Once a day")).toBe(0);
    });
  });

  describe("updateDrugOrderList", () => {
    it("should keep original frequency in uniformDosingType for regular orders", () => {
      const drugOrderList = [{
        drugOrder: {
          dosingInstructions: {
            dose: 1,
            doseUnits: "mg",
            frequency: "Once a day",
            route: "Oral",
            administrationInstructions: JSON.stringify({ isLoadingDose: false }),
          },
          durationUnits: "Day(s)",
        },
      }];
      const result = updateDrugOrderList(drugOrderList);
      expect(result[0].uniformDosingType.frequency).toBe("Once a day");
    });

    it("should set isDischargeMedication to true when isDischargeMedication is true in administrationInstructions", () => {
      const drugOrder = {
        drugOrder: {
          dosingInstructions: {
            dose: 1,
            doseUnits: "mg",
            frequency: "Once a day",
            route: "Oral",
            administrationInstructions: JSON.stringify({
              isLoadingDose: false,
              isDischargeMedication: true,
            }),
          },
          durationUnits: "Day(s)",
        },
      };
      const result = updateDrugOrderList([drugOrder]);
      expect(result[0].isDischargeMedication).toBe(true);
    });

    it("should set isDischargeMedication to false when not present in administrationInstructions", () => {
      const drugOrder = {
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
      };
      const result = updateDrugOrderList([drugOrder]);
      expect(result[0].isDischargeMedication).toBe(false);
    });
  });

  describe("shouldIncludeInIPDDashboard", () => {
    const buildOrder = (careSetting, isDischargeMedication) => ({
      drugOrder: { careSetting },
      isDischargeMedication,
    });

    it("should exclude OUTPATIENT order with DISCH tag", () => {
      expect(
        shouldIncludeInIPDDashboard(buildOrder("OUTPATIENT", true), true)
      ).toBe(false);
    });

    it("should include OUTPATIENT order without DISCH tag", () => {
      expect(
        shouldIncludeInIPDDashboard(buildOrder("OUTPATIENT", false), true)
      ).toBe(true);
    });

    it("should include INPATIENT order regardless of DISCH tag", () => {
      expect(
        shouldIncludeInIPDDashboard(buildOrder("INPATIENT", false), true)
      ).toBe(true);
    });

    it("should include only INPATIENT orders when allMedicinesInPrescriptionAvailableForIPD is false", () => {
      expect(
        shouldIncludeInIPDDashboard(buildOrder("INPATIENT", false), false)
      ).toBe(true);
      expect(
        shouldIncludeInIPDDashboard(buildOrder("OUTPATIENT", false), false)
      ).toBe(false);
    });
  });

  describe("isPRNEligibleForNextDose", () => {
    it("should return true when no lastAdministrationTime is provided", () => {
      const configMap = { "Once a day": 60 };
      expect(isPRNEligibleForNextDose(null, "Once a day", configMap)).toBe(
        true
      );
      expect(isPRNEligibleForNextDose(undefined, "Once a day", configMap)).toBe(
        true
      );
    });

    it("should return true when no interval is configured for the frequency", () => {
      const lastAdminTime = Date.now() / 1000 - 10; // 10 seconds ago
      expect(
        isPRNEligibleForNextDose(lastAdminTime, "Unknown Frequency", {})
      ).toBe(true);
    });

    it("should return true when enough time has elapsed since last administration", () => {
      const configMap = { "Once a day": 60 };
      const lastAdminTime = Date.now() / 1000 - 65 * 60; // 65 minutes ago
      expect(
        isPRNEligibleForNextDose(lastAdminTime, "Once a day", configMap)
      ).toBe(true);
    });

    it("should return false when not enough time has elapsed since last administration", () => {
      const configMap = { "Once a day": 60 };
      const lastAdminTime = Date.now() / 1000 - 30 * 60; // 30 minutes ago
      expect(
        isPRNEligibleForNextDose(lastAdminTime, "Once a day", configMap)
      ).toBe(false);
    });

    it("should return true when configMap is not provided", () => {
      const lastAdminTime = Date.now() / 1000 - 10;
      expect(isPRNEligibleForNextDose(lastAdminTime, "Once a day")).toBe(true);
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

    it("should render 4-box intra-day dose as M-A-E-N format with duration", () => {
      const drugOrder = {
        dosingInstructionType: "FlexibleDosingInstructions",
        dosingInstructions: {
          dose: null,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Four times a day",
        },
        duration: 5,
        durationUnits: "Day(s)",
        dateStopped: null,
      };
      const intradayDose = { morning: 10, afternoon: 0, evening: 20, night: 10 };
      const { getByText } = render(setDosingInstructions(drugOrder, intradayDose));
      expect(getByText("10-0-20-10 mg - Oral - Four times a day - for 5 Day(s)")).toBeInTheDocument();
    });

    it("should render 4-box intra-day dose without duration when duration is absent", () => {
      const drugOrder = {
        dosingInstructionType: "FlexibleDosingInstructions",
        dosingInstructions: {
          dose: null,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Four times a day",
        },
        dateStopped: null,
      };
      const intradayDose = { morning: 10, afternoon: 0, evening: 20, night: 10 };
      const { getByText } = render(setDosingInstructions(drugOrder, intradayDose));
      expect(getByText("10-0-20-10 mg - Oral - Four times a day")).toBeInTheDocument();
    });

    it("should render legacy 3-box intra-day dose (no nightDose) with night defaulting to 0", () => {
      const drugOrder = {
        dosingInstructionType: "FlexibleDosingInstructions",
        dosingInstructions: {
          dose: null,
          doseUnits: "mg",
          route: "Oral",
          frequency: null,
        },
        dateStopped: null,
      };
      const intradayDose = { morning: 5, afternoon: 5, evening: 5, night: undefined };
      const { getByText } = render(setDosingInstructions(drugOrder, intradayDose));
      expect(getByText("5-5-5-0 mg - Oral")).toBeInTheDocument();
    });

    it("should render uniform-dose order unchanged when no intradayDose provided", () => {
      const drugOrder = {
        dosingInstructionType: "FlexibleDosingInstructions",
        dosingInstructions: {
          dose: 250,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Twice a day",
        },
        dateStopped: null,
      };
      const { getByText } = render(setDosingInstructions(drugOrder));
      expect(getByText("250 mg - Oral - Twice a day")).toBeInTheDocument();
    });
  });

  describe("updateDrugOrderList intra-day dose extraction", () => {
    const buildIntraOrder = (adminInstructions) => ({
      drugOrder: {
        dosingInstructions: {
          dose: null,
          doseUnits: "mg",
          frequency: "Four times a day",
          route: "Oral",
          administrationInstructions: JSON.stringify(adminInstructions),
        },
        durationUnits: "Day(s)",
      },
    });

    it("should extract 4-box intraday dose onto intradayDose when all fields present", () => {
      const order = buildIntraOrder({
        morningDose: 10,
        afternoonDose: 0,
        eveningDose: 20,
        nightDose: 10,
      });
      const result = updateDrugOrderList([order]);
      expect(result[0].intradayDose).toEqual({
        morning: 10,
        afternoon: 0,
        evening: 20,
        night: 10,
      });
    });

    it("should extract legacy 3-box intraday dose with nightDose absent (undefined)", () => {
      const order = buildIntraOrder({
        morningDose: 5,
        afternoonDose: 5,
        eveningDose: 5,
      });
      const result = updateDrugOrderList([order]);
      expect(result[0].intradayDose).toEqual({
        morning: 5,
        afternoon: 5,
        evening: 5,
        night: undefined,
      });
    });

    it("should not set intradayDose for uniform-dose orders without intraday fields", () => {
      const order = buildIntraOrder({ instructions: "Take with food" });
      const result = updateDrugOrderList([order]);
      expect(result[0].intradayDose).toBeUndefined();
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
});
