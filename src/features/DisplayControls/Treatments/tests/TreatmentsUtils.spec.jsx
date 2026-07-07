import React from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import {
  stopDrugOrders,
  getEncounterType,
  getDrugName,
  getPRNIntervalInMinutes,
  isPRNEligibleForNextDose,
  getFrequencyPerDayMap,
  getOrderFrequencies,
  getConfigsForTreatments,
} from "../utils/TreatmentsUtils";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";
import "@testing-library/jest-dom/extend-expect";

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
    it("should compute interval as (24*60/frequencyPerDay) - buffer when frequency is present", () => {
      const frequencyPerDayMap = { "Once a day": 1, "Twice a day": 2 };
      expect(
        getPRNIntervalInMinutes("Once a day", frequencyPerDayMap, 30)
      ).toBe(1410);
      expect(
        getPRNIntervalInMinutes("Twice a day", frequencyPerDayMap, 30)
      ).toBe(690);
    });

    it("should default buffer to 0 when not provided", () => {
      const frequencyPerDayMap = { "Once a day": 1 };
      expect(getPRNIntervalInMinutes("Once a day", frequencyPerDayMap)).toBe(
        1440
      );
    });

    it("should return 0 when frequency is not in frequencyPerDayMap", () => {
      const frequencyPerDayMap = { "Once a day": 1 };
      expect(
        getPRNIntervalInMinutes("Every 4 hours", frequencyPerDayMap, 30)
      ).toBe(0);
    });

    it("should return 0 when frequencyPerDayMap is empty", () => {
      expect(getPRNIntervalInMinutes("Once a day", {}, 30)).toBe(0);
    });

    it("should return 0 when frequencyPerDayMap is not provided", () => {
      expect(getPRNIntervalInMinutes("Once a day")).toBe(0);
    });
  });

  describe("isPRNEligibleForNextDose", () => {
    const frequencyPerDayMap = { "Once a day": 24 }; // interval = 60 - 30 buffer = 30 minutes

    it("should return true when no lastAdministrationTime is provided", () => {
      expect(
        isPRNEligibleForNextDose(null, "Once a day", frequencyPerDayMap, 30)
      ).toBe(true);
      expect(
        isPRNEligibleForNextDose(
          undefined,
          "Once a day",
          frequencyPerDayMap,
          30
        )
      ).toBe(true);
    });

    it("should return true when no interval is configured for the frequency", () => {
      const lastAdminTime = Date.now() / 1000 - 10; // 10 seconds ago
      expect(
        isPRNEligibleForNextDose(lastAdminTime, "Unknown Frequency", {}, 30)
      ).toBe(true);
    });

    it("should return true when enough time has elapsed since last administration", () => {
      const lastAdminTime = Date.now() / 1000 - 65 * 60; // 65 minutes ago
      expect(
        isPRNEligibleForNextDose(
          lastAdminTime,
          "Once a day",
          frequencyPerDayMap,
          30
        )
      ).toBe(true);
    });

    it("should return false when not enough time has elapsed since last administration", () => {
      const lastAdminTime = Date.now() / 1000 - 20 * 60; // 20 minutes ago
      expect(
        isPRNEligibleForNextDose(
          lastAdminTime,
          "Once a day",
          frequencyPerDayMap,
          30
        )
      ).toBe(false);
    });

    it("should return true when frequencyPerDayMap is not provided", () => {
      const lastAdminTime = Date.now() / 1000 - 10;
      expect(isPRNEligibleForNextDose(lastAdminTime, "Once a day")).toBe(true);
    });

    it("should return true when buffer time meets or exceeds the raw interval", () => {
      const everyThirtyMinutesMap = { "Every 30 minutes": 48 }; // raw interval 30 min
      const lastAdminTime = Date.now() / 1000 - 5 * 60; // 5 minutes ago
      expect(
        isPRNEligibleForNextDose(
          lastAdminTime,
          "Every 30 minutes",
          everyThirtyMinutesMap,
          30
        )
      ).toBe(true);
    });
  });

  describe("getFrequencyPerDayMap", () => {
    it("should build a map of display name to frequencyPerDay", () => {
      const orderFrequencies = [
        { uuid: "1", display: "Once a day", frequencyPerDay: 1 },
        { uuid: "2", display: "Once a month", frequencyPerDay: 0.033333333 },
      ];
      expect(getFrequencyPerDayMap(orderFrequencies)).toEqual({
        "Once a day": 1,
        "Once a month": 0.033333333,
      });
    });

    it("should skip entries missing display or frequencyPerDay", () => {
      const orderFrequencies = [
        { uuid: "1", display: "Once a day" },
        { uuid: "2", frequencyPerDay: 2 },
      ];
      expect(getFrequencyPerDayMap(orderFrequencies)).toEqual({});
    });

    it("should return an empty map when no order frequencies are provided", () => {
      expect(getFrequencyPerDayMap()).toEqual({});
    });
  });

  describe("getConfigsForTreatments", () => {
    it("should default prnBufferTimeInMinutes to 30 when missing from config", async () => {
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: { config: {} },
      });
      const result = await getConfigsForTreatments();
      expect(result.prnBufferTimeInMinutes).toBe(30);
    });

    it("should use prnBufferTimeInMinutes from config when present", async () => {
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: { config: { prnBufferTimeInMinutes: 45 } },
      });
      const result = await getConfigsForTreatments();
      expect(result.prnBufferTimeInMinutes).toBe(45);
    });
  });

  describe("getOrderFrequencies", () => {
    it("should return results from the order frequency API", async () => {
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: { results: [{ uuid: "1", display: "Once a day", frequencyPerDay: 1 }] },
      });
      const result = await getOrderFrequencies();
      expect(result).toEqual([
        { uuid: "1", display: "Once a day", frequencyPerDay: 1 },
      ]);
    });

    it("should return an empty array when the API call fails", async () => {
      axios.get.mockRejectedValueOnce(new Error("network error"));
      const result = await getOrderFrequencies();
      expect(result).toEqual([]);
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
});
