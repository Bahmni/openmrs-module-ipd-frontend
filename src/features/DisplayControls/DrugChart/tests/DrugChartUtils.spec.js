import {
  fetchMedications,
  currentShiftHoursArray,
  getNextShiftDetails,
  getPreviousShiftDetails,
  getDateTime,
  isLateTask,
  isAdministeredLateTask,
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
    ).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
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
    const nextExpectedStartDateTime = 1706704200000; // 31st Jan 2024 18:00
    const nextExpectedEndDateTime = 1706747400000; // 1st Feb 2024 06:00
    expect(startDateTime).toEqual(nextExpectedStartDateTime);
    expect(endDateTime).toEqual(nextExpectedEndDateTime);
  });
  it("test getPreviousShiftDetails method", () => {
    const rangeArray = ["06:00-18:00", "18:00-06:00"];
    const shiftIndex = 1;
    /** startDate = 31st Jan 2024 18:00 */
    const startDate = new Date(1706704200000);
    /** endDate = 1st Feb 2024 06:00 */
    const endDate = new Date(1706747400000);
    const { startDateTime, endDateTime } = getPreviousShiftDetails(
      rangeArray,
      shiftIndex,
      startDate,
      endDate
    );
    const nextExpectedStartDateTime = 1706661000000; // 31st Jan 2024 06:00
    const nextExpectedEndDateTime = 1706704200000; // 31st Jan 2024 18:00
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
  describe("isLateTask method", () => {
    it("should return true if task is late", () => {
      const startTime = Math.floor(new Date().getTime() / 1000) - 4000;
      const drugChart = {
        timeInMinutesFromNowToShowPastTaskAsLate: 1,
      };
      expect(isLateTask(startTime, drugChart)).toBe(true);
    });

    it("should return false if task is not late", () => {
      const startTime = Math.floor(new Date().getTime() / 1000);
      const drugChart = {
        timeInMinutesFromNowToShowPastTaskAsLate: 1,
      };
      expect(isLateTask(startTime, drugChart)).toBe(false);
    });
  });

  describe("isAdministeredLateTask method", () => {
    it("should return true if task is administered late", () => {
      const startTime = Math.floor(new Date().getTime() / 1000) - 2000;
      const effectiveStartDateInMilliSeconds =
        (Math.floor(new Date().getTime() / 1000) - 1000) * 1000;
      const drugChart = {
        timeInMinutesFromStartTimeToShowAdministeredTaskAsLate: 1,
      };
      expect(
        isAdministeredLateTask(
          startTime,
          effectiveStartDateInMilliSeconds,
          drugChart
        )
      ).toBe(true);
    });

    it("should return false if task is not administered late", () => {
      const startTime = Math.floor(new Date().getTime() / 1000);
      const effectiveStartDate = Math.floor(new Date().getTime() / 1000) * 1000;
      const drugChart = {
        timeInMinutesFromStartTimeToShowAdministeredTaskAsLate: 1,
      };
      expect(
        isAdministeredLateTask(startTime, effectiveStartDate, drugChart)
      ).toBe(false);
    });
  });
});
