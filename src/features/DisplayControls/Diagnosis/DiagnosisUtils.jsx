import axios from "axios";
import { DIAGNOSIS_SEARCH_URL } from "../../../constants";

export const getPatientDiagnosis = async (patientUuid) => {
  try {
    const response = await axios.get(DIAGNOSIS_SEARCH_URL, patientUuid);
    return response;
  } catch (error) {
    console.error(error);
  }
};
