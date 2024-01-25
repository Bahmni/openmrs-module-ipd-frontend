import axios from "axios";
import { SEARCH_DRUG_URL, SEARCH_CONCEPT_URL, CONFIG_BAHMNIENCOUNTER_URL} from "../constants";

export const getPatientDashboardUrl = (patientUuid) =>
  `/bahmni/clinical/#/default/patient/${patientUuid}/dashboard?currentTab=DASHBOARD_TAB_GENERAL_KEY`;

export const getADTDashboardUrl = (patientUuid, visitUuid, encounterUuid) =>
  `/bahmni/adt/#/patient/${patientUuid}/visit/${visitUuid}/encounter/${encounterUuid}/bed`;

export const searchDrugsByName = async (query) => {
  try {
    return await axios.get(SEARCH_DRUG_URL.replace("{queryString}", query));
  } catch (e) {
    console.error(e);
  }
};

export const searchConceptsByFSN = async (s, name, v) => {
  const url = `${SEARCH_CONCEPT_URL}?s=${s}&name=${name}&v=${v}`;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response;
  } catch (error) {
    return error;
  }
};

export const fetchVisitEncounterOrderTypes = async () => {
  const url = `${CONFIG_BAHMNIENCOUNTER_URL}?callerContext=REGISTRATION_CONCEPTS`;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response;
  } catch (error) {
    return error;
  }
}

export const getCookies = () => {
  const cookies = document.cookie.split(";");
  const cookiesObj = {};
  cookies.forEach((cookie) => {
    const cookieArr = cookie.split("=");
    cookiesObj[cookieArr[0].trim()] = decodeURIComponent(cookieArr[1]);
  });
  return cookiesObj;
};

