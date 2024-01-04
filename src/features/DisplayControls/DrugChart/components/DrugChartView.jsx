import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "carbon-components-react";
import { ChevronLeft16, ChevronRight16 } from "@carbon/icons-react";
import DrugChart from "./DrugChart";
import { fetchMedications } from "../utils/DrugChartUtils";
import {
  getUTCEpochForDate,
  TransformDrugChartData,
  getDateTime,
  currentShiftHoursArray,
  getNextShiftDetails,
  getPreviousShiftDetails,
} from "../utils/DrugChartUtils";
import { formatDate } from "../../../../utils/DateTimeUtils";
import data from "../../../../utils/config.json";
import { FormattedMessage } from "react-intl";
import "../styles/DrugChartView.scss";

const NoMedicationTaskMessage = (
  <FormattedMessage
    id={"NO_MEDICATION_TASKS_MESSAGE"}
    defaultMessage={"No Medication has been scheduled for the patient yet"}
  />
);

export default function DrugChartWrapper(props) {
  const { patientId, viewDate } = props;
  const forDate = getUTCEpochForDate(viewDate);
  const [drugChartData, setDrugChartData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [date, updateDate] = useState(new Date());
  const [lastAction, updateLastActon] = useState("");

  const { config: { drugChart = {} } = {} } = data;

  const [currentShiftArray, updateShiftArray] = useState(
    currentShiftHoursArray()
  );

  const callFetchMedications = async () => {
    try {
      const response = await fetchMedications(patientId, forDate);
      return setDrugChartData(response.data);
    } catch (e) {
      // setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callFetchMedications();
  }, []);

  const transformedDrugChartData = TransformDrugChartData(drugChartData);

  const handlePrevious = () => {
    const firstHour = currentShiftArray[0];
    const lastHour = currentShiftArray[currentShiftArray.length - 1];
    if (lastHour < firstHour && lastAction === "N") {
      date.setDate(date.getDate() - 1);
    }
    const { startDateTime, endDateTime, nextDate } = getPreviousShiftDetails(
      currentShiftArray,
      drugChart.shiftHours,
      date
    );
    const previousShiftArray = currentShiftArray.map((hour) => {
      let updatedHour = hour - drugChart.shiftHours;
      updatedHour = updatedHour < 0 ? 24 + updatedHour : updatedHour;
      return updatedHour;
    });
    console.log("startDateTime -> ", startDateTime);
    console.log("endDateTime -> ", endDateTime);
    updateShiftArray(previousShiftArray);
    updateDate(nextDate);
    updateLastActon("P");
    setLoading(true);
    callFetchMedications();
  };

  const handleNext = () => {
    const firstHour = currentShiftArray[0];
    const lastHour = currentShiftArray[currentShiftArray.length - 1];
    if (lastHour < firstHour && lastAction === "P") {
      date.setDate(date.getDate() + 1);
    }
    console.log("date in next -> ", date);
    const { startDateTime, endDateTime, nextDate } = getNextShiftDetails(
      currentShiftArray,
      drugChart.shiftHours,
      date
    );
    const nextShiftArray = currentShiftArray.map(
      (hour) => (hour + drugChart.shiftHours) % 24
    );
    console.log("startDateTime -> ", startDateTime);
    console.log("endDateTime -> ", endDateTime);
    updateShiftArray(nextShiftArray);
    updateDate(nextDate);
    updateLastActon("N");
    setLoading(true);
    callFetchMedications();
  };

  const handleCurrent = () => {
    const currentShift = currentShiftHoursArray();
    const nextDate = new Date();
    const startDateTime = getDateTime(new Date(), currentShift[0]);
    const endDateTime = getDateTime(
      new Date(),
      currentShift[currentShift.length - 1] + 1
    );
    console.log("startDateTime -> ", startDateTime);
    console.log("endDateTime -> ", endDateTime);
    updateShiftArray(currentShift);
    updateDate(nextDate);
    updateLastActon("");
    setLoading(true);
    callFetchMedications();
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  if (drugChartData && drugChartData.length === 0) {
    return <div className="no-nursing-tasks">{NoMedicationTaskMessage}</div>;
  }
  return (
    <div className="drugchart-parent-container">
      <div className="drugchart-shift-header">
        <Button
          kind="tertiary"
          isExpressive
          size="small"
          onClick={handleCurrent}
          className="margin-right-10"
        >
          Current Shift
        </Button>
        <Button
          renderIcon={ChevronLeft16}
          kind="tertiary"
          isExpressive
          hasIconOnly
          size="sm"
          onClick={handlePrevious}
          className="margin-right-6"
        />
        <Button
          renderIcon={ChevronRight16}
          kind="tertiary"
          isExpressive
          hasIconOnly
          size="sm"
          onClick={handleNext}
          className="margin-right-10"
        />
        <span>{formatDate(date, "DD/MM/YYYY")}</span>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DrugChart
          drugChartData={transformedDrugChartData}
          currentShiftArray={currentShiftArray}
        />
      )}
    </div>
  );
}
DrugChartWrapper.propTypes = {
  patientId: PropTypes.string.isRequired,
  viewDate: PropTypes.instanceOf(Date),
};
