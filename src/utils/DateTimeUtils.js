import moment from "moment";
import {
  dateFormat,
  defaultDateFormat,
  defaultDateTimeFormat12Hrs,
  defaultDateTimeFormat24Hrs,
  timeFormatFor12Hr,
  timeFormatFor24Hr,
} from "../constants";
import {
  currentShiftHoursArray,
  getDateTime,
} from "../features/DisplayControls/DrugChart/utils/DrugChartUtils";

export const formatDate = (value, format = defaultDateFormat) => {
  return value ? moment(value).format(format) : value;
};

export const formatTime = (time, inputFormat, outputFormat) => {
  return moment(time, inputFormat).format(outputFormat);
};

export const areDatesSame = (date1, date2) => {
  return formatDate(date1) === formatDate(date2);
};

export const epochTo24HourFormat = (epochSeconds) => {
  return moment.unix(epochSeconds).format(timeFormatFor24Hr);
};

const getDateTimeForHour = (time, date = new Date()) => {
  return getDateTime(date, time) / 1000;
};

export const getCurrentShiftTimes = (shiftConfig) => {
  const { currentShiftHoursArray: currentShift } = currentShiftHoursArray(
    new Date(),
    shiftConfig
  );
  const firstHour = currentShift[0];

  const lastHour = currentShift[currentShift.length - 1];
  let startDateTime = getDateTimeForHour(firstHour);

  let endDateTime = getDateTimeForHour(lastHour + 1);
  if (lastHour < firstHour) {
    const currentDate = new Date();

    const currentHour = currentDate.getHours();
    if (currentHour > 12) {
      currentDate.setDate(currentDate.getDate() + 1);
      endDateTime = getDateTimeForHour(lastHour + 1, currentDate);
    } else {
      currentDate.setDate(currentDate.getDate() - 1);
      startDateTime = getDateTimeForHour(firstHour, currentDate);
    }
  }
  return { startDateTime, endDateTime };
};

export const epochTo24HourTimeFormat = (epochSeconds, includeDate = false) => {
  const formattedTime = moment.unix(epochSeconds).format(timeFormatFor24Hr);

  if (formattedTime === "00:00" && includeDate) {
    const currentDate = moment.unix(epochSeconds).format(dateFormat);
    return `${formattedTime} (${currentDate})`;
  } else {
    return formattedTime;
  }
};

export const getPreviousNearbyHourEpoch = (time) => {
  const currentMoment = moment.unix(time);
  const nearestHourMoment = currentMoment.startOf("hour");
  return nearestHourMoment.unix();
};

export const getTimeInFuture = (startTimeEpoch, offsetHours) => {
  const futureTime = moment.unix(startTimeEpoch).add(offsetHours, "hours");
  return futureTime.unix();
};

export const getTimeInPast = (startTimeEpoch, offsetHours) => {
  const pastTime = moment.unix(startTimeEpoch).subtract(offsetHours, "hours");
  return pastTime.unix();
};

export const epochTo12HourTimeFormat = (epochSeconds) => {
  const formattedTime = moment.unix(epochSeconds).format(timeFormatFor12Hr);
  return formattedTime;
};

export const dateTimeToEpochUTCTime = (date) => {
  const epochTime = moment.utc(date).unix();
  return epochTime;
};

export const dateTimeToEpochInMilliSeconds = (dateTimeString) => {
  return moment(dateTimeString).unix() * 1000;
};
export const convertDaystoSeconds = (days) => days * 86400;

export const convertTo24Hour = (time12hr) => {
  return moment(time12hr, [timeFormatFor12Hr]).format(timeFormatFor24Hr);
};

export const isTimeInFuture = (time1, time2) => {
  const time1_24hr = convertTo24Hour(time1);
  const time2_24hr = convertTo24Hour(time2);
  return time1_24hr > time2_24hr;
};

export const add30Minutes = (timeStr) => {
  const originalTime = moment(timeStr, "HH:mm");
  const incrementedTime = originalTime.clone().add(30, "minutes");
  return [originalTime.format("HH:mm"), incrementedTime.format("HH:mm")];
};

export const getFormattedDateTime = (
  hours,
  minutes,
  enable24hrsFormat = true
) => {
  const time = moment().set({ hour: hours, minute: minutes });
  if (enable24hrsFormat) {
    return time.format(timeFormatFor24Hr);
  }
  return time.format(timeFormatFor12Hr);
};

export const getFormattedDateTimeFromEpochTime = (
  milliseconds,
  enable24hrsFormat = true
) => {
  const time = moment(milliseconds);
  if (enable24hrsFormat) {
    return time.format(timeFormatFor24Hr);
  }
  return time.format(timeFormatFor12Hr);
};

export const getDateTimeFromEpochTime = (
  milliseconds,
  enable24hrsFormat = true
) => {
  const time = moment(milliseconds);
  if (enable24hrsFormat) {
    return time.format(defaultDateTimeFormat24Hrs);
  }
  return time.format(defaultDateTimeFormat12Hrs);
};
