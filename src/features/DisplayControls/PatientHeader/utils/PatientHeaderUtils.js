import axios from "axios";
import { PATIENT_URL } from "../../../../constants";

export const fetchPatientInfo = async (patientUuid) => {
  const url = `${PATIENT_URL}/${patientUuid}?v=full`;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getGender = (gender) => {
  switch (gender) {
    case "M":
      return "Male";
    case "F":
      return "Female";
    case "O":
      return "Other";
    default:
      return gender;
  }
};
