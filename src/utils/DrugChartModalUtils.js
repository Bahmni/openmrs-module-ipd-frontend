import axios from "axios";
import { SAVE_MEDICATION_URL } from "../constants";

export const saveMedication = async (medication) => {
  try {
    const response = await axios.post(SAVE_MEDICATION_URL, medication);
    return response;
  } catch (error) {
    console.error(error);
  }
};
