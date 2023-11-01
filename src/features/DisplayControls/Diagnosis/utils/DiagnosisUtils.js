import axios from "axios";
import { DIAGNOSIS_SEARCH_URL } from "../../../../constants";

export const getPatientDiagnosis = async (patientUuid) => {
  try {
    const response = await axios.get(DIAGNOSIS_SEARCH_URL, {
      params: { patientUuid: patientUuid },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const diagnosisHeaders = [
  {
    id: "1",
    header: "Diagnosis",
    key: "diagnosis",
    isSortable: false,
  },
  {
    id: "2",
    header: "Order",
    key: "order",
    isSortable: true,
  },
  {
    id: "3",
    header: "Certainty",
    key: "certainty",
    isSortable: true,
  },
  {
    id: "4",
    header: "Status",
    key: "status",
    isSortable: true,
  },
  {
    id: "5",
    header: "Diagnosed By",
    key: "diagnosedBy",
    isSortable: false,
  },
  {
    id: "6",
    header: "Diagnosis Date ",
    key: "diagnosisDate",
    isSortable: true,
  },
];
