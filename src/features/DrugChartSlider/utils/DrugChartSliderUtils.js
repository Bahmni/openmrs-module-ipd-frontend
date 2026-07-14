import axios from "axios";
import {
  MEDICATIONS_BASE_URL,
  EDIT_MEDICATIONS_BASE_URL,
  timeFormatFor24Hr,
  timeFormatFor12Hr,
} from "../../../constants";
import moment from "moment";
import {
  epochTo24HourTimeFormat,
  epochTo12HourTimeFormat,
} from "../../../utils/DateTimeUtils";

export const invalidTimeText24Hour = "Please enter in 24-hr format";
export const invalidTimeText12Hour = "Please enter in 12-hr format";

export const isInvalidTimeTextPresent = (enable24HourTimers) => {
  const screenContent = document.body.textContent;
  const invalidTimeText = enable24HourTimers
    ? invalidTimeText24Hour
    : invalidTimeText12Hour;
  return screenContent.includes(invalidTimeText);
};

export const isTimePassed = (
  newTime,
  timeInMinutesToDisableSlots,
  enable24HourTimers = false
) => {
  const currentTime = moment();
  const enteredTime = moment(
    newTime,
    enable24HourTimers ? timeFormatFor24Hr : timeFormatFor12Hr
  ).add(timeInMinutesToDisableSlots, "minutes");
  return currentTime.isAfter(enteredTime);
};

const areSchedulesInOrder = (allSchedule, timeFormat, nextDayFlags = []) => {
  return allSchedule.every((schedule, index) => {
    if (index === 0) return true;
    if (nextDayFlags[index] === true) return true;
    const currentTime = moment.isMoment(schedule)
      ? schedule
      : moment(schedule, timeFormat);
    const prevTime = moment.isMoment(allSchedule[index - 1])
      ? allSchedule[index - 1]
      : moment(allSchedule[index - 1], timeFormat);
    return currentTime.isAfter(prevTime);
  });
};

export const validateSchedules = async (
  schedules,
  timeFormat,
  nextDayFlags = []
) => {
  if (schedules?.length > 0) {
    if (schedules.some((schedule) => schedule === "")) {
      return { isValid: false, warningType: "empty" };
    }

    if (areSchedulesInOrder(schedules, timeFormat, nextDayFlags)) {
      return { isValid: true, warningType: "" };
    } else {
      return { isValid: false, warningType: "passed" };
    }
  }
  return { isValid: true, warningType: "" };
};

export const updateStartTimeBasedOnFrequency = (frequency, time) => {
  switch (frequency) {
    case "Every Hour":
      time.add(1, "hour");
      break;
    case "Every 2 hours":
      time.add(2, "hours");
      break;
    case "Every 3 hours":
      time.add(3, "hours");
      break;
    case "Every 4 hours":
      time.add(4, "hours");
      break;
    case "Every 6 hours":
      time.add(6, "hours");
      break;
    case "Every 8 hours":
      time.add(8, "hours");
      break;
    case "Every 12 hours":
      time.add(12, "hours");
      break;
    case "Once a day":
      time.add(1, "day");
      break;
    case "Nocte (At Night)":
      time.set({ hour: 23, minute: 59, second: 59 });
      break;
    case "Every 30 minutes":
      time.add(30, "minutes");
      break;
    default:
      time.add(1, "day");
      break;
  }
  return time;
};

export const saveMedication = async (medication) => {
  try {
    const response = await axios.post(MEDICATIONS_BASE_URL, medication);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const updateMedication = async (medication) => {
  try {
    const response = await axios.post(EDIT_MEDICATIONS_BASE_URL, medication);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getUTCTimeEpoch = (time, enable24HourTimers, scheduledDate) => {
  const [hours, minutes] = enable24HourTimers
    ? time.split(":")
    : moment(time, timeFormatFor12Hr).format(timeFormatFor24Hr).split(":");
  const [day, month, year] = moment(scheduledDate)
    .format("DD-MM-YYYY")
    .split("-");
  const localTime = moment(
    `${year}-${month}-${day} ${hours}:${minutes}`,
    "YYYY-MM-DD HH:mm"
  );
  const utcTimeEpoch = moment.utc(localTime).unix();
  return utcTimeEpoch;
};

export const setDrugOrderScheduleIn24HourFormat = (schedule) => {
  const drugOrderSchduleIn24HourFormat = {};
  Object.keys(schedule).forEach((key) => {
    if (
      key === "firstDaySlotsStartTime" ||
      key === "dayWiseSlotsStartTime" ||
      key === "remainingDaySlotsStartTime"
    ) {
      const scheduleArray = schedule[key];
      if (scheduleArray) {
        const formattedScheduleArray = scheduleArray.map((schedule) =>
          epochTo24HourTimeFormat(schedule)
        );
        drugOrderSchduleIn24HourFormat[key] = formattedScheduleArray;
      }
    }
  });
  return drugOrderSchduleIn24HourFormat;
};

export const setDrugOrderScheduleIn12HourFormat = (schedule) => {
  const drugOrderSchduleIn12HourFormat = {};
  Object.keys(schedule).forEach((key) => {
    if (
      key === "firstDaySlotsStartTime" ||
      key === "dayWiseSlotsStartTime" ||
      key === "remainingDaySlotsStartTime"
    ) {
      const scheduleArray = schedule[key];
      if (scheduleArray) {
        const formattedScheduleArray = scheduleArray.map((schedule) =>
          epochTo12HourTimeFormat(schedule)
        );
        drugOrderSchduleIn12HourFormat[key] = formattedScheduleArray;
      }
    }
  });
  return drugOrderSchduleIn12HourFormat;
};

export const computeShiftedSchedules = (
  schedules,
  firstDoseOriginal,
  firstDoseNew,
  enable24HourTimers
) => {
  const origMoment = enable24HourTimers
    ? moment(firstDoseOriginal, "HH:mm")
    : moment.isMoment(firstDoseOriginal)
    ? firstDoseOriginal.clone()
    : moment(firstDoseOriginal, timeFormatFor12Hr);
  const newMoment = enable24HourTimers
    ? moment(firstDoseNew, "HH:mm")
    : moment(firstDoseNew, timeFormatFor12Hr);
  const offsetMinutes = newMoment.diff(origMoment, "minutes");

  return schedules.map((schedule, index) => {
    if (index === 0) {
      return enable24HourTimers
        ? firstDoseNew
        : moment(firstDoseNew, timeFormatFor12Hr);
    }
    const scheduleMoment = enable24HourTimers
      ? moment(schedule, "HH:mm")
      : moment.isMoment(schedule)
      ? schedule.clone()
      : moment(schedule, timeFormatFor12Hr);
    const shifted = scheduleMoment.add(offsetMinutes, "minutes");
    return enable24HourTimers ? shifted.format("HH:mm") : shifted;
  });
};

export const isNextDayCrossing = (newTime, prevTime, enable24HourTimers) => {
  if (typeof newTime === "number" && typeof prevTime === "number") {
    return newTime < prevTime;
  }

  const newM = enable24HourTimers
    ? moment(newTime, "HH:mm", true)
    : moment(newTime, timeFormatFor12Hr, true);
  const prevM = enable24HourTimers
    ? moment(prevTime, "HH:mm", true)
    : moment.isMoment(prevTime)
    ? prevTime.clone()
    : moment(prevTime, timeFormatFor12Hr, true);
  if (!newM.isValid() || !prevM.isValid()) return false;
  const newMinutes = newM.hours() * 60 + newM.minutes();
  const prevMinutes = prevM.hours() * 60 + prevM.minutes();
  return newMinutes < prevMinutes;
};

// Determines which schedules will cross midnight after applying offsetMinutes.
// subsequentSchedules must be the CURRENT values (post any prior cascade).
// currentNextDayFlags must match subsequentSchedules index-for-index — pass the
// prior next-day flags so already-shifted next-day slots are treated as 24h+.
export const detectNextDayCrossings = (
  subsequentSchedules,
  offsetMinutes,
  enable24HourTimers,
  currentNextDayFlags = []
) => {
  return subsequentSchedules.map((schedule, i) => {
    const m = enable24HourTimers
      ? moment(schedule, "HH:mm")
      : moment.isMoment(schedule)
      ? schedule.clone()
      : moment(schedule, timeFormatFor12Hr);
    if (!m.isValid()) return false;
    const isAlreadyNextDay = currentNextDayFlags[i] === true;
    const originalMinutes =
      (isAlreadyNextDay ? 24 * 60 : 0) + m.hours() * 60 + m.minutes();
    const shiftedMinutes = originalMinutes + offsetMinutes;
    return shiftedMinutes >= 24 * 60 || shiftedMinutes < 0;
  });
};

// Computes the minute offset between two schedule values (original → updated).
// Values can be HH:mm strings (24hr) or moment objects (12hr).
export const computeOffsetMinutes = (original, updated, enable24HourTimers) => {
  const origM = enable24HourTimers
    ? moment(original, "HH:mm")
    : moment.isMoment(original)
    ? original.clone()
    : moment(original, timeFormatFor12Hr);
  const newM = enable24HourTimers
    ? moment(updated, "HH:mm")
    : moment.isMoment(updated)
    ? updated.clone()
    : moment(updated, timeFormatFor12Hr);
  return newM.diff(origM, "minutes");
};

// Shifts all scheduleTimings (24-hr strings) by offsetMinutes.
// Returns strings for 24-hr mode or moment objects for 12-hr mode,
// matching the format expected by the `schedules` state.
export const computeShiftedScheduleTimings = (
  scheduleTimings,
  offsetMinutes,
  enable24HourTimers
) => {
  return scheduleTimings.map((time) => {
    const m = moment(time, "HH:mm").add(offsetMinutes, "minutes");
    return enable24HourTimers ? m.format("HH:mm") : m;
  });
};
