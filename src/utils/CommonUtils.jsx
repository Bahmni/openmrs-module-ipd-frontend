import axios from "axios";
import {
  SEARCH_DRUG_URL,
  SEARCH_CONCEPT_URL,
  CONFIG_BAHMNIENCOUNTER_URL,
  DASHBORAD_CONFIG_URL,
} from "../constants";

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

export const getDashboardConfig = async () => {
  try {
    const response = await axios.get(DASHBORAD_CONFIG_URL, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response;
  } catch (error) {
    return error;
  }
};

export const mockConfig = {
  sections: [
    {
      title: "Vitals and Nutritional Values",
      componentKey: "VT",
      displayOrder: 1,
      refreshKey: 1,
    },
    {
      title: "Allergies",
      componentKey: "AL",
      displayOrder: 2,
      refreshKey: 2,
    },
    {
      title: "Diagnosis",
      componentKey: "DG",
      displayOrder: 3,
      refreshKey: 3,
    },
    {
      title: "Treatments",
      componentKey: "TR",
      displayOrder: 4,
      refreshKey: 4,
    },
    {
      title: "Nursing Tasks",
      componentKey: "NT",
      displayOrder: 5,
      refreshKey: 5,
    },
    {
      title: "Drug Chart",
      componentKey: "DC",
      displayOrder: 6,
      refreshKey: 6,
    },
  ],
  nursingTasks: {
    timeInMinutesFromNowToShowTaskAsRelevant: 60,
    timeInMinutesFromNowToShowPastTaskAsLate: 60,
    timeInMinutesFromStartTimeToShowAdministeredTaskAsLate: 30,
  },
  drugChart: {
    timeInMinutesFromNowToShowPastTaskAsLate: 60,
    timeInMinutesFromStartTimeToShowAdministeredTaskAsLate: 30,
    enable24HourTime: true,
  },
  medicationTags: {
    asNeeded: "Rx-PRN",
    "STAT (Immediately)": "Rx-STAT",
    default: "Rx",
    emergency: "EMERG",
  },
  shiftDetails: {
    1: { shiftStartTime: "08:00", shiftEndTime: "19:00" },
    2: { shiftStartTime: "19:00", shiftEndTime: "08:00" },
  },
};
