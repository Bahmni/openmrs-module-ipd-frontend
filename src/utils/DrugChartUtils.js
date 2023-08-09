import axios from "axios";
import { FETCH_MEDICATIONS_BASE_URL } from "../constants";

export const fetchMedications = async (patientUuid, forDate) => {
  const FETCH_MEDICATIONS_URL = `${FETCH_MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&forDate=${forDate}`;
  console.log("patientid", patientUuid);
  console.log("FETCH_MEDICATIONS_URL", FETCH_MEDICATIONS_URL);
  try {
    const response = await axios.get(FETCH_MEDICATIONS_URL);
    console.log("response from util", response.data[0]);
    return response.data[0];
  } catch (error) {
    console.error(error);
  }
};
