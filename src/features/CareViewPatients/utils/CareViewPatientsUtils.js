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
  headerSelected,
  providerUuid,
  sortBy,
  limit = 3
) => {
  if (headerSelected === WARD_SUMMARY_HEADER.TOTAL_PATIENTS) {
    return await axios.get(GET_PATIENT_LIST_URL.replace("{wardId}", wardId), {
      params: { offset, sortBy, limit },
    });
  } else if (headerSelected === WARD_SUMMARY_HEADER.MY_PATIENTS) {
    return await axios.get(
      GET_MY_PATIENT_LIST_URL.replace("{wardId}", wardId),
      {
        params: { offset, providerUuid, sortBy, limit },
      }
    );
  }
};

export const fetchPatientsListBySearch = async (
  wardId,
  searchKeys,
  searchValue,
  offset,
  sortBy,
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
          sortBy,
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
