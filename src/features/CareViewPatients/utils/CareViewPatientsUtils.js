import axios from "axios";
import {
  BOOKMARK_PATIENT_BASE_URL,
  GET_PATIENT_LIST_URL,
  GET_SEARCH_PATIENT_LIST_URL,
  GET_MY_PATIENT_LIST_URL,
  WARD_SUMMARY_HEADER,
} from "../../../constants";

export const fetchPatientsList = async (
  wardId,
  offset,
  limit = 3,
  headerSelected,
  providerUuid
) => {
  const urls = {
    [WARD_SUMMARY_HEADER.TOTAL_PATIENTS]: GET_PATIENT_LIST_URL,
    [WARD_SUMMARY_HEADER.MY_PATIENTS]: GET_MY_PATIENT_LIST_URL,
  };
  if (wardId === null || wardId === undefined) {
    return { admittedPatients: [], totalPatients: 0 };
  }
  const url = urls[headerSelected].replace("{wardId}", wardId);
  const params = {
    offset,
    limit,
    ...(headerSelected === WARD_SUMMARY_HEADER.MY_PATIENTS && { providerUuid }),
  };
  try {
    const response = await axios.get(url, { params });
    if (response.status === 200) {
      return response.data;
    } else {
      return { admittedPatients: [], totalPatients: 0 };
    }
  } catch (error) {
    return { admittedPatients: [], totalPatients: 0 };
  }
};

export const fetchPatientsListBySearch = async (
  wardId,
  searchKeys,
  searchValue,
  offset,
  limit = 3
) => {
  try {
    return await axios.get(
      GET_SEARCH_PATIENT_LIST_URL.replace("{wardId}", wardId),
      {
        params: {
          offset,
          limit,
          searchKeys,
          searchValue,
        },
        paramsSerializer: {
          indexes: null,
        },
      }
    );
  } catch (e) {
    return e;
  }
};

export const bookmarkPatient = async (patientDetails) => {
  return await axios.post(BOOKMARK_PATIENT_BASE_URL, patientDetails);
};
