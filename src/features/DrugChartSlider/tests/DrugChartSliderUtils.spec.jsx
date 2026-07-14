import moment from "moment";
import {
  isInvalidTimeTextPresent,
  isTimePassed,
  validateSchedules,
  updateStartTimeBasedOnFrequency,
  getUTCTimeEpoch,
  saveMedication,
  computeShiftedSchedules,
  detectNextDayCrossings,
  isNextDayCrossing,
  computeShiftedScheduleTimings,
} from "../utils/DrugChartSliderUtils";
import { timeFormatFor24Hr } from "../../../constants";
import MockDate from "mockdate";
import axios from "axios";

jest.mock("axios");

describe("DrugChartSliderUtils", () => {
  document.body.textContent =
    "This is a sample text. Please enter in 24-hr format";

  describe("isInvalidTimeTextPresent", () => {
    it("should return true if invalidTimeText24Hour is present in the body content", () => {
      const result = isInvalidTimeTextPresent(true);
      expect(result).toBe(true);
    });

    it("should return false if invalidTimeText12Hour is present in the body content", () => {
      document.body.textContent =
        "This is a sample text. Please enter in 12-hr format";

      const result = isInvalidTimeTextPresent(false);
      expect(result).toBe(true);
    });

    it("should return false if neither invalidTimeText24Hour nor invalidTimeText12Hour is present in the body content", () => {
      document.body.textContent =
        "This is a sample text without any invalid time text";

      const result = isInvalidTimeTextPresent(true);
      expect(result).toBe(false);
    });
  });

  describe("isTimePassed", () => {
    afterEach(() => {
      MockDate.reset();
    });

    beforeEach(() => {
      MockDate.set("2023-01-01T12:00:00");
    });

    it("should return true if the entered time is in the past", () => {
      const result = isTimePassed("8:00");
      expect(result).toBe(true);
    });

    it("should return false if the entered time is in the future", () => {
      const result = isTimePassed("13:00");
      expect(result).toBe(false);
    });
  });

  describe("validateSchedules", () => {
    it("should return valid when schedules are not empty and in order", async () => {
      const schedules = ["08:00", "12:00", "16:00"];

      const result = await validateSchedules(schedules, timeFormatFor24Hr);

      expect(result).toEqual({ isValid: true, warningType: "" });
    });

    it('should return invalid with warningType "empty" when there is an empty schedule', async () => {
      const schedules = ["08:00", "", "16:00"];

      const result = await validateSchedules(schedules, timeFormatFor24Hr);

      expect(result).toEqual({ isValid: false, warningType: "empty" });
    });

    it('should return invalid with warningType "passed" when schedules are not in order', async () => {
      const schedules = ["08:00", "12:00", "10:00"];

      const result = await validateSchedules(schedules, timeFormatFor24Hr);

      expect(result).toEqual({ isValid: false, warningType: "passed" });
    });

    it("should handle an empty array and return valid", async () => {
      const schedules = [];

      const result = await validateSchedules(schedules, timeFormatFor24Hr);

      expect(result).toEqual({ isValid: true, warningType: "" });
    });
  });

  describe("updateStartTimeBasedOnFrequency", () => {
    it('should update time for "Every Hour"', () => {
      const time = moment("2023-01-01T12:00:00");
      const result = updateStartTimeBasedOnFrequency("Every Hour", time);
      expect(result.format("HH:mm:ss")).toBe("13:00:00");
    });

    it('should update time for "Every 2 hours"', () => {
      const time = moment("2023-01-01T12:00:00");
      const result = updateStartTimeBasedOnFrequency("Every 2 hours", time);
      expect(result.format("HH:mm:ss")).toBe("14:00:00");
    });

    it('should update time for "Nocte (At Night)"', () => {
      const time = moment("2023-01-01T12:00:00");
      const result = updateStartTimeBasedOnFrequency("Nocte (At Night)", time);
      expect(result.format("HH:mm:ss")).toBe("23:59:59");
    });

    it('should update time for "Every 30 minutes"', () => {
      const time = moment("2023-01-01T12:00:00");
      const result = updateStartTimeBasedOnFrequency("Every 30 minutes", time);
      expect(result.format("HH:mm:ss")).toBe("12:30:00");
    });

    it("should handle unknown frequency and return the same time", () => {
      const time = moment("2023-01-01T12:00:00");
      const result = updateStartTimeBasedOnFrequency("Unknown Frequency", time);
      expect(result.format("HH:mm:ss")).toBe("12:00:00");
    });
  });

  describe("getUTCTimeEpoch", () => {
    it("should return the correct UTC time epoch for 24-hour format", () => {
      const time = "14:30";
      const enable24HourTimers = true;
      const scheduledDate = "2023-01-01";

      const result = getUTCTimeEpoch(time, enable24HourTimers, scheduledDate);

      expect(result).toBe(moment.utc("2023-01-01T14:30:00").unix());
    });

    it("should return the correct UTC time epoch for 12-hour format", () => {
      const time = "02:30 PM";
      const enable24HourTimers = false;
      const scheduledDate = "2023-01-01";

      const result = getUTCTimeEpoch(time, enable24HourTimers, scheduledDate);

      expect(result).toBe(moment.utc("2023-01-01T14:30:00").unix());
    });
  });

  describe("saveMedication", () => {
    it("should save medication successfully", async () => {
      const medication = { name: "Medicine A", dosage: "10mg" };

      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { message: "Medication saved successfully" },
      });

      const response = await saveMedication(medication);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "Medication saved successfully",
      });
    });

    it("should handle error during medication save", async () => {
      const medication = { name: "Medicine B", dosage: "20mg" };

      axios.post.mockRejectedValueOnce({
        response: { status: 500, data: { error: "Internal Server Error" } },
      });

      const response = await saveMedication(medication);

      expect(response).toBeUndefined();
    });
  });

  describe("computeShiftedSchedules", () => {
    it("shifts subsequent doses by the same offset as first dose change (24hr)", () => {
      const schedules = ["06:00", "16:00", "23:00"];
      const result = computeShiftedSchedules(schedules, "06:00", "04:00", true);
      expect(result[0]).toBe("04:00");
      expect(result[1]).toBe("14:00");
      expect(result[2]).toBe("21:00");
    });

    it("only changes index 0 when there is one dose (24hr)", () => {
      const schedules = ["06:00"];
      const result = computeShiftedSchedules(schedules, "06:00", "04:00", true);
      expect(result[0]).toBe("04:00");
      expect(result.length).toBe(1);
    });

    it("shifts subsequent doses by offset for 12hr mode", () => {
      const orig0 = moment("06:00 AM", "hh:mm A");
      const orig1 = moment("04:00 PM", "hh:mm A");
      const schedules = [orig0, orig1];
      const result = computeShiftedSchedules(
        schedules,
        orig0,
        "04:00 AM",
        false
      );
      expect(moment.isMoment(result[0])).toBe(true);
      expect(result[0].format("HH:mm")).toBe("04:00");
      expect(result[1].format("HH:mm")).toBe("14:00");
    });
  });

  describe("detectNextDayCrossings", () => {
    it("detects when a shifted dose crosses midnight (24hr)", () => {
      // 21:00 + 240 min = 25:00 → crosses midnight
      const result = detectNextDayCrossings(["21:00"], 240, true);
      expect(result[0]).toBe(true);
    });

    it("returns false when dose does not cross midnight (24hr)", () => {
      // 09:00 + 240 min = 13:00 → no crossing
      const result = detectNextDayCrossings(["09:00"], 240, true);
      expect(result[0]).toBe(false);
    });

    it("detects backward crossing (negative offset, goes before midnight)", () => {
      // 00:30 - 60 min = -30 → crosses midnight into previous day
      const result = detectNextDayCrossings(["00:30"], -60, true);
      expect(result[0]).toBe(true);
    });

    it("returns an array matching the length of subsequentSchedules", () => {
      const result = detectNextDayCrossings(["09:00", "21:00"], 240, true);
      expect(result.length).toBe(2);
      expect(result[0]).toBe(false);
      expect(result[1]).toBe(true);
    });
  });

  describe("computeShiftedScheduleTimings", () => {
    it("shifts all 24hr schedule timings forward by offset (Scenario 1)", () => {
      // Schedule: 06:00, 14:00, 22:00 → +120 min → 08:00, 16:00, 00:00
      const result = computeShiftedScheduleTimings(
        ["06:00", "14:00", "22:00"],
        120,
        true
      );
      expect(result).toEqual(["08:00", "16:00", "00:00"]);
    });

    it("shifts all 24hr schedule timings backward by offset (Scenario 3: -120 min)", () => {
      // Schedule: 06:00, 14:00, 22:00 → -120 min → 04:00, 12:00, 20:00
      const result = computeShiftedScheduleTimings(
        ["06:00", "14:00", "22:00"],
        -120,
        true
      );
      expect(result).toEqual(["04:00", "12:00", "20:00"]);
    });

    it("handles day wrap-around (forward past midnight)", () => {
      // 22:00 + 180 min = 01:00
      const result = computeShiftedScheduleTimings(["22:00"], 180, true);
      expect(result).toEqual(["01:00"]);
    });

    it("handles day wrap-around (backward past midnight)", () => {
      // 01:00 - 120 min = 23:00
      const result = computeShiftedScheduleTimings(["01:00"], -120, true);
      expect(result).toEqual(["23:00"]);
    });

    it("returns moment objects for 12hr mode", () => {
      const result = computeShiftedScheduleTimings(
        ["06:00", "14:00"],
        60,
        false
      );
      result.forEach((item) => expect(moment.isMoment(item)).toBe(true));
      expect(result[0].hours()).toBe(7);
      expect(result[1].hours()).toBe(15);
    });
  });

  describe("isNextDayCrossing", () => {
    it("returns true when 24hr new time is earlier than previous (crosses midnight)", () => {
      // 02:45 after 20:00 → next day
      expect(isNextDayCrossing("02:45", "20:00", true)).toBe(true);
    });

    it("returns false when 24hr new time is later than previous (same day)", () => {
      // 23:45 after 19:00 → same day
      expect(isNextDayCrossing("23:45", "19:00", true)).toBe(false);
    });

    it("returns true when 12hr new time is earlier than previous moment (crosses midnight)", () => {
      const prevMoment = moment("08:00 PM", "hh:mm A");
      expect(isNextDayCrossing("02:45 AM", prevMoment, false)).toBe(true);
    });

    it("returns false when 12hr new time is later than previous moment (same day)", () => {
      const prevMoment = moment("07:00 PM", "hh:mm A");
      expect(isNextDayCrossing("11:45 PM", prevMoment, false)).toBe(false);
    });

    it("returns false when prevTime is invalid (hh:mm placeholder)", () => {
      expect(isNextDayCrossing("02:45", "hh:mm", true)).toBe(false);
    });

    it("returns false when newTime is invalid", () => {
      expect(isNextDayCrossing("", "20:00", true)).toBe(false);
    });
  });
});
