import axios from "axios";
import {
  MEDICATIONS_BASE_URL,
  EDIT_MEDICATIONS_BASE_URL,
} from "../../../constants";
import moment from "moment";

export const invalidTimeText24Hour = "Please enter in 24-hr format";
export const invalidTimeText12Hour = "Please enter in 12-hr format";

export const isInvalidTimeTextPresent = (enable24HourTimers) => {
  const screenContent = document.body.textContent;
  const invalidTimeText = enable24HourTimers
    ? invalidTimeText24Hour
    : invalidTimeText12Hour;
  return screenContent.includes(invalidTimeText);
};

export const isTimePassed = (newTime) => {
  const currentTime = moment();
  const enteredTime = moment(newTime, "HH:mm");
  return currentTime.isAfter(enteredTime);
};

const areSchedulesInOrder = (allSchedule) => {
  return allSchedule.every((schedule, index) => {
    if (index === 0) return true;
    const currentTime = moment(schedule, "HH:mm");
    const prevTime = moment(allSchedule[index - 1], "HH:mm");
    return currentTime.isAfter(prevTime);
  });
};

export const validateSchedules = async (schedules) => {
  if (schedules.some((schedule) => schedule === "")) {
    return { isValid: false, warningType: "empty" };
  }

  if (areSchedulesInOrder(schedules)) {
    return { isValid: true, warningType: "" };
  } else {
    return { isValid: false, warningType: "passed" };
  }
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
    : moment(time, "hh:mm A").format("HH:mm").split(":");
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

export const epochTo24HourTimeFormat = (epochSeconds) => {
  const date = new Date(epochSeconds * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
};

export const epochTo12HourTimeFormat = (epochSeconds) => {
  const date = new Date(epochSeconds * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
  const formattedTime = `${formattedHours}:${minutes} ${amOrPm}`;
  return formattedTime;
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
