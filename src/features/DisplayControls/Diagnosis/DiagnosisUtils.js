import axios from "axios";
import { DIAGNOSIS_SEARCH_URL } from "../../../constants";


export const getPatientDiagnosis = async (patientUuid) => {
  try {
    const response = await axios.get(DIAGNOSIS_SEARCH_URL, {
        params: {patientUuid: patientUuid},
        withCredentials: true,
      });
    console.log("Resposnse",response);
    return response;
  } catch (error) {
    console.error(error ,"hhhhhh");
  }
};
