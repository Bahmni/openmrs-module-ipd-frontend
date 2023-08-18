import axios from "axios";
import { MEDICATIONS_BASE_URL } from "../../constants";

export const fetchMedications = async (patientUuid, forDate) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&forDate=${forDate}`;
  try {
    const response = await axios.get(FETCH_MEDICATIONS_URL);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};
