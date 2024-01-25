import {
  fetchMedications,
  currentShiftHoursArray,
  getNextShiftDetails,
  getPreviousShiftDetails,
  getDateTime,
  getTransformedDrugChartData,
  groupSlotsByDrugName,
} from "../utils/DrugChartUtils";
import axios from "axios";
import {
  drugChartData,
  drugChartDataForGrouping,
  mockResponse,
} from "./DrugChartUtilsMockData";
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
      const expectedUrl = `/openmrs/ws/rest/v1/ipd/schedule/type/medication?patientUuid=${patientUuid}&startTime=${startTime}&endTime=${endTime}`;
      await fetchMedications(patientUuid, startTime, endTime);
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
  describe("TransformDrugChartData", () => {
    it("should transform drug chart data", () => {
      const TransformedDrugChartData =
        getTransformedDrugChartData(drugChartData);
      expect(TransformedDrugChartData).toEqual([
        [
          {
            16: [
              {
                administrationInfo: "",
                minutes: 15,
                notes: undefined,
                status: "Late",
              },
            ],
            19: [
              {
                administrationInfo: "",
                minutes: 2,
                notes: undefined,
                status: "Late",
              },
              {
                administrationInfo: "",
                minutes: 35,
                notes: undefined,
                status: "Late",
              },
            ],
          },
        ],
        [
          {
            administrationInfo: [],
            dosage: "25ml",
            dosingInstructions: '{"Before meals"}',
            dosingTagInfo: {
              asNeeded: false,
              frequency: "Once a day",
            },
            drugName: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
            drugRoute: "Oral",
            duration: "3 Day(s)",
            uuid: "9d7437a9-3f10-11e4-abcd-0800271c1b75",
          },
        ],
      ]);
    });
  });
  describe("groupSlotsByDrugName", () => {
    it("should group slots by drug name", () => {
      const groupedSlots = groupSlotsByDrugName(drugChartDataForGrouping);
      expect(groupedSlots).toEqual({
        "Enalapril 120 mg": [
          {
            id: 2,
            order: {
              asNeeded: false,
              dose: 25,
              doseUnits: {
                display: "ml",
                uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
              },
              dosingInstructions: '{"Before meals"}',
              drug: { display: "Enalapril 120 mg" },
              duration: 3,
              durationUnits: {
                display: "Day(s)",
                uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
              },
              frequency: {
                display: "Once a day",
                uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
              },
              route: {
                display: "Oral",
                uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
              },
              uuid: "9d7437a9-3f10-11e4-abcd-0800271c1b75",
            },
            serviceType: "MedicationRequest",
            startTime: 1690916550,
            status: "SCHEDULED",
            uuid: "738aa77d-03fc-438f-a87a-ae8a8867cyu721",
          },
        ],
        "Paracetamol 120 mg/5 mL Suspension (Liquid)": [
          {
            id: 1,
            order: {
              asNeeded: false,
              dose: 25,
              doseUnits: {
                display: "ml",
                uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
              },
              dosingInstructions: '{"Before meals"}',
              drug: { display: "Paracetamol 120 mg/5 mL Suspension (Liquid)" },
              duration: 3,
              durationUnits: {
                display: "Day(s)",
                uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
              },
              frequency: {
                display: "Once a day",
                uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
              },
              route: {
                display: "Oral",
                uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
              },
              uuid: "9d7437a9-3f10-11e4-abcd-0800271c1b75",
            },
            serviceType: "MedicationRequest",
            startTime: 1690906550,
            status: "SCHEDULED",
            uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
          },
        ],
      });
    });
  });
  it("test currentShiftHoursArray method", () => {
    MockDate.set("2023-12-19 16:00:00");
    expect(currentShiftHoursArray()).toEqual([
      6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    ]);
  });
  it("test getNextShiftDetails method", () => {
    /**  mocked current Date i.e new Date() to 5th Jan 2024 10:00 */
    MockDate.set("2023-01-05 10:00:00");
    const shiftTimeArray = [6, 7, 8, 9, 10, 11, 12, 13];
    const shiftTimeInHours = 8;
    /** date = 5th Jan 2024 14:00 */
    const date = new Date(1704463200000);
    const { startDateTime, endDateTime } = getNextShiftDetails(
      shiftTimeArray,
      shiftTimeInHours,
      date
    );
    const nextExpectedStartDateTime = 1704463200000; // 5th Jan 2024 14:00
    const nextExpectedEndDateTime = 1704492000000; // 5th Jan 2024 22:00
    expect(startDateTime).toEqual(nextExpectedStartDateTime);
    expect(endDateTime).toEqual(nextExpectedEndDateTime);
  });
  it("test getPreviousShiftDetails method", () => {
    /**  mocked current Date i.e new Date() to 5th Jan 2024 16:00 */
    MockDate.set("2023-01-05 16:00:00");
    const shiftTimeArray = [14, 15, 16, 17, 18, 19, 20, 21];
    const shiftTimeInHours = 8;
    /** date = 5th Jan 2024 14:00 */
    const date = new Date(1704463200000);
    const { startDateTime, endDateTime } = getPreviousShiftDetails(
      shiftTimeArray,
      shiftTimeInHours,
      date
    );
    const nextExpectedStartDateTime = 1704434400000; // 5th Jan 2024 06:00
    const nextExpectedEndDateTime = 1704463200000; // 5th Jan 2024 14:00
    expect(startDateTime).toEqual(nextExpectedStartDateTime);
    expect(endDateTime).toEqual(nextExpectedEndDateTime);
  });
  it("test getDateTime method", () => {
    /** 5th Jan 2024 */
    const date = new Date(1704448800000);
    const hour = 8;
    const updatedDateTime = 1704441600000; // 5th Jan 2024 08:00
    expect(getDateTime(date, hour)).toEqual(updatedDateTime);
  });
});
