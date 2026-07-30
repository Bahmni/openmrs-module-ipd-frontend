import {
  fetchMedications,
  currentShiftHoursArray,
  getNextShiftDetails,
  getPreviousShiftDetails,
  getDateTime,
  canAcknowledgeAmendment,
  transformDrugOrders,
  mapDrugOrdersAndSlots,
} from "../utils/DrugChartUtils";
import axios from "axios";
import { mockResponse } from "./DrugChartUtilsMockData";
import MockDate from "mockdate";
jest.mock("axios");
describe("DrugChartUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    MockDate.reset();
  });
  describe("fetchMedications", () => {
    it("should make axios get call with url", async () => {
      axios.get.mockImplementation(() => Promise.resolve(mockResponse));
      const patientUuid = "test-uuid";
      const startTime = "1704501000";
      const endTime = "1704529800";
      const visitUuid = "test-uuid";
      const expectedUrl = `/openmrs/ws/rest/v1/ipd/schedule/type/medication?patientUuid=${patientUuid}&startTime=${startTime}&endTime=${endTime}&view=drugChart&visitUuid=${visitUuid}`;
      await fetchMedications(patientUuid, startTime, endTime, visitUuid);
      expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    });
    it("should return response data", async () => {
      axios.get.mockImplementation(() => Promise.resolve(mockResponse));
      const patientUuid = "test-uuid";
      const forDate = "1690906550";
      const response = await fetchMedications(patientUuid, forDate);
      expect(response).toEqual(mockResponse);
    });
    it("should reject with error", async () => {
      const error = new Error("Error while fetching medications");
      axios.get.mockRejectedValue(error);
      const patientUuid = "test-uuid";
      const forDate = "1690906550";
      try {
        await fetchMedications(patientUuid, forDate);
      } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e).toEqual(error);
      }
    });
  });
  it("test currentShiftHoursArray method", () => {
    const shiftDetails = {
      1: { shiftStartTime: "06:00", shiftEndTime: "18:00" },
      2: { shiftStartTime: "18:00", shiftEndTime: "06:00" },
    };
    MockDate.set("2023-12-19 16:00:00");
    expect(
      currentShiftHoursArray(new Date(), shiftDetails).currentShiftHoursArray
    ).toEqual([
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ]);
  });
  it("test getNextShiftDetails method", () => {
    const rangeArray = ["06:00-18:00", "18:00-06:00"];
    const shiftIndex = 0;
    /** startDate = 31st Jan 2024 06:00 */
    const startDate = new Date(1706661000000);
    /** endDate = 31st Jan 2024 18:00 */
    const endDate = new Date(1706704200000);
    const { startDateTime, endDateTime } = getNextShiftDetails(
      rangeArray,
      shiftIndex,
      startDate,
      endDate
    );
    const nextExpectedStartDateTime = 1706724000000; // 31st Jan 2024 18:00
    const nextExpectedEndDateTime = 1706767200000; // 1st Feb 2024 06:00
    expect(startDateTime).toEqual(nextExpectedStartDateTime);
    expect(endDateTime).toEqual(nextExpectedEndDateTime);
  });

  it("test getNextShiftDetails method with change in minutes", () => {
    const shiftDetails = {
      1: { shiftStartTime: "06:30", shiftEndTime: "18:00" },
      2: { shiftStartTime: "18:00", shiftEndTime: "06:30" },
    };
    MockDate.set("2023-12-19 16:00:00");
    expect(
      currentShiftHoursArray(new Date(), shiftDetails).currentShiftHoursArray
    ).toEqual([
      "06:30",
      "07:30",
      "08:30",
      "09:30",
      "10:30",
      "11:30",
      "12:30",
      "13:30",
      "14:30",
      "15:30",
      "16:30",
      "17:30",
    ]);
  });

  it("test getPreviousShiftDetails method", () => {
    const rangeArray = ["06:00-18:00", "18:00-06:00"];
    const shiftIndex = 1;
    /** startDate = 31st Jan 2024 18:00 GMT */
    const startDate = 1706704200000;
    /** endDate = 1st Feb 2024 06:00 GMT */
    const endDate = 1706747400000;
    const { startDateTime, endDateTime } = getPreviousShiftDetails(
      rangeArray,
      shiftIndex,
      startDate,
      endDate
    );
    const nextExpectedStartDateTime = 1706680800000; // 31st Jan 2024 06:00 GMT
    const nextExpectedEndDateTime = 1706724000000; // 31st Jan 2024 18:00 GMT
    expect(startDateTime).toEqual(nextExpectedStartDateTime);
    expect(endDateTime).toEqual(nextExpectedEndDateTime);
  });
  it("test getDateTime method", () => {
    /** 5th Jan 2024 */
    const date = new Date(1704448800000);
    const time = "08:00";
    const updatedDateTime = 1704441600000; // 5th Jan 2024 08:00
    expect(getDateTime(date, time)).toEqual(updatedDateTime);
  });
  describe("canAcknowledgeAmendment", () => {
    it("returns true when privileges include ADT_APPROVE_AMEND_NOTE", () => {
      const privileges = [
        { name: "app:adt:approveAmendNote" },
        { name: "OTHER_PRIVILEGE" },
      ];
      expect(canAcknowledgeAmendment(privileges)).toBe(true);
    });

    it("returns false when privileges do not include ADT_APPROVE_AMEND_NOTE", () => {
      const privileges = [{ name: "OTHER_PRIVILEGE" }];
      expect(canAcknowledgeAmendment(privileges)).toBe(false);
    });

    it("returns false when privileges is an empty array", () => {
      expect(canAcknowledgeAmendment([])).toBe(false);
    });

    it("returns false when privileges is null", () => {
      expect(canAcknowledgeAmendment(null)).toBe(false);
    });

    it("returns false when privileges is undefined", () => {
      expect(canAcknowledgeAmendment(undefined)).toBe(false);
    });
  });

  describe("transformDrugOrders - dosage formatting", () => {
    const createOrder = (doseUnits) => ({
      drugOrder: {
        uuid: "order-1",
        careSetting: "INPATIENT",
        drug: { name: "Drug A" },
        duration: 5,
        durationUnits: "Day(s)",
        dosingInstructions: {
          dose: 10,
          doseUnits,
          route: "Oral",
          frequency: { display: "Daily" },
          administrationInstructions: "{}",
        },
      },
      drugOrderSchedule: { slotStartTime: 1000 },
    });

    it("should concatenate compact units (ml, mg, mcg) with dose", () => {
      ["ml", "mg", "mcg"].forEach((unit) => {
        const result = transformDrugOrders({
          ipdDrugOrders: [createOrder(unit)],
          emergencyMedications: [],
        });
        const med = result["order-1"];
        expect(med.dosingInstructions.dosage).toBe(`10${unit}`);
        expect(med.dosingInstructions.doseUnits).toBeUndefined();
      });
    });

    it("should separate non-compact units (e.g., Tablet) from dose", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createOrder("Tablet")],
        emergencyMedications: [],
      });
      const med = result["order-1"];
      expect(med.dosingInstructions.dosage).toBe(10);
      expect(med.dosingInstructions.doseUnits).toBe("Tablet");
    });

    it("should handle compact units in emergency medications", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [],
        emergencyMedications: [
          {
            uuid: "emerg-1",
            dose: 20,
            doseUnits: { display: "mcg" },
            drug: { uuid: "drug-1", display: "Drug B" },
            route: { display: "IV" },
            administeredDateTime: 2000000,
          },
        ],
      });
      const med = result["emerg-1"];
      expect(med.dosingInstructions.dosage).toBe("20mcg");
      expect(med.dosingInstructions.doseUnits).toBeUndefined();
    });

    it("should use effectiveStartDate / 1000 as firstSlotStartTime for PRN (asNeeded) orders", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [
          {
            drugOrder: {
              uuid: "prn-order-1",
              careSetting: "INPATIENT",
              drug: { name: "PRN Drug" },
              duration: 3,
              durationUnits: "Day(s)",
              effectiveStartDate: 1704441600000,
              dosingInstructions: {
                dose: 5,
                doseUnits: "mg",
                route: "Oral",
                frequency: { display: "As needed" },
                administrationInstructions: "{}",
                asNeeded: true,
              },
            },
            drugOrderSchedule: { slotStartTime: 9999 },
          },
        ],
        emergencyMedications: [],
      });
      const med = result["prn-order-1"];
      expect(med.firstSlotStartTime).toBe(1704441600000 / 1000);
    });

    it("should handle non-compact units in emergency medications", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [],
        emergencyMedications: [
          {
            uuid: "emerg-1",
            dose: 2,
            doseUnits: { display: "Tablet" },
            drug: { uuid: "drug-1", display: "Drug C" },
            route: { display: "Oral" },
            administeredDateTime: 2000000,
          },
        ],
      });
      const med = result["emerg-1"];
      expect(med.dosingInstructions.dosage).toBe(2);
      expect(med.dosingInstructions.doseUnits).toBe("Tablet");
    });

    it("should parse rate and additives from administrationInstructions JSON", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [
          {
            drugOrder: {
              uuid: "order-2",
              careSetting: "INPATIENT",
              drug: { name: "Normal Saline IV" },
              duration: 7,
              durationUnits: "Day(s)",
              dosingInstructions: {
                dose: 100,
                doseUnits: "ml",
                route: "Intravenous",
                frequency: { display: "Once daily" },
                administrationInstructions: JSON.stringify({
                  instructions: "For IV infusion",
                  additionalInstructions: "Monitor vitals",
                  rate: 100,
                  additives: "10 mEq KCl in saline",
                }),
              },
            },
            drugOrderSchedule: { slotStartTime: 1000 },
          },
        ],
        emergencyMedications: [],
      });
      const med = result["order-2"];
      expect(med.dosingInstructions.instructions.rate).toBe(100);
      expect(med.dosingInstructions.instructions.additives).toBe(
        "10 mEq KCl in saline"
      );
      expect(med.dosingInstructions.instructions.instructions).toBe(
        "For IV infusion"
      );
      expect(med.dosingInstructions.instructions.additionalInstructions).toBe(
        "Monitor vitals"
      );
    });

    it("should handle missing rate and additives in administrationInstructions", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [
          {
            drugOrder: {
              uuid: "order-3",
              careSetting: "INPATIENT",
              drug: { name: "Paracetamol" },
              duration: 5,
              durationUnits: "Day(s)",
              dosingInstructions: {
                dose: 1,
                doseUnits: "Tablet",
                route: "Oral",
                frequency: { display: "Three times daily" },
                administrationInstructions: JSON.stringify({
                  instructions: "Take with water",
                }),
              },
            },
            drugOrderSchedule: { slotStartTime: 2000 },
          },
        ],
        emergencyMedications: [],
      });
      const med = result["order-3"];
      expect(med.dosingInstructions.instructions.rate).toBeUndefined();
      expect(med.dosingInstructions.instructions.additives).toBeUndefined();
      expect(med.dosingInstructions.instructions.instructions).toBe(
        "Take with water"
      );
    });
  });

  describe("transformDrugOrders - variable dose", () => {
    const createVariableOrder = (stageSchedules = []) => ({
      drugOrder: {
        uuid: "vd-order-1",
        careSetting: "INPATIENT",
        drug: { name: "VD Drug" },
        effectiveStartDate: 1704785404000,
        duration: 5,
        durationUnits: "Day(s)",
        dosingInstructions: {
          dose: null,
          doseUnits: "mg",
          route: "Oral",
          frequency: null,
          quantity: 18,
          quantityUnits: "Tablet(s)",
          administrationInstructions: JSON.stringify([
            {
              sequence: 1,
              text: "Loading Dose",
              timing: { code: { text: "Once" }, repeat: { count: 1 } },
              doseAndRate: [{ doseQuantity: { value: 5, unit: "Tablet(s)" } }],
              additionalInstruction: [],
              patientInstruction: "",
            },
            {
              sequence: 2,
              text: "Stage 1",
              timing: {
                code: { text: "Once a day" },
                repeat: { duration: 3, durationUnit: "d" },
              },
              doseAndRate: [{ doseQuantity: { value: 3, unit: "Tablet(s)" } }],
              additionalInstruction: [],
              patientInstruction: "",
            },
          ]),
        },
      },
      drugOrderSchedule: {
        stageSchedules,
        slotStartTime: null,
        dayWiseSlotsStartTime: null,
      },
    });

    const createRegularOrder = () => ({
      drugOrder: {
        uuid: "regular-order-1",
        careSetting: "INPATIENT",
        drug: { name: "Regular Drug" },
        duration: 3,
        durationUnits: "Day(s)",
        dosingInstructions: {
          dose: 10,
          doseUnits: "mg",
          route: "Oral",
          frequency: { display: "Daily" },
          administrationInstructions: "{}",
        },
      },
      drugOrderSchedule: { slotStartTime: 1000 },
    });

    it("sets isVariableDose true for FhirDosingInstructions order", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createVariableOrder()],
        emergencyMedications: [],
      });
      expect(result["vd-order-1"].isVariableDose).toBe(true);
    });

    it("uses quantity as dosage for variable dose order", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createVariableOrder()],
        emergencyMedications: [],
      });
      expect(result["vd-order-1"].dosingInstructions.dosage).toBe(18);
    });

    it("sets instructions to null for variable dose", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createVariableOrder()],
        emergencyMedications: [],
      });
      expect(result["vd-order-1"].dosingInstructions.instructions).toBeNull();
    });

    it("sets notes to null for variable dose", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createVariableOrder()],
        emergencyMedications: [],
      });
      expect(result["vd-order-1"].notes).toBeNull();
    });

    it("uses effectiveStartDate as firstSlotStartTime for variable dose", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createVariableOrder()],
        emergencyMedications: [],
      });
      expect(result["vd-order-1"].firstSlotStartTime).toBe(
        1704785404000 / 1000
      );
    });

    it("passes stageSchedules from drugOrderSchedule", () => {
      const stageSchedules = [{ variableDosageSequence: 1 }];
      const result = transformDrugOrders({
        ipdDrugOrders: [createVariableOrder(stageSchedules)],
        emergencyMedications: [],
      });
      expect(result["vd-order-1"].stageSchedules).toEqual(stageSchedules);
    });

    it("sets fhirDosages from parsedInstructions", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createVariableOrder()],
        emergencyMedications: [],
      });
      expect(result["vd-order-1"].fhirDosages).toHaveLength(2);
      expect(result["vd-order-1"].fhirDosages[0].sequence).toBe(1);
      expect(result["vd-order-1"].fhirDosages[1].sequence).toBe(2);
    });

    it("regular order is not affected - isVariableDose is false", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createRegularOrder()],
        emergencyMedications: [],
      });
      expect(result["regular-order-1"].isVariableDose).toBe(false);
    });
  });

  describe("transformDrugOrders - intraday orders", () => {
    const createIntradayOrder = () => ({
      drugOrder: {
        uuid: "intraday-order-1",
        careSetting: "INPATIENT",
        drug: { name: "Prednisolone" },
        duration: 5,
        durationUnits: "Day(s)",
        dosingInstructions: {
          dose: null,
          doseUnits: "mg",
          route: "Oral",
          frequency: null,
          administrationInstructions: JSON.stringify({
            morningDose: 10,
            afternoonDose: 0,
            eveningDose: 30,
            nightDose: 10,
          }),
        },
      },
      drugOrderSchedule: { slotStartTime: 1000 },
    });

    it("sets isIntraday to true for an intraday order", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createIntradayOrder()],
        emergencyMedications: [],
      });
      expect(result["intraday-order-1"].isIntraday).toBe(true);
    });

    it("sets intradayDoseString with correct format", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [createIntradayOrder()],
        emergencyMedications: [],
      });
      expect(result["intraday-order-1"].intradayDoseString).toBe(
        "10-0-30-10 mg - Oral - for 5 Day(s)"
      );
    });

    it("sets isIntraday to false for a non-intraday order", () => {
      const result = transformDrugOrders({
        ipdDrugOrders: [
          {
            drugOrder: {
              uuid: "regular-1",
              careSetting: "INPATIENT",
              drug: { name: "Drug A" },
              duration: 3,
              durationUnits: "Day(s)",
              dosingInstructions: {
                dose: 10,
                doseUnits: "Tablet",
                route: "Oral",
                frequency: "Once a day",
                administrationInstructions: "{}",
              },
            },
            drugOrderSchedule: { slotStartTime: 1000 },
          },
        ],
        emergencyMedications: [],
      });
      expect(result["regular-1"].isIntraday).toBe(false);
      expect(result["regular-1"].intradayDoseString).toBeNull();
    });
  });

  describe("mapDrugOrdersAndSlots", () => {
    it("deduplicates slots having same order and startTime", () => {
      const orderUuid = "order-1";
      const startTime = 1784075400;
      const drugOrders = {
        [orderUuid]: {
          firstSlotStartTime: startTime,
          slots: [],
        },
      };

      const drugChartData = [
        {
          slots: [
            {
              id: 1,
              startTime,
              status: "SCHEDULED",
              serviceType: "MedicationRequest",
              order: { uuid: orderUuid },
              medicationAdministration: null,
            },
            {
              id: 2,
              startTime,
              status: "SCHEDULED",
              serviceType: "MedicationRequest",
              order: { uuid: orderUuid },
              medicationAdministration: null,
            },
          ],
        },
      ];

      const mapped = mapDrugOrdersAndSlots(drugChartData, drugOrders, {
        timeInMinutesFromNowToShowPastTaskAsLate: 0,
      });
      expect(mapped).toHaveLength(1);
      expect(mapped[0].slots).toHaveLength(1);
      expect(mapped[0].slots[0].startTime).toBe(startTime);
     });
   });
  describe("transformDrugOrders", () => {
    it("should skip emergency medications with null drug", () => {
      const orders = {
        ipdDrugOrders: [],
        emergencyMedications: [
          {
            drug: null,
            uuid: "em-uuid-1",
            route: { display: "Oral" },
            administeredDateTime: 1700000000000,
            dose: 500,
            doseUnits: { display: "mg" },
          },
        ],
      };
      const result = transformDrugOrders(orders);
      expect(result).toEqual({});
    });

    it("should skip emergency medications with undefined drug", () => {
      const orders = {
        ipdDrugOrders: [],
        emergencyMedications: [
          {
            uuid: "em-uuid-1",
            route: { display: "Oral" },
            administeredDateTime: 1700000000000,
            dose: 500,
            doseUnits: { display: "mg" },
          },
        ],
      };
      const result = transformDrugOrders(orders);
      expect(result).toEqual({});
    });

    it("should process emergency medications with valid drug", () => {
      const orders = {
        ipdDrugOrders: [],
        emergencyMedications: [
          {
            drug: { uuid: "drug-uuid", display: "Paracetamol" },
            uuid: "em-uuid-1",
            route: { display: "Oral" },
            administeredDateTime: 1700000000000,
            dose: 500,
            doseUnits: { display: "mg" },
          },
        ],
      };
      const result = transformDrugOrders(orders);
      expect(result["em-uuid-1"]).toBeDefined();
      expect(result["em-uuid-1"].name).toBe("Paracetamol");
      expect(result["em-uuid-1"].dosingInstructions.emergency).toBe(true);
      expect(result["em-uuid-1"].dosingInstructions.dosage).toBe("500mg");
      expect(result["em-uuid-1"].dosingInstructions.route).toBe("Oral");
      expect(result["em-uuid-1"].firstSlotStartTime).toBe(1700000000);
    });

    it("should process mix of valid and null-drug emergency medications", () => {
      const orders = {
        ipdDrugOrders: [],
        emergencyMedications: [
          {
            drug: null,
            uuid: "em-null",
            route: { display: "Oral" },
            administeredDateTime: 1700000000000,
            dose: 500,
            doseUnits: { display: "mg" },
          },
          {
            drug: { uuid: "drug-uuid", display: "Ibuprofen" },
            uuid: "em-valid",
            route: { display: "IV" },
            administeredDateTime: 1700001000000,
            dose: 200,
            doseUnits: { display: "ml" },
          },
        ],
      };
      const result = transformDrugOrders(orders);
      expect(result["em-null"]).toBeUndefined();
      expect(result["em-valid"]).toBeDefined();
      expect(result["em-valid"].name).toBe("Ibuprofen");
    });
  });
});
