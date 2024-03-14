import moment from "moment";
import { dateFormat, defaultDateFormat } from "../constants";
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

const getDateTimeForHour = (hour, date = new Date()) => {
  return getDateTime(date, hour) / 1000;
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
  const formattedTime = moment.unix(epochSeconds).format("HH:mm");

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

export const epochTo12HourTimeFormat = (epochSeconds) => {
  const formattedTime = moment.unix(epochSeconds).format("hh:mm A");
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
  return moment(time12hr, ["hh:mm A"]).format("HH:mm");
};

export const isTimeInFuture = (time1, time2) => {
  const time1_24hr = convertTo24Hour(time1);
  const time2_24hr = convertTo24Hour(time2);
  return time1_24hr > time2_24hr;
};
