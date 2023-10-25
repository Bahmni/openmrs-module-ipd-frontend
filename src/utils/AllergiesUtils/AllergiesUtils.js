import axios from "axios";
import { ALLERGIES_BASE_URL } from "../../constants";

export const fetchAllergiesData = async (patientUuid) => {
  const FETCH_ALLERGIES_URL = `${ALLERGIES_BASE_URL}?patient=${patientUuid}&_summary=data`;
  try {
    const response = await axios.get(FETCH_ALLERGIES_URL);
    return response;
  } catch (error) {
    console.error(error);
  }
};
