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

export const epochTo24HourTimeFormat = (epochSeconds) => {
  const formattedTime = moment.unix(epochSeconds).format("HH:mm");
  return formattedTime;
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

export const isTimeInFuture = (time1, time2) => {
  const time1_24hr = convertTo24Hour(time1);
  const time2_24hr = convertTo24Hour(time2);
  return time1_24hr > time2_24hr;
};
