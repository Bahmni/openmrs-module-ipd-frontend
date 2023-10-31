import axios from "axios";
import { DIAGNOSIS_SEARCH_URL } from "../../../../constants";

export const getPatientDiagnosis = async (patientUuid) => {
  try {
    const response = await axios.get(DIAGNOSIS_SEARCH_URL, {
      params: { patientUuid: patientUuid },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
