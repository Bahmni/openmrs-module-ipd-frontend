import axios from "axios";
import { GET_PATIENT_LIST_URL } from "../../../constants";

export const fetchPatientsList = async (wardId, offset, limit = 3) => {
  try {
    return await axios.get(GET_PATIENT_LIST_URL.replace("{wardId}", wardId), {
      params: {
        offset,
        limit,
      },
    });
  } catch (e) {
    return e;
  }
};
export const getSortedPatientList = async (selectedWard, offset, limit) => {
  const response = await fetchPatientsList(selectedWard, offset, limit);
  if (response.status === 200) {
    const { data } = response;
    data.sort((a, b) => {
      const A = a.bedDetails.bedNumber.toLowerCase();
      const B = b.bedDetails.bedNumber.toLowerCase();
      if (A < B) return -1;
      else if (A > B) return 1;
      else return 0;
    });
    return data;
  } else {
    throw new Error("Failed to fetch data");
  }
};
