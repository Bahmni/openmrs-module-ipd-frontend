import moment from "moment";
import {
  isInvalidTimeTextPresent,
  isTimePassed,
  validateSchedules,
  updateStartTimeBasedOnFrequency,
  getUTCTimeEpoch,
  saveMedication,
} from "../utils/DrugChartSliderUtils";
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

      const result = await validateSchedules(schedules);

      expect(result).toEqual({ isValid: true, warningType: "" });
    });

    it('should return invalid with warningType "empty" when there is an empty schedule', async () => {
      const schedules = ["08:00", "", "16:00"];

      const result = await validateSchedules(schedules);

      expect(result).toEqual({ isValid: false, warningType: "empty" });
    });

    it('should return invalid with warningType "passed" when schedules are not in order', async () => {
      const schedules = ["08:00", "12:00", "10:00"];

      const result = await validateSchedules(schedules);

      expect(result).toEqual({ isValid: false, warningType: "passed" });
    });

    it("should handle an empty array and return valid", async () => {
      const schedules = [];

      const result = await validateSchedules(schedules);

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
});
