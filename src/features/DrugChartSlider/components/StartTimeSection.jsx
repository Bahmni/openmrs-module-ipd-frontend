// StartTimeSection.js
import React from "react";
import { FormattedMessage } from "react-intl";
import { TimePicker, TimePicker24Hour } from "bahmni-carbon-ui";
import PropTypes from "prop-types";
import {
  invalidTimeText12Hour,
  invalidTimeText24Hour,
} from "../utils/DrugChartSliderUtils";
import { timeText12, timeText24 } from "../../../constants";

export const StartTimeSection = ({
  startTime,
  handleStartTime,
  showEmptyStartTimeWarning,
  showStartTimeBeyondNextDoseWarning,
  showStartTimePassedWarning,
  enable24HourTimers,
}) => {
  return (
    <div className="start-time">
      {enable24HourTimers ? (
        <>
          <TimePicker24Hour
            data-modal-primary-focus
            labelText={`Start Time (${timeText24})`}
            id={"start-time"}
            onChange={(time) => handleStartTime(time)}
            isRequired={true}
            defaultTime={startTime}
            width="80%"
            invalidText={invalidTimeText24Hour}
          />
          {showStartTimePassedWarning && (
            <p className="time-warning">
              <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_PASSED"></FormattedMessage>
            </p>
          )}
          {showStartTimeBeyondNextDoseWarning && (
            <p className="time-warning">
              <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_BEYOND_NEXT_DOSE"></FormattedMessage>
            </p>
          )}
          {showEmptyStartTimeWarning && (
            <p className="time-error">
              <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_START_TIME_WARNING"></FormattedMessage>
            </p>
          )}
        </>
      ) : (
        <>
          <TimePicker
            id={"start-time"}
            onChange={(time) => handleStartTime(time)}
            defaultTime={startTime}
            labelText={`Start Time (${timeText12})`}
            isRequired={true}
            invalidText={invalidTimeText12Hour}
          />
          {showStartTimePassedWarning && (
            <p className="time-warning">
              <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_PASSED"></FormattedMessage>
            </p>
          )}
          {showStartTimeBeyondNextDoseWarning && (
            <p className="time-warning">
              <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_BEYOND_NEXT_DOSE"></FormattedMessage>
            </p>
          )}
          {showEmptyStartTimeWarning && (
            <p className="time-error">
              <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_START_TIME_WARNING"></FormattedMessage>
            </p>
          )}
        </>
      )}
    </div>
  );
};

StartTimeSection.propTypes = {
  startTime: PropTypes.string.isRequired,
  handleStartTime: PropTypes.func.isRequired,
  showEmptyStartTimeWarning: PropTypes.bool.isRequired,
  showStartTimeBeyondNextDoseWarning: PropTypes.bool.isRequired,
  showStartTimePassedWarning: PropTypes.bool.isRequired,
  enable24HourTimers: PropTypes.bool.isRequired,
};
