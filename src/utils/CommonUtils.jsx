import axios from "axios";
import { FETCH_IPD_CONFIG_BASE_URL, SEARCH_DRUG_URL } from "../constants";

export const fetchConfigData = async () => {
  const FETCH_IPD_CONFIG_URL = `${FETCH_IPD_CONFIG_BASE_URL}`;
  try {
    const response = await axios.get(FETCH_IPD_CONFIG_URL);
    return response;
  } catch (error) {
    return error;
  }
};

export const getPatientDashboardUrl = (patientUuid) =>
  `/bahmni/clinical/#/default/patient/${patientUuid}/dashboard?currentTab=DASHBOARD_TAB_GENERAL_KEY`;
export const searchDrugsByName = async (query) => {
  try {
    return await axios.get(SEARCH_DRUG_URL.replace("{queryString}", query));
  } catch (e) {
    console.error(e);
  }
};
