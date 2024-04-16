import axios from "axios";
import {
  DRUG_ORDERS_CONFIG_URL,
  GET_ALL_PROVIDERS_URL,
  MEDICATION_CONFIG_URL,
  EMERGENCY_MEDICATIONS_BASE_URL,
  ENCOUNTER_TYPE_URL,
  PATIENT_MOVEMENT_URL,
  NON_MEDICATION_BASE_URL,
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

export const saveNonMedicationTask = async (nonMedicationTask) => {
  try {
    return await axios.post(NON_MEDICATION_BASE_URL, nonMedicationTask);
  } catch (error) {
    return error;
  }
};


export const getEncounterType = async (encounterType) => {
  try {
    const response = await axios.get(
      ENCOUNTER_TYPE_URL.replace("{encounterType}", encounterType)
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getEncounterUuid = async (payload) => {
  try {
    const response = await axios.post(PATIENT_MOVEMENT_URL, payload);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
