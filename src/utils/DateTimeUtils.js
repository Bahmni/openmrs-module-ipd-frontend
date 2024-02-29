import moment from "moment";
import { defaultDateFormat } from "../constants";

export const formatDate = (value, format = defaultDateFormat) => {
  return value ? moment(value).format(format) : value;
};

export const formatTime = (time, inputFormat, outputFormat) => {
  return moment(time, inputFormat).format(outputFormat);
};

export const areDatesSame = (date1, date2) => {
  return formatDate(date1) === formatDate(date2);
};

export const epochTo24HourTimeFormat = (epochSeconds, includeDate = false) => {
  const formattedTime = moment.unix(epochSeconds).format("HH:mm");

  if (formattedTime === "00:00" && includeDate) {
    const currentDate = moment.unix(epochSeconds).format("DD/MM/YYYY");
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

export const convertDaystoSeconds = (days) => days * 86400;

export const convertTo24Hour = (time12hr) => {
  return moment(time12hr, ["hh:mm A"]).format("HH:mm");
};
