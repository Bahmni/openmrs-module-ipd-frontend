import axios from "axios";
import {
  BOOKMARK_PATIENT_BASE_URL,
  GET_PATIENT_LIST_URL,
  GET_SEARCH_PATIENT_LIST_URL,
} from "../../../constants";

export const fetchPatientsList = async (wardId, offset, limit = 3) => {
  return await axios.get(GET_PATIENT_LIST_URL.replace("{wardId}", wardId), {
    params: { offset, limit },
  });
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
