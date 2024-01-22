import axios from "axios";
import { SEARCH_DRUG_URL } from "../constants";

export const getPatientDashboardUrl = (patientUuid) =>
  `/bahmni/clinical/#/default/patient/${patientUuid}/dashboard?currentTab=DASHBOARD_TAB_GENERAL_KEY`;
export const searchDrugsByName = async (query) => {
  try {
    return await axios.get(SEARCH_DRUG_URL.replace("{queryString}", query));
  } catch (e) {
    console.error(e);
  }
};

export const getCookies = () => {
  const cookies = document.cookie.split(";");
  const cookiesObj = {};
  cookies.forEach((cookie) => {
    const cookieArr = cookie.split("=");
    cookiesObj[cookieArr[0].trim()] = decodeURIComponent(cookieArr[1]);
  });
  return cookiesObj;
};