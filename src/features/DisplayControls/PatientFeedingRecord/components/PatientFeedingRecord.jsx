import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { Button, DataTableSkeleton } from "carbon-components-react";
import { ChevronLeft16, ChevronRight16, Time16 } from "@carbon/icons-react";
import { IPDContext } from "../../../../context/IPDContext";
import {
  displayPeriodTimingsFormat,
  timeFormatFor12Hr,
} from "../../../../constants";
import WarningIcon from "../../../../icons/warning.svg";
import { formatDate } from "../../../../utils/DateTimeUtils";
import {
  currentPeriodRange,
  NotCurrentPeriodMessage,
  isCurrentPeriod,
  getSortedObsData,
  filterDataForRange,
  fetchFormData,
} from "../../IntakeOutput/utils/IntakeOutputUtils";
import {
  patientFeedingRecordHeaders,
  transformObsData,
  NoDataForSelectedPeriod,
} from "../utils/PatientFeedingRecordUtils.js";
import PatientFeedingRecordTable from "./PatientFeedingRecordTable";
import "../styles/PatientFeedingRecord.scss";

const PatientFeedingRecord = () => {
  const { config, isReadMode, visitSummary, patient } = useContext(IPDContext);
  const { patientFeedingRecordConfig = {} } = config;
  const [consolidatedPFRData, setConsolidatedPFRData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notCurrentPeriod, setNotCurrentPeriod] = useState(false);
  const [patientFeedingRecordData, setPatientFeedingRecordData] = useState([]);
  const { enable24HourTime = {} } = config;
  const {
    periodDetails: periodConfig = {},
    dashboardConfig: dashboardConfig = {},
  } = patientFeedingRecordConfig;
  const currentPeriod = currentPeriodRange(
    isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    periodConfig
  );

  const [startEndDates, updatedStartEndDates] = useState({
    startDate: isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    endDate: isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
  });

  const [periodButtonsDisabled, setPeriodButtonsDisabled] = useState({
    previous: false,
    next: isReadMode ? true : false,
  });
  const visitStartDateTime = visitSummary.startDateTime;

  const callFetchPatientFeedingRecordData = async () => {
    try {
      const response = await fetchFormData(
        patient.uuid,
        dashboardConfig.conceptNames,
        dashboardConfig.numberOfVisits
      );
      setPatientFeedingRecordData(response);
    } catch (e) {
      return e;
    } finally {
      setIsLoading(false);
    }
  };
  const handleCurrent = () => {
    setNotCurrentPeriod(false);
    setIsLoading(true);
    updatedStartEndDates({
      startDate: currentPeriod.startDateTime,
      endDate: currentPeriod.endDateTime,
    });
  };

  const handlePrevious = () => {
    setNotCurrentPeriod(true);
    setIsLoading(true);
    updatedStartEndDates({
      startDate: moment(startEndDates.startDate)
        .clone()
        .subtract(periodConfig.durationInHours, "hours"),
      endDate: startEndDates.startDate,
    });
  };

  const handleNext = () => {
    setNotCurrentPeriod(true);
    setIsLoading(true);
    updatedStartEndDates({
      startDate: startEndDates.endDate,
      endDate: moment(startEndDates.endDate)
        .clone()
        .add(periodConfig.durationInHours, "hours"),
    });
  };

  const periodTiming = () => {
    let periodStartDateTime = formatDate(
      startEndDates.startDate,
      displayPeriodTimingsFormat
    );
    let periodEndDateTime = formatDate(
      startEndDates.endDate,
      displayPeriodTimingsFormat
    );
    const [periodStartDate, periodStartTime] = periodStartDateTime.split(" | ");
    const [periodEndDate, periodEndTime] = periodEndDateTime.split(" | ");

    const formattedPeriodStartTime = enable24HourTime
      ? periodStartTime
      : formatDate(startEndDates.startDate, timeFormatFor12Hr);

    const formattedPeriodEndTime = enable24HourTime
      ? periodEndTime
      : formatDate(startEndDates.endDate, timeFormatFor12Hr);

    if (periodStartDate === periodEndDate) {
      return (
        <div className="period-timing">
          {notCurrentPeriod && (
            <div className="not-current-period-message-div">
              <WarningIcon />
              <span className="not-current-period-message">
                {NotCurrentPeriodMessage}
              </span>
            </div>
          )}
          <div className="period-time">
            {periodStartDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedPeriodStartTime} <span className="to-text">to</span>{" "}
            <Time16 /> {formattedPeriodEndTime}
          </div>
        </div>
      );
    } else {
      return (
        <div className="period-timing">
          {notCurrentPeriod && (
            <div className="not-current-period-message-div">
              <WarningIcon />
              <span className="not-current-period-message">
                {NotCurrentPeriodMessage}
              </span>
            </div>
          )}
          <div className="period-time">
            {periodStartDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedPeriodStartTime} <span className="to-text">to</span>{" "}
            {periodEndDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedPeriodEndTime}
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    isCurrentPeriod(startEndDates, periodConfig)
      ? setNotCurrentPeriod(false)
      : setNotCurrentPeriod(true);

    const filteredData = filterDataForRange(
      patientFeedingRecordData,
      patientFeedingRecordConfig.timeConceptNames,
      startEndDates,
      visitSummary.startDateTime
    );

    const sortedObsData = getSortedObsData(
      filteredData,
      patientFeedingRecordConfig.timeConceptNames
    );

    setPeriodButtonsDisabled({
      previous:
        (isReadMode && patientFeedingRecordData.length === 0) ||
        moment(visitStartDateTime).isBetween(
          startEndDates.startDate,
          startEndDates.endDate,
          null,
          "[)"
        ),
      next: moment(visitSummary.stopDateTime).isBefore(startEndDates.endDate),
    });
    setConsolidatedPFRData(
      transformObsData(sortedObsData, patientFeedingRecordConfig)
    );
    setIsLoading(false);
  }, [startEndDates, patientFeedingRecordData, visitStartDateTime]);

  useEffect(() => {
    updatedStartEndDates({
      startDate: currentPeriod.startDateTime,
      endDate: currentPeriod.endDateTime,
    });
    callFetchPatientFeedingRecordData();
  }, []);
  return (
    <div className="form-dc-container display-container">
      <div className={"navigation"}>
        <div className="period-header">
          <Button
            kind="tertiary"
            isExpressive
            size="small"
            onClick={handleCurrent}
            className="margin-right-10"
            data-testid="current-period"
            disabled={isReadMode}
          >
            <FormattedMessage
              id={"CURRENT_PERIOD"}
              defaultMessage={"Current Period"}
            />
          </Button>
          <Button
            disabled={periodButtonsDisabled.previous}
            renderIcon={ChevronLeft16}
            kind="tertiary"
            isExpressive
            hasIconOnly
            size="sm"
            onClick={handlePrevious}
            className="margin-right-6"
            data-testid="previous-shift"
          />
          <Button
            disabled={periodButtonsDisabled.next}
            renderIcon={ChevronRight16}
            kind="tertiary"
            isExpressive
            hasIconOnly
            size="sm"
            onClick={handleNext}
            className="margin-right-10"
            data-testid="next-shift"
          />
          {periodTiming()}
        </div>
      </div>
      <div>
        {isLoading ? (
          <DataTableSkeleton
            data-testid="datatable-skeleton"
            headers={patientFeedingRecordHeaders}
            aria-label="sample table"
          />
        ) : consolidatedPFRData && consolidatedPFRData.length === 0 ? (
          <div className="no-pfr-data">{NoDataForSelectedPeriod}</div>
        ) : (
          <PatientFeedingRecordTable
            rows={consolidatedPFRData || []}
            headers={patientFeedingRecordHeaders}
            useZebraStyles={true}
          />
        )}
      </div>
    </div>
  );
};

PatientFeedingRecord.propTypes = {};

export default PatientFeedingRecord;
