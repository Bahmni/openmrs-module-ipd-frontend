import React from "react";
import PropTypes from "prop-types";
import DrugChart from "./DrugChart";
import { useFetchMedications } from "../hooks/useFetchMedications";
import {
  getUTCEpochForDate,
  TransformDrugChartData,
} from "../utils/DrugChartUtils";
import { FormattedMessage } from "react-intl";

const NoMedicationTaskMessage = (
  <FormattedMessage
    id={"NO_MEDICATION_TASKS_MESSAGE"}
    defaultMessage={"No Medication has been scheduled for the patient yet"}
  />
);

export default function DrugChartWrapper(props) {
  const { patientId, viewDate } = props;
  const forDate = getUTCEpochForDate(viewDate);

  const { drugChartData, isLoading } = useFetchMedications(patientId, forDate);
  const transformedDrugChartData = TransformDrugChartData(drugChartData);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (drugChartData && drugChartData.length === 0) {
    return <div className="no-nursing-tasks">{NoMedicationTaskMessage}</div>;
  }
  return <DrugChart drugChartData={transformedDrugChartData} />;
}
DrugChartWrapper.propTypes = {
  patientId: PropTypes.string.isRequired,
  viewDate: PropTypes.instanceOf(Date),
};
