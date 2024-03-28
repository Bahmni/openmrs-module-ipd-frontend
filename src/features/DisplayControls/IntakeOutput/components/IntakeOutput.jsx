import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import moment from "moment";

import { Button, Loading } from "carbon-components-react";

import { ChevronLeft16, ChevronRight16, Time16 } from "@carbon/icons-react";
import IntakeOutputTable from "./IntakeOutputTable";
import { IPDContext } from "../../../../context/IPDContext";
import { displayPeriodTimingsFormat, timeFormatFor12hr } from "../../../../constants";
import WarningIcon from "../../../../icons/warning.svg";
import { formatDate } from "../../../../utils/DateTimeUtils";
import {
  getSortedObsData,
  transformObsData,
  intakeOutputHeaders,
  currentPeriodRange,
  NotCurrentPeriodMessage,
  NoDataForSelectedPeriod,
  isCurrentPeriod,
  filterDataForRange,
  fetchIntakeOutputData,
} from "../utils/IntakeOutputUtils.js";

const IntakeOutput = () => {
  const { config, isReadMode, visitSummary, patient } = useContext(IPDContext);
  const { intakeOutputConfig = {} } = config;
  const [consolidatedIOData, setConsolidatedIOData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notCurrentPeriod, setNotCurrentPeriod] = useState(false);
  const [intakeOutputData, setIntakeOutputData] = useState([]);
  const { enable24HourTime = {} } = config;
  const {
    periodDetails: periodConfig = {},
    dashboardConfig: dashboardConfig = {},
  } = intakeOutputConfig;
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

  const callFetchIntakeAndOutputData = async () => {
    try {
      const response = await fetchIntakeOutputData(
        patient.uuid,
        dashboardConfig.conceptNames,
        dashboardConfig.numberOfVisits
      );
      setIntakeOutputData(response);
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
      endDate: currentPeriod.endDateTime
    });
  };

  const handlePrevious = () => {
    setNotCurrentPeriod(true);
    setIsLoading(true);
    updatedStartEndDates({
      startDate: moment(startEndDates.startDate).clone().subtract(periodConfig.durationInHours, 'hours'),
      endDate: startEndDates.startDate
    });
  };

  const handleNext = () => {
    setNotCurrentPeriod(true);
    setIsLoading(true);
    updatedStartEndDates({
      startDate: startEndDates.endDate,
      endDate: moment(startEndDates.endDate).clone().add(periodConfig.durationInHours, 'hours')
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
      : formatDate(startEndDates.startDate, timeFormatFor12hr);

    const formattedPeriodEndTime = enable24HourTime
      ? periodEndTime
      : formatDate(startEndDates.endDate, timeFormatFor12hr);

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
      intakeOutputData,
      intakeOutputConfig.timeConceptNames,
      startEndDates,
      visitSummary.startDateTime
    );
    const sortedObsData = getSortedObsData(
      filteredData,
      intakeOutputConfig.timeConceptNames
    );

    setPeriodButtonsDisabled({
      previous:
        (isReadMode && intakeOutputData.length === 0) ||
        moment(visitStartDateTime).isBetween(
          startEndDates.startDate,
          startEndDates.endDate,
          null,
          "[)"
        ),
      next: moment(visitSummary.stopDateTime).isBefore(
        startEndDates.endDate,
      ),
    });
    setConsolidatedIOData(transformObsData(sortedObsData, intakeOutputConfig));
    setIsLoading(false);
  }, [startEndDates, intakeOutputData, visitStartDateTime]);

  useEffect(() => {
    updatedStartEndDates({
      startDate: currentPeriod.startDateTime,
      endDate: currentPeriod.endDateTime,
    });
    callFetchIntakeAndOutputData();
  }, []);
  return (
    <div className="intake-output-content-container display-container">
      <div className={"intake-output-navigation"}>
        <div className="intake-output-period-header">
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
          <div className="loading-parent" data-testid="loading-icon">
            <Loading withOverlay={false} />
          </div>
        ) : consolidatedIOData.transformedData && consolidatedIOData.transformedData.length === 0 ? (
          <div className="no-io-data">
            {NoDataForSelectedPeriod}
          </div>
        ) : 
        <IntakeOutputTable 
          rows={consolidatedIOData.transformedData || []}
          headers={intakeOutputHeaders}
          totalIntakeGroup={consolidatedIOData.totalIntakeMap || {} }
          totalOutputGroup={consolidatedIOData.totalOutputMap || {}}/>   
        }
      </div>
    </div>
  );
};

IntakeOutput.propTypes = {};

export default IntakeOutput;