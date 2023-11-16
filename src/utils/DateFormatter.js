export const formatDateAsString = (date, format) => {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object");
  }

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = format
    .replace("YYYY", date.getFullYear())
    .replace("YY", year)
    .replace("MM", month)
    .replace("DD", day);

  return formattedDate;
};
