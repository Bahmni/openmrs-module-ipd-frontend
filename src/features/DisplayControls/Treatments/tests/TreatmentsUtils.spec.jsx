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
  getDischargeRevisedOrderUuids,
  isSupersededByDischargeRevision,
  DRUG_ORDER_ACTIONS,
  formatIntradayDoseString,
  modifyEmergencyTreatmentData,
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

    it("should include INPATIENT order without DISCH tag", () => {
      expect(
        shouldIncludeInIPDDashboard(buildOrder("INPATIENT", false), true)
      ).toBe(true);
    });

    it("should exclude INPATIENT order with DISCH tag", () => {
      expect(
        shouldIncludeInIPDDashboard(buildOrder("INPATIENT", true), true)
      ).toBe(false);
    });

    it("should include only INPATIENT orders when allMedicinesInPrescriptionAvailableForIPD is false", () => {
      expect(
        shouldIncludeInIPDDashboard(buildOrder("INPATIENT", false), false)
      ).toBe(true);
      expect(
        shouldIncludeInIPDDashboard(buildOrder("OUTPATIENT", false), false)
      ).toBe(false);
    });

    it("should exclude INPATIENT discharge order when allMedicinesInPrescriptionAvailableForIPD is false", () => {
      expect(
        shouldIncludeInIPDDashboard(buildOrder("INPATIENT", true), false)
      ).toBe(false);
    });
  });

  describe("getDischargeRevisedOrderUuids", () => {
    const buildDrugOrder = (
      action,
      isDischargeMedication,
      previousOrderUuid
    ) => ({
      drugOrder: { action, previousOrderUuid },
      isDischargeMedication,
    });

    it("should return empty Set for empty array", () => {
      expect(getDischargeRevisedOrderUuids([])).toEqual(new Set());
    });

    it("should include previousOrderUuid for REVISE + isDischargeMedication=true", () => {
      const orders = [
        buildDrugOrder(DRUG_ORDER_ACTIONS.REVISE, true, "uuid-123"),
      ];
      expect(getDischargeRevisedOrderUuids(orders)).toEqual(
        new Set(["uuid-123"])
      );
    });

    it("should NOT include uuid for REVISE + isDischargeMedication=false", () => {
      const orders = [
        buildDrugOrder(DRUG_ORDER_ACTIONS.REVISE, false, "uuid-123"),
      ];
      expect(getDischargeRevisedOrderUuids(orders)).toEqual(new Set());
    });

    it("should NOT include uuid for NEW + isDischargeMedication=true", () => {
      const orders = [buildDrugOrder(DRUG_ORDER_ACTIONS.NEW, true, "uuid-123")];
      expect(getDischargeRevisedOrderUuids(orders)).toEqual(new Set());
    });

    it("should NOT include entry when previousOrderUuid is null", () => {
      const orders = [buildDrugOrder(DRUG_ORDER_ACTIONS.REVISE, true, null)];
      expect(getDischargeRevisedOrderUuids(orders)).toEqual(new Set());
    });

    it("should NOT include entry when previousOrderUuid is undefined", () => {
      const orders = [
        buildDrugOrder(DRUG_ORDER_ACTIONS.REVISE, true, undefined),
      ];
      expect(getDischargeRevisedOrderUuids(orders)).toEqual(new Set());
    });

    it("should include all previousOrderUuids for multiple qualifying orders", () => {
      const orders = [
        buildDrugOrder(DRUG_ORDER_ACTIONS.REVISE, true, "uuid-1"),
        buildDrugOrder(DRUG_ORDER_ACTIONS.REVISE, true, "uuid-2"),
        buildDrugOrder(DRUG_ORDER_ACTIONS.REVISE, false, "uuid-3"),
      ];
      expect(getDischargeRevisedOrderUuids(orders)).toEqual(
        new Set(["uuid-1", "uuid-2"])
      );
    });
  });

  describe("isSupersededByDischargeRevision", () => {
    it("should return true when order is stopped and uuid is in discharge revised set", () => {
      const order = { drugOrder: { dateStopped: 1704785404, uuid: "uuid-1" } };
      const uuids = new Set(["uuid-1"]);
      expect(isSupersededByDischargeRevision(order, uuids)).toBe(true);
    });

    it("should return false when order is stopped but uuid is NOT in discharge revised set", () => {
      const order = { drugOrder: { dateStopped: 1704785404, uuid: "uuid-2" } };
      const uuids = new Set(["uuid-1"]);
      expect(isSupersededByDischargeRevision(order, uuids)).toBe(false);
    });

    it("should return false when order is NOT stopped even if uuid is in discharge revised set", () => {
      const order = { drugOrder: { dateStopped: null, uuid: "uuid-1" } };
      const uuids = new Set(["uuid-1"]);
      expect(isSupersededByDischargeRevision(order, uuids)).toBe(false);
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

  it("should show Note icon for non-coded drugs with frequency", () => {
    const drugOrderObject = {
      drugOrder: {
        drugNonCoded: "Sample Non-Coded Drug",
        dateStopped: null,
        dosingInstructions: { frequency: "Twice a day" },
      },
      instructions: "Sample Instruction",
      additionalInstructions: "Sample Additional Instruction",
    };

    const { queryByText, queryByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        {getDrugName(drugOrderObject)}
      </IPDContext.Provider>
    );

    expect(queryByText("Sample Non-Coded Drug")).toBeTruthy();
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
      const intradayDose = {
        morning: 10,
        afternoon: 0,
        evening: 20,
        night: 10,
      };
      const { getByText } = render(
        setDosingInstructions(drugOrder, intradayDose)
      );
      expect(
        getByText("10-0-20-10 mg - Oral - Four times a day - for 5 Day(s)")
      ).toBeInTheDocument();
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
      const intradayDose = {
        morning: 10,
        afternoon: 0,
        evening: 20,
        night: 10,
      };
      const { getByText } = render(
        setDosingInstructions(drugOrder, intradayDose)
      );
      expect(
        getByText("10-0-20-10 mg - Oral - Four times a day")
      ).toBeInTheDocument();
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
      const intradayDose = {
        morning: 5,
        afternoon: 5,
        evening: 5,
        night: undefined,
      };
      const { getByText } = render(
        setDosingInstructions(drugOrder, intradayDose)
      );
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
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(
        1
      );
    });

    it("should return -1 when a scheduled stage is not yet attended", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [scheduled(1, false)];
      const startDates = [pastDate, pastDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(
        -1
      );
    });

    it("should return -1 when all stages are attended", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [scheduled(1, true), scheduled(2, true)];
      const startDates = [pastDate, pastDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(
        -1
      );
    });

    it("should return -1 when next stage start date is in the future", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [scheduled(1, true)];
      const startDates = [pastDate, futureDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(
        -1
      );
    });

    it("should return -1 when no stages are scheduled and start date is in the future", () => {
      const fhirDosages = [dosage(1)];
      const stageSchedules = [];
      const startDates = [futureDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(
        -1
      );
    });

    it("should return 0 when first stage is unscheduled and start date has passed", () => {
      const fhirDosages = [dosage(1), dosage(2)];
      const stageSchedules = [];
      const startDates = [pastDate, futureDate];
      expect(getActiveStageIndex(fhirDosages, stageSchedules, startDates)).toBe(
        0
      );
    });

    it("should return -1 when stageSchedules is null", () => {
      const fhirDosages = [dosage(1)];
      const startDates = [futureDate];
      expect(getActiveStageIndex(fhirDosages, null, startDates)).toBe(-1);
    });
  });

  describe("formatIntradayDoseString", () => {
    it("should format all four slots with units, route, and duration", () => {
      const result = formatIntradayDoseString(
        { morning: 10, afternoon: 5, evening: 10, night: 5 },
        "mg",
        "Oral",
        null,
        5,
        "Day(s)"
      );
      expect(result).toBe("10-5-10-5 mg - Oral - for 5 Day(s)");
    });

    it("should display 0 for null slot values", () => {
      const result = formatIntradayDoseString(
        { morning: 10, afternoon: null, evening: 30, night: null },
        "mg",
        null,
        null,
        null,
        null
      );
      expect(result).toBe("10-0-30-0 mg");
    });

    it("should omit route/frequency/duration when not provided", () => {
      const result = formatIntradayDoseString(
        { morning: 1, afternoon: 0, evening: 1, night: 0 },
        "Tablet",
        null,
        null,
        null,
        null
      );
      expect(result).toBe("1-0-1-0 Tablet");
    });

    it("should not append a trailing space when doseUnits is missing", () => {
      const result = formatIntradayDoseString(
        { morning: 10, afternoon: 0, evening: 5, night: 0 },
        null,
        null,
        null,
        null,
        null
      );
      expect(result).toBe("10-0-5-0");
    });
  });
  describe("modifyEmergencyTreatmentData", () => {
    const validEmergencyMedication = {
      uuid: "em-uuid-1",
      drug: { display: "Paracetamol" },
      dose: 500,
      doseUnits: { display: "mg" },
      route: { display: "Oral" },
      administeredDateTime: 1700000000,
      providers: [
        {
          function: "Requester",
          provider: { uuid: "prov-1", display: "Dr. Smith - John Smith" },
        },
      ],
      notes: [],
    };

    it("should filter out emergency medications with null drug", () => {
      const medications = [
        { ...validEmergencyMedication, drug: null, uuid: "em-null" },
        validEmergencyMedication,
      ];

      const result = modifyEmergencyTreatmentData(medications);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("em-uuid-1");
    });

    it("should filter out emergency medications with undefined drug", () => {
      const medicationWithoutDrug = { ...validEmergencyMedication };
      delete medicationWithoutDrug.drug;

      const medications = [medicationWithoutDrug];

      const result = modifyEmergencyTreatmentData(medications);
      expect(result).toHaveLength(0);
    });

    it("should return empty array when all medications have null drug", () => {
      const medications = [
        { ...validEmergencyMedication, drug: null, uuid: "em-1" },
        { ...validEmergencyMedication, drug: null, uuid: "em-2" },
      ];

      const result = modifyEmergencyTreatmentData(medications);
      expect(result).toHaveLength(0);
    });

    it("should process all medications when all have valid drug", () => {
      const medications = [
        validEmergencyMedication,
        {
          ...validEmergencyMedication,
          uuid: "em-uuid-2",
          drug: { display: "Ibuprofen" },
        },
      ];

      const result = modifyEmergencyTreatmentData(medications);
      expect(result).toHaveLength(2);
    });

    it("should return empty array for empty input", () => {
      const result = modifyEmergencyTreatmentData([]);
      expect(result).toHaveLength(0);
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
