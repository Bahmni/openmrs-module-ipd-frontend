import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "carbon-components-react";
import { ChevronLeft16, ChevronRight16 } from "@carbon/icons-react";
import DrugChart from "./DrugChart";
import {
  fetchMedications,
  getDateTime,
  currentShiftHoursArray,
  getNextShiftDetails,
  getPreviousShiftDetails,
  getDateFormatString,
  getTimeInSeconds,
  getTransformedDrugChartData,
} from "../utils/DrugChartUtils";
import { formatDate } from "../../../../utils/DateTimeUtils";
import data from "../../../../utils/config.json";
import { FormattedMessage } from "react-intl";
import "../styles/DrugChartView.scss";

const NoMedicationTaskMessage = (
  <FormattedMessage
    id={"NO_MEDICATION_DRUG_CHART_MESSAGE"}
    defaultMessage={"No Medication has been scheduled in this shift"}
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
  const [nextShiftMaxHour] = useState(
    getDateTime(new Date(), currentShiftHoursArray()[0]) / 1000 +
      getTimeInSeconds(2)
  );
  const [isDisabled, setIsDisabled] = useState({
    previous: false,
    next: false,
  });

  const { config: { drugChart = {} } = {} } = data;

  const [currentShiftArray, updateShiftArray] = useState(
    currentShiftHoursArray()
  );

  const callFetchMedications = async (startDateTime, endDateTime) => {
    const startDateTimeInSeconds = startDateTime / 1000;
    const endDateTimeInSeconds = endDateTime / 1000 - 60;
    try {
      const response = await fetchMedications(
        patientId,
        startDateTimeInSeconds,
        endDateTimeInSeconds
      );
      setDrugChartData(response.data);
      if (response.data.length > 0) {
        setIsDisabled({
          previous: response.data[0].startDate > startDateTimeInSeconds,
          next:
            nextShiftMaxHour > 0 &&
            (startDateTimeInSeconds >= nextShiftMaxHour ||
              endDateTimeInSeconds >= nextShiftMaxHour),
        });
      }
    } catch (e) {
      return e;
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

  const transformedDrugChartData = getTransformedDrugChartData(drugChartData);

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
  const dateFormatString = getDateFormatString();
  return (
    <div className="drugchart-parent-container">
      <div className="drugchart-shift-header">
        <Button
          kind="tertiary"
          isExpressive
          size="small"
          onClick={handleCurrent}
          className="margin-right-10"
          data-testid="currentShift"
        >
          <FormattedMessage
            id={"CURRENT_SHIFT"}
            defaultMessage={"Current Shift"}
          />
        </Button>
        <Button
          renderIcon={ChevronLeft16}
          kind="tertiary"
          isExpressive
          hasIconOnly
          size="sm"
          onClick={handlePrevious}
          className="margin-right-6"
          data-testid="previousButton"
          disabled={isDisabled.previous}
        />
        <Button
          renderIcon={ChevronRight16}
          kind="tertiary"
          isExpressive
          hasIconOnly
          size="sm"
          onClick={handleNext}
          className="margin-right-10"
          data-testid="nextButton"
          disabled={isDisabled.next}
        />
        <span>
          {`${formatDate(
            startEndDates.startDate,
            dateFormatString
          )} - ${formatDate(startEndDates.endDate, dateFormatString)}`}
        </span>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : drugChartData &&
        (drugChartData.length === 0 || drugChartData[0].slots.length === 0) ? (
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
