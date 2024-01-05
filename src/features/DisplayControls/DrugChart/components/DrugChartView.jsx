import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "carbon-components-react";
import { ChevronLeft16, ChevronRight16 } from "@carbon/icons-react";
import DrugChart from "./DrugChart";
import { fetchMedications } from "../utils/DrugChartUtils";
import {
  TransformDrugChartData,
  getDateTime,
  currentShiftHoursArray,
  getNextShiftDetails,
  getPreviousShiftDetails,
  SortDrugChartData,
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
  const { patientId } = props;
  const [drugChartData, setDrugChartData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [date, updateDate] = useState(new Date());
  const [lastAction, updateLastActon] = useState("");
  const [startEndDates, updatedStartEndDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const { config: { drugChart = {} } = {} } = data;

  const [currentShiftArray, updateShiftArray] = useState(
    currentShiftHoursArray()
  );

  const callFetchMedications = async (startDateTime, endDateTime) => {
    try {
      const response = await fetchMedications(
        patientId,
        startDateTime / 1000,
        endDateTime / 1000
      );
      return setDrugChartData(response.data);
    } catch (e) {
      // setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentShift = currentShiftHoursArray();
    const startDateTime = getDateTime(new Date(), currentShift[0]);
    const endDateTime = getDateTime(
      new Date(),
      currentShift[currentShift.length - 1] + 1
    );
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  }, []);

  const sortedDrugChartData = SortDrugChartData(drugChartData);
  const transformedDrugChartData = TransformDrugChartData(sortedDrugChartData);

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
    updateShiftArray(previousShiftArray);
    updateDate(nextDate);
    updateLastActon("P");
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  const handleNext = () => {
    const firstHour = currentShiftArray[0];
    const lastHour = currentShiftArray[currentShiftArray.length - 1];
    if (lastHour < firstHour && lastAction === "P") {
      date.setDate(date.getDate() + 1);
    }
    const { startDateTime, endDateTime, nextDate } = getNextShiftDetails(
      currentShiftArray,
      drugChart.shiftHours,
      date
    );
    const nextShiftArray = currentShiftArray.map(
      (hour) => (hour + drugChart.shiftHours) % 24
    );
    updateShiftArray(nextShiftArray);
    updateDate(nextDate);
    updateLastActon("N");
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  const handleCurrent = () => {
    const currentShift = currentShiftHoursArray();
    const nextDate = new Date();
    const startDateTime = getDateTime(new Date(), currentShift[0]);
    const endDateTime = getDateTime(
      new Date(),
      currentShift[currentShift.length - 1] + 1
    );
    updateShiftArray(currentShift);
    updateDate(nextDate);
    updateLastActon("");
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  // if (drugChartData && drugChartData.length === 0) {
  //   return <div className="no-nursing-tasks">{NoMedicationTaskMessage}</div>;
  // }
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
        <span>
          {`${formatDate(
            startEndDates.startDate,
            "DD/MM/YYYY HH:mm"
          )} - ${formatDate(startEndDates.endDate, "DD/MM/YYYY HH:mm")}`}
        </span>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : drugChartData && drugChartData.length === 0 ? (
        <div className="no-nursing-tasks">{NoMedicationTaskMessage}</div>
      ) : (
        <DrugChart
          drugChartData={transformedDrugChartData}
          currentShiftArray={currentShiftArray}
          selectedDate={date}
        />
      )}
    </div>
  );
}
DrugChartWrapper.propTypes = {
  patientId: PropTypes.string.isRequired,
};
