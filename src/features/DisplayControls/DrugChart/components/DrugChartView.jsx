import React, { useEffect, useState, useContext } from "react";
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
  transformDrugOrders,
  mapDrugOrdersAndSlots,
} from "../utils/DrugChartUtils";
import {
  convertDaystoSeconds,
  formatDate,
} from "../../../../utils/DateTimeUtils";
import { FormattedMessage } from "react-intl";
import { AllMedicationsContext } from "../../../../context/AllMedications";
import "../styles/DrugChartView.scss";
import { IPDContext } from "../../../../context/IPDContext";

const NoMedicationTaskMessage = (
  <FormattedMessage
    id={"NO_MEDICATION_DRUG_CHART_MESSAGE"}
    defaultMessage={"No Medication has been scheduled in this shift"}
  />
);

export default function DrugChartWrapper(props) {
  const { patientId } = props;
  const { config } = useContext(IPDContext);
  const { config: { drugChart = {} } = {} } = config;

  const [drugChartData, setDrugChartData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [drugOrders, setDrugOrders] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [date, updateDate] = useState(new Date());
  const [lastAction, updateLastActon] = useState("");
  const [startEndDates, updatedStartEndDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const allMedications = useContext(AllMedicationsContext);
  const allowedForthShfts =
    getDateTime(new Date(), currentShiftHoursArray(drugChart)[0]) / 1000 +
    convertDaystoSeconds(2);
  const [nextShiftMaxHour] = useState(allowedForthShfts);
  const [isShiftButtonsDisabled, setIsShiftButtonsDisabled] = useState({
    previous: false,
    next: false,
  });

  const [currentShiftArray, updateShiftArray] = useState(
    currentShiftHoursArray(drugChart)
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
        setIsShiftButtonsDisabled({
          previous: response.data[0].startDate > startDateTimeInSeconds,
          next:
            startDateTimeInSeconds >= nextShiftMaxHour ||
            endDateTimeInSeconds >= nextShiftMaxHour,
        });
      }
    } catch (e) {
      return e;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setTransformedData(
      mapDrugOrdersAndSlots(drugChartData, drugOrders, drugChart)
    );
  }, [drugChartData, drugOrders]);

  useEffect(() => {
    const orders = allMedications.data;
    if (orders) {
      setDrugOrders(transformDrugOrders(orders));
    }
  }, [allMedications.data]);

  useEffect(() => {
    const currentShift = currentShiftHoursArray(drugChart);
    const firstHour = currentShift[0];
    const lastHour = currentShift[currentShift.length - 1];
    let startDateTime = getDateTime(new Date(), currentShift[0]);
    let endDateTime = getDateTime(
      new Date(),
      currentShift[currentShift.length - 1] + 1
    );
    /** if shift is going on two different dates */
    if (lastHour < firstHour) {
      const d = new Date();
      const currentHour = d.getHours();
      if (currentHour > 12) {
        d.setDate(d.getDate() + 1);
        endDateTime = getDateTime(d, currentShift[currentShift.length - 1] + 1);
      } else {
        d.setDate(d.getDate() - 1);
        startDateTime = getDateTime(d, currentShift[0]);
      }
    }
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    updateDate(new Date(endDateTime));
    callFetchMedications(startDateTime, endDateTime);
  }, []);

  const handlePrevious = () => {
    const firstHour = currentShiftArray[0];
    const lastHour = currentShiftArray[currentShiftArray.length - 1];
    if (lastHour < firstHour && (lastAction === "N" || lastAction === "")) {
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
    const currentShift = currentShiftHoursArray(drugChart);
    const firstHour = currentShift[0];
    const lastHour = currentShift[currentShift.length - 1];
    let startDateTime = getDateTime(new Date(), currentShift[0]);
    let endDateTime = getDateTime(
      new Date(),
      currentShift[currentShift.length - 1] + 1
    );
    if (lastHour < firstHour) {
      const d = new Date();
      const currentHour = d.getHours();
      if (currentHour > 12) {
        d.setDate(d.getDate() + 1);
        endDateTime = getDateTime(d, currentShift[currentShift.length - 1] + 1);
      } else {
        d.setDate(d.getDate() - 1);
        startDateTime = getDateTime(d, currentShift[0]);
      }
    }
    updateShiftArray(currentShift);
    updateDate(new Date(endDateTime));
    updateLastActon("");
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };
  const dateFormatString = getDateFormatString(drugChart);
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
          disabled={isShiftButtonsDisabled.previous}
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
          disabled={isShiftButtonsDisabled.next}
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
      ) : drugChartData && drugChartData.length === 0 ? (
        <div className="no-nursing-tasks">{NoMedicationTaskMessage}</div>
      ) : (
        <DrugChart
          drugChartData={transformedData}
          currentShiftArray={currentShiftArray}
          selectedDate={startEndDates.startDate}
        />
      )}
    </div>
  );
}
DrugChartWrapper.propTypes = {
  patientId: PropTypes.string.isRequired,
  visitId: PropTypes.string.isRequired,
};
