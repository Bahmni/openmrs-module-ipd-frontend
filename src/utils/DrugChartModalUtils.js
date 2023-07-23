import axios from "axios";
import { DRUG_ORDERS_CONFIG_URL } from "../constants";

export const getDrugOrderFrequencies = async () => {
  try {
    const response = await axios.get(DRUG_ORDERS_CONFIG_URL);
    if (response.status == 200) return response.data.frequencies;
  } catch (error) {
    console.error(error);
  }
};
