import axios from "axios";
import { MEDICATIONS_BASE_URL } from "../../../constants";
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

export const areSchedulesInOrder = (allSchedule) => {
  return allSchedule.every((schedule, index) => {
    if (index === 0) return true;
    const currentTime = moment(schedule, "HH:mm");
    const prevTime = moment(allSchedule[index - 1], "HH:mm");
    return currentTime.isAfter(prevTime);
  });
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
