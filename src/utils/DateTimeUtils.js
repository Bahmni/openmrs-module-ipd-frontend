import moment from "moment";
import { defaultDateTimeFormat } from "../constants";

export const formatDate = (value, format = defaultDateTimeFormat) => {
  return value ? moment(value).format(format) : value;
};

export const areDatesSame = (date1, date2) => {
  return formatDate(date1, "DD/MM/YYYY") === formatDate(date2, "DD/MM/YYYY");
};
