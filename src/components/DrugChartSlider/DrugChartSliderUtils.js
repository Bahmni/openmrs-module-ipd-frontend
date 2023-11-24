import moment from "moment";
import { medicationFrequency } from "../../constants";

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

const isTimePassed = (newTime, enable24HourTimers) => {
  const currentTime = moment();
  const enteredTime = enable24HourTimers
    ? moment(newTime, "HH:mm")
    : moment(newTime, "hh:mm A");
  return currentTime.isAfter(enteredTime);
};

const getUTCTimeEpoch = (time, enable24HourTimers, hostData) => {
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

// Start time Functions

const isStartTimeExceedingFrequency = (time, frequency, enable24HourTimers) => {
  const currentTime = moment();
  const enteredTime = enable24HourTimers
    ? moment(time, "HH:mm")
    : moment(time, "hh:mm A");
  const updatedTime = updateStartTimeBasedOnFrequency(frequency, currentTime);
  return enteredTime.isAfter(updatedTime);
};

const updateStartTimeBasedOnFrequency = (frequency, time) => {
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

export const handleStartTime = async (
  time,
  enable24HourTimers,
  hostData,
  setShowEmptyStartTimeWarning,
  setShowStartTimeBeyondNextDoseWarning,
  setShowStartTimePassedWarning,
  setStartTime
) => {
  if (time === "") {
    setShowEmptyStartTimeWarning(true);
    setShowStartTimeBeyondNextDoseWarning(false);
    setShowStartTimePassedWarning(false);
    return;
  } else {
    setShowEmptyStartTimeWarning(false);
  }
  if (
    (enable24HourTimers && !moment(time, "HH:mm", true).isValid()) ||
    (!enable24HourTimers && !moment(time, "hh:mm A", true).isValid())
  ) {
    setStartTime(time);
    return;
  }
  isStartTimeExceedingFrequency(
    time,
    hostData?.drugOrder?.uniformDosingType?.frequency,
    enable24HourTimers
  )
    ? setShowStartTimeBeyondNextDoseWarning(true)
    : setShowStartTimeBeyondNextDoseWarning(false);
  isTimePassed(time, enable24HourTimers)
    ? setShowStartTimePassedWarning(true)
    : setShowStartTimePassedWarning(false);

  enable24HourTimers
    ? setStartTime(time)
    : setStartTime(moment(time, "hh:mm A"));
};

// Schedule Functions

const areSchedulesInOrder = (allSchedule) => {
  return allSchedule.every((schedule, index) => {
    if (index === 0) return true;
    const currentTime = moment(schedule, "HH:mm");
    const prevTime = moment(allSchedule[index - 1], "HH:mm");
    return currentTime.isAfter(prevTime);
  });
};

const validateSchedules = async (schedules) => {
  if (schedules.some((schedule) => schedule === "")) {
    return { isValid: false, warningType: "empty" };
  }

  if (areSchedulesInOrder(schedules)) {
    return { isValid: true, warningType: "" };
  } else {
    return { isValid: false, warningType: "passed" };
  }
};

const handleScheduleWarnings = async (
  schedules,
  setShowEmptyScheduleWarning,
  setShowScheduleOrderWarning
) => {
  const { isValid, warningType } = await validateSchedules(schedules);
  setShowEmptyScheduleWarning(!isValid && warningType === "empty");
  setShowScheduleOrderWarning(!isValid && warningType === "passed");
  return { isValid, warningType };
};

export const isValidSchedule = async (
  schedules,
  setShowEmptyScheduleWarning,
  setShowScheduleOrderWarning
) => {
  const { isValid, warningType } = await handleScheduleWarnings(
    schedules,
    setShowEmptyScheduleWarning,
    setShowScheduleOrderWarning
  );
  if (!isValid && (warningType === "empty" || warningType === "passed"))
    return false;
  return true;
};

export const handleSchedule = (
  newSchedule,
  index,
  schedules,
  setSchedules,
  enable24HourTimers,
  invalidTimeText12Hour,
  invalidTimeText24Hour,
  setShowSchedulePassedWarning
) => {
  const newScheduleArray = [...schedules];
  newScheduleArray[index] = enable24HourTimers
    ? newSchedule
    : moment(newSchedule, "hh:mm A");
  setSchedules(newScheduleArray);
  if (
    !isInvalidTimeTextPresent(
      enable24HourTimers,
      invalidTimeText12Hour,
      invalidTimeText24Hour
    )
  ) {
    setShowSchedulePassedWarning((prevScheduleWarnings) => {
      const newSchedulePassedWarnings = [...prevScheduleWarnings];
      newSchedulePassedWarnings[index] = isTimePassed(
        newSchedule,
        enable24HourTimers
      );
      return newSchedulePassedWarnings;
    });
  }
};

// Medicaiton Save Functions

export const createDrugChartPayload = (
  hostData,
  drugChartNotes,
  enableStartTime,
  enableSchedule,
  enable24HourTimers,
  schedules,
  startTime
) => {
  var payload = {
    providerUuid: hostData?.drugOrder?.provider?.uuid,
    patientUuid: hostData?.patientId,
    orderUuid: hostData?.drugOrder?.uuid,
    slotStartTime: null,
    firstDaySlotsStartTime: null,
    dayWiseSlotsStartTime: null,
    comments: drugChartNotes,
    medicationFrequency: "",
  };
  if (enableStartTime) {
    const startTimeUTCEpoch = getUTCTimeEpoch(
      startTime,
      enable24HourTimers,
      hostData
    );
    payload.slotStartTime = startTimeUTCEpoch;
    payload.medicationFrequency =
      medicationFrequency.START_TIME_DURATION_FREQUENCY;
  }
  if (enableSchedule) {
    const schedulesUTCTimeEpoch = schedules.map((schedule) => {
      return getUTCTimeEpoch(schedule, enable24HourTimers, hostData);
    });
    payload.dayWiseSlotsStartTime = schedulesUTCTimeEpoch;
    payload.firstDaySlotsStartTime = [];
    payload.medicationFrequency = medicationFrequency.FIXED_SCHEDULE_FREQUENCY;
  }
  return payload;
};
