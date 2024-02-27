import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Button, Loading } from "carbon-components-react";
import { ChevronLeft16, ChevronRight16, Time16 } from "@carbon/icons-react";
import DrugChart from "./DrugChart";
import {
  fetchMedications,
  getDateTime,
  currentShiftHoursArray,
  getUpdatedShiftArray,
  getNextShiftDetails,
  getPreviousShiftDetails,
  transformDrugOrders,
  mapDrugOrdersAndSlots,
  isCurrentShift,
  NotCurrentShiftMessage,
} from "../utils/DrugChartUtils";
import {
  convertDaystoSeconds,
  formatDate,
} from "../../../../utils/DateTimeUtils";
import { FormattedMessage } from "react-intl";
import { AllMedicationsContext } from "../../../../context/AllMedications";
import "../styles/DrugChartView.scss";
import { IPDContext } from "../../../../context/IPDContext";
import { displayShiftTimingsFormat, timeFormatFor12hr, timeFormatfor24Hr, timeText12 } from "../../../../constants";
import WarningIcon from "../../../../icons/warning.svg";

const NoMedicationTaskMessage = (
  <FormattedMessage
    id={"NO_MEDICATION_DRUG_CHART_MESSAGE"}
    defaultMessage={"No Medication has been scheduled in this shift"}
  />
);

export default function DrugChartWrapper(props) {
  const { patientId } = props;
  const { config, isReadMode, visitSummary, visit } = useContext(IPDContext);
  const { shiftDetails: shiftConfig = {}, drugChart = {},enable24HourTime = {} } = config;
  const [drugChartData, setDrugChartData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [drugOrders, setDrugOrders] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [startEndDates, updatedStartEndDates] = useState({
    startDate: isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    endDate: isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
  });
  const allMedications = useContext(AllMedicationsContext);
  const shiftDetails = currentShiftHoursArray(
    isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    shiftConfig
  );
  const allowedForthShfts =
    getDateTime(new Date(), shiftDetails.currentShiftHoursArray[0]) / 1000 +
    convertDaystoSeconds(2);
  const [nextShiftMaxHour] = useState(
    isReadMode ? visitSummary.stopDateTime / 1000 : allowedForthShfts
  );
  const [isShiftButtonsDisabled, setIsShiftButtonsDisabled] = useState({
    previous: false,
    next: isReadMode ? true : false,
  });

  const [currentShiftArray, updateShiftArray] = useState(
    shiftDetails.currentShiftHoursArray
  );

  const shiftRangeArray = shiftDetails.rangeArray;
  const [shiftIndex, updateShiftIndex] = useState(shiftDetails.shiftIndex);
  const [notCurrentShift, setNotCurrentShift] = useState(false);

  const callFetchMedications = async (startDateTime, endDateTime) => {
    const startDateTimeInSeconds = startDateTime / 1000;
    const endDateTimeInSeconds = endDateTime / 1000 - 60;
    try {
      const response = await fetchMedications(
        patientId,
        startDateTimeInSeconds,
        endDateTimeInSeconds,
        visit
      );
      setDrugChartData(response.data);
      setIsShiftButtonsDisabled({
        previous:
          (isReadMode && response.data.length === 0) ||
          response.data[0].startDate > startDateTimeInSeconds,
        next:
          startDateTimeInSeconds >= nextShiftMaxHour ||
          endDateTimeInSeconds >= nextShiftMaxHour,
      });
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
    const currentShift = shiftDetails.currentShiftHoursArray;
    const firstHour = currentShift[0];
    const lastHour = currentShift[currentShift.length - 1];
    let startDateTime = getDateTime(
      isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
      currentShift[0]
    );
    let endDateTime = getDateTime(
      isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
      currentShift[currentShift.length - 1] + 1
    );
    /** if shift is going on two different dates */
    if (lastHour < firstHour) {
      const d = isReadMode ? new Date(visitSummary.stopDateTime) : new Date();
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
    callFetchMedications(startDateTime, endDateTime);
  }, []);

  const handlePrevious = () => {
    const { startDateTime, endDateTime, previousShiftIndex } =
      getPreviousShiftDetails(
        shiftRangeArray,
        shiftIndex,
        startEndDates.startDate,
        startEndDates.endDate
      );
    const previousShiftRange = shiftRangeArray[previousShiftIndex];
    const previousShiftArray = getUpdatedShiftArray(previousShiftRange);
    isCurrentShift(shiftConfig, startDateTime, endDateTime)
      ? setNotCurrentShift(false)
      : setNotCurrentShift(true);
    updateShiftArray(previousShiftArray);
    updateShiftIndex(previousShiftIndex);
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  const handleNext = () => {
    const { startDateTime, endDateTime, nextShiftIndex } = getNextShiftDetails(
      shiftRangeArray,
      shiftIndex,
      startEndDates.startDate,
      startEndDates.endDate
    );
    const nextShiftRange = shiftRangeArray[nextShiftIndex];
    const nextShiftArray = getUpdatedShiftArray(nextShiftRange);
    isCurrentShift(shiftConfig, startDateTime, endDateTime)
      ? setNotCurrentShift(false)
      : setNotCurrentShift(true);
    updateShiftArray(nextShiftArray);
    updateShiftIndex(nextShiftIndex);
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  const handleCurrent = () => {
    const shiftDetailsObj = currentShiftHoursArray(
      isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
      shiftConfig
    );
    const currentShift = shiftDetailsObj.currentShiftHoursArray;
    const updatedShiftIndex = shiftDetailsObj.shiftIndex;
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
    setNotCurrentShift(false);
    updateShiftArray(currentShift);
    updateShiftIndex(updatedShiftIndex);
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  const shiftTiming = () => {
    let shiftStartDateTime = formatDate(
      startEndDates.startDate,
      displayShiftTimingsFormat
    );
    let shiftEndDateTime = formatDate(
      startEndDates.endDate - 60,
      displayShiftTimingsFormat
    );
    const [shiftStartDate, shiftStartTime] = shiftStartDateTime.split(" | ");
    const [shiftEndDate, shiftEndTime] = shiftEndDateTime.split(" | ");

    const formattedShiftStartTime = enable24HourTime
      ? shiftStartTime
      : formatDate(startEndDates.startDate, timeFormatFor12hr);

    const formattedShiftEndTime = enable24HourTime
      ? shiftEndTime
      : formatDate(startEndDates.endDate - 60, timeFormatFor12hr);

    if (shiftStartDate === shiftEndDate) {
      return (
        <div className="shift-timing">
          {notCurrentShift && (
            <div className="not-current-shift-message-div">
              <WarningIcon />
              <span className="not-current-shift-message">
                {NotCurrentShiftMessage}
              </span>
            </div>
          )}
          <div className="shift-time">
            {shiftStartDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftStartTime} <span className="to-text">to</span>{" "}
            <Time16 /> {formattedShiftEndTime}
          </div>
        </div>
      );
    } else {
      return (
        <div className="shift-timing">
          {notCurrentShift && (
            <div className="not-current-shift-message-div">
              <WarningIcon />
              <span className="not-current-shift-message">
                {NotCurrentShiftMessage}
              </span>
            </div>
          )}
          <div className="shift-time">
            {shiftStartDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftStartTime} <span className="to-text">to</span>{" "}
            {shiftEndDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftEndTime}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="drugchart-parent-container display-container">
      <div className="drugchart-shift-header">
        <Button
          kind="tertiary"
          isExpressive
          size="small"
          onClick={handleCurrent}
          className="margin-right-10"
          data-testid="currentShift"
          disabled={isReadMode}
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
        {shiftTiming()}
      </div>
      {isLoading ? (
        <div className="loading-parent" data-testid="loading-icon">
          <Loading withOverlay={false} />
        </div>
      ) : transformedData && transformedData.length === 0 ? (
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
