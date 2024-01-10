import moment from "moment";
import { defaultDateFormat } from "../constants";

export const formatDate = (value, format = defaultDateFormat) => {
  return value ? moment(value).format(format) : value;
};

export const areDatesSame = (date1, date2) => {
  return formatDate(date1) === formatDate(date2);
};
