import moment from "moment";

export const isInvalidTimeTextPresent = (
  enable24HourTimers,
  invalidTimeText12Hour,
  invalidTimeText24Hour
) => {
  const screenContent = document.body.textContent;
  const invalidTimeText = enable24HourTimers
    ? invalidTimeText24Hour
    : invalidTimeText12Hour;
  return screenContent.includes(invalidTimeText);
};

export const isTimePassed = (newTime, enable24HourTimers) => {
  const currentTime = moment();
  const enteredTime = enable24HourTimers
    ? moment(newTime, "HH:mm")
    : moment(newTime, "hh:mm A");
  return currentTime.isAfter(enteredTime);
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

export const getUTCTimeEpoch = (time, enable24HourTimers, hostData) => {
  const [hours, minutes] = enable24HourTimers
    ? time.split(":")
    : moment(time, "hh:mm A").format("HH:mm").split(":");
  const [day, month, year] = moment(hostData?.drugOrder?.scheduledDate)
    .format("DD-MM-YYYY")
    .split("-");
  const localTime = moment(
    `${year}-${month}-${day} ${hours}:${minutes}`,
    "YYYY-MM-DD HH:mm"
  );
  const utcTimeEpoch = moment.utc(localTime).unix();
  return utcTimeEpoch;
};
