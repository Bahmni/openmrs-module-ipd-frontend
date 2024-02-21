import moment from "moment";
import { defaultDateFormat } from "../constants";

export const formatDate = (value, format = defaultDateFormat) => {
  return value ? moment(value).format(format) : value;
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
  const [time, period] = time12hr?.split(" ");
  let [hours, minutes] = time?.split(":");

  if (period === "PM" && hours !== "12") {
    hours = String(Number(hours) + 12);
  } else if (period === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
};
