import axios from "axios";
import {
  DRUG_ORDERS_CONFIG_URL,
  GET_ALL_PROVIDERS_URL,
  MEDICATION_CONFIG_URL,
  EMERGENCY_MEDICATIONS_BASE_URL
} from "../../../../constants";

export const getDrugOrdersConfig = async () => {
  try {
    return await axios.get(DRUG_ORDERS_CONFIG_URL);
  } catch (e) {
    return e;
  }
};

export const getProviders = async () => {
  try {
    return await axios.get(
      GET_ALL_PROVIDERS_URL.concat(
        "&attrName=practitioner_type&attrValue=Doctor"
      )
    );
  } catch (e) {
    return e;
  }
};

export const fetchMedicationConfig = async () => {
  try {
    const configResponse = await axios.get(MEDICATION_CONFIG_URL);
    if (configResponse.status === 200) {
      const {
        tabConfig: {
          allMedicationTabConfig: {
            inputOptionsConfig: { drugFormDefaults },
          },
        },
      } = configResponse.data;
      return drugFormDefaults;
    }
  } catch (e) {
    return e;
  }
};

export const saveEmergencyMedication = async (emergencyMedication) => {
  try {
    return await axios.post(
      EMERGENCY_MEDICATIONS_BASE_URL,
      emergencyMedication
    );
  } catch (error) {
    return error;
  }
};
