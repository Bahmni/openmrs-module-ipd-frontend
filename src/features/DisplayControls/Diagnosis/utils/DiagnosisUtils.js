import axios from "axios";
import { DIAGNOSIS_SEARCH_URL } from "../../../../constants";
import { FormattedMessage } from "react-intl";

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
    header: (
      <FormattedMessage
        id={"DIAGNOSIS_COLUMN_HEADER"}
        defaultMessage={`Diagnosis`}
      />
    ),
    key: "diagnosis",
    isSortable: false,
  },
  {
    id: "2",
    header: (
      <FormattedMessage
        id={"ORDER_COLUMN_HEADER"}
        defaultMessage={`Order`}
      />
    ),
    key: "order",
    isSortable: true,
  },
  {
    id: "3",
    header: (
      <FormattedMessage
        id={"CERTAINTY_COLUMN_HEADER"}
        defaultMessage={`Certainty`}
      />
    ),
    key: "certainty",
    isSortable: true,
  },
  {
    id: "4",
    header: (
      <FormattedMessage
        id={"STATUS_COLUMN_HEADER"}
        defaultMessage={`Status`}
      />
    ),
    key: "status",
    isSortable: true,
  },
  {
    id: "5",
    header: (
      <FormattedMessage
        id={"DIAGNOSED_BY_COLUMN_HEADER"}
        defaultMessage={`Diagnosed By`}
      />
    ),
    key: "diagnosedBy",
    isSortable: false,
  },
  {
    id: "6",
    header: (
      <FormattedMessage
        id={"DIAGNOSIS_DATE_COLUMN_HEADER"}
        defaultMessage={`Diagnosis Date`}
      />
    ),
    key: "diagnosisDate",
    isSortable: true,
  },
];
