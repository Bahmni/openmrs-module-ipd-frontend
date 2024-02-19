import axios from "axios";
import { LIST_OF_WARDS_URL, WARD_SUMMARY_URL } from "../../../constants";

const fetchWards = async () => {
  try {
    return await axios.get(LIST_OF_WARDS_URL);
  } catch (e) {
    return e;
  }
};

export const fetchWardSummary = async (wardId) => {
  try {
    return await axios.get(WARD_SUMMARY_URL.replace("{wardId}", wardId));
  } catch (e) {
    return e;
  }
};

export const getWardDetails = async () => {
  const response = await fetchWards();
  if (response.status === 200) {
    return response.data.results;
  }
  return [];
};
