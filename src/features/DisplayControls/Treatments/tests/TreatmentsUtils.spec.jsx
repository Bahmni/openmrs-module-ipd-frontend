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
  });
});
