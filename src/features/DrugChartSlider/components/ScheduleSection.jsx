import React from "react";
import PropTypes from "prop-types";
import {
  invalidTimeText12Hour,
  invalidTimeText24Hour,
} from "../utils/DrugChartSliderUtils";
import { FormattedMessage, useIntl } from "react-intl";
import { TimePicker, TimePicker24Hour, Title } from "bahmni-carbon-ui";
import { Toggle } from "carbon-components-react";
import { Information20 } from "@carbon/icons-react";
import { timeText12, timeText24 } from "../../../constants";

export const ScheduleSection = ({
  enableSchedule,
  firstDaySlotsMissed,
  firstDaySchedules,
  schedules,
  finalDaySchedules,
  handleFirstDaySchedule,
  handleSubsequentDaySchedule,
  handleFinalDaySchedule,
  showFirstDayScheduleOrderWarning,
  showEmptyFirstDayScheduleWarning,
  showFirstDaySchedulePassedWarning,
  showScheduleOrderWarning,
  showEmptyScheduleWarning,
  showFinalDayScheduleOrderWarning,
  showEmptyFinalDayScheduleWarning,
  showSchedulePassedWarning,
  enable24HourTimers,
  showScheduleNextDayWarning = [],
  showFirstDayScheduleNextDayWarning = [],
  applyToAllDays = false,
  onApplyToAllDaysToggle = () => {},
  isToggleEnabled = false,
  duration,
}) => {
  const intl = useIntl();
  const hasAnyNextDay =
    showFirstDayScheduleNextDayWarning.some((v) => v === true) ||
    showScheduleNextDayWarning.some((v) => v === true);

  return (
    <>
      {enableSchedule && (
        <p className="medication-schedule-heading">
          <FormattedMessage
            id="DRUG_CHART_MEDICATION_SCHEDULE"
            defaultMessage="Medication Schedule"
          />
        </p>
      )}
      {enableSchedule && firstDaySlotsMissed > 0 && (
        <div>
          <div className="schedule-info-notification">
            <Information20 />
            <span>
              <FormattedMessage
                id="DRUG_CHART_SCHEDULE_MODIFICATION_INFO"
                defaultMessage="Any modifications in the timings will automatically update the remaining schedule for today."
              />
            </span>
          </div>
          <div className="schedule-section">
            <Title
              text={
                intl.formatMessage({
                  id: "DRUG_CHART_MODAL_SCHEDULE_START_DATE",
                  defaultMessage: "Schedule time (start date, ",
                }) +
                (enable24HourTimers ? timeText24 : timeText12) +
                ")"
              }
              isRequired={true}
            />
            <div className="inline-field" id="schedule">
              {Array.from(
                { length: enableSchedule?.frequencyPerDay },
                (_, index) =>
                  enable24HourTimers ? (
                    <div
                      className={`schedule-time${
                        showFirstDayScheduleNextDayWarning[index]
                          ? " schedule-time-next-day"
                          : ""
                      }`}
                      key={index}
                    >
                      <TimePicker24Hour
                        key={index}
                        id={`schedule-${index}`}
                        defaultTime={firstDaySchedules[index]}
                        onChange={(time) => {
                          handleFirstDaySchedule(time, index);
                        }}
                        labelText=" "
                        width="70%"
                        invalidText={invalidTimeText24Hour}
                        isDisabled={firstDaySchedules[index] == "hh:mm"}
                      />
                    </div>
                  ) : (
                    <div
                      className={`schedule-time${
                        showFirstDayScheduleNextDayWarning[index]
                          ? " schedule-time-next-day"
                          : ""
                      }`}
                      key={index}
                    >
                      <TimePicker
                        key={index}
                        labelText=" "
                        defaultTime={firstDaySchedules[index]}
                        onChange={(time) => {
                          handleFirstDaySchedule(time, index);
                        }}
                        id={`schedule-${index}`}
                        isDisabled={firstDaySchedules[index] == "hh:mm"}
                        invalidText={invalidTimeText12Hour}
                      />
                    </div>
                  )
              )}
            </div>
            {showFirstDayScheduleOrderWarning && (
              <p className="time-error">
                <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_ORDER_WARNING"></FormattedMessage>
              </p>
            )}
            {showEmptyFirstDayScheduleWarning && (
              <p className="time-error">
                <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_SCHEDULE_WARNING"></FormattedMessage>
              </p>
            )}
            {showFirstDaySchedulePassedWarning.some(
              (showSchedulePassed) => showSchedulePassed === true
            ) && (
              <p className="time-warning">
                <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_PASSED_WARNING"></FormattedMessage>
              </p>
            )}
          </div>
          {hasAnyNextDay && (
            <div className="schedule-info-notification schedule-next-day-notification">
              <Information20 />
              <span>
                <FormattedMessage
                  id="DRUG_CHART_MODAL_SCHEDULE_NEXT_DAY_WARNING"
                  defaultMessage="Updated timing causes highlighted doses to cross midnight and appear on the next day."
                />
              </span>
            </div>
          )}
          {duration > 1 && (
            <div className="apply-to-all-days-toggle">
              <Toggle
                id="apply-to-all-days-toggle"
                size="sm"
                toggled={applyToAllDays}
                disabled={!isToggleEnabled}
                onToggle={onApplyToAllDaysToggle}
                labelA=""
                labelB=""
                labelText=""
              />
              <span className="toggle-label-text">
                <FormattedMessage
                  id="DRUG_CHART_UPDATE_COMPLETE_SCHEDULE"
                  defaultMessage="Update Complete Schedule"
                />
              </span>
            </div>
          )}
          {schedules.length != 0 && (
            <div className="schedule-section">
              <Title
                text={
                  intl.formatMessage({
                    id: "DRUG_CHART_MODAL_SCHEDULE_SUBSEQUENT",
                    defaultMessage: "Schedule time (subsequent, ",
                  }) +
                  (enable24HourTimers ? timeText24 : timeText12) +
                  ")"
                }
                isRequired={true}
              />
              <div className="inline-field" id="schedule">
                {Array.from(
                  { length: enableSchedule?.frequencyPerDay },
                  (_, index) =>
                    enable24HourTimers ? (
                      <div
                        className={`schedule-time${
                          showScheduleNextDayWarning[index]
                            ? " schedule-time-next-day"
                            : ""
                        }`}
                        key={index}
                      >
                        <TimePicker24Hour
                          key={index}
                          id={`schedule-${index}`}
                          defaultTime={schedules[index]}
                          onChange={(time) => {
                            handleSubsequentDaySchedule(time, index);
                          }}
                          labelText=" "
                          width="70%"
                          invalidText={invalidTimeText24Hour}
                        />
                      </div>
                    ) : (
                      <div
                        className={`schedule-time${
                          showScheduleNextDayWarning[index]
                            ? " schedule-time-next-day"
                            : ""
                        }`}
                        key={index}
                      >
                        <TimePicker
                          key={index}
                          labelText=" "
                          defaultTime={schedules[index]}
                          onChange={(time) => {
                            handleSubsequentDaySchedule(time, index);
                          }}
                          id={`schedule-${index}`}
                          invalidText={invalidTimeText12Hour}
                        />
                      </div>
                    )
                )}
              </div>
              {showScheduleOrderWarning && (
                <p className="time-error">
                  <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_ORDER_WARNING"></FormattedMessage>
                </p>
              )}
              {showEmptyScheduleWarning && (
                <p className="time-error">
                  <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_SCHEDULE_WARNING"></FormattedMessage>
                </p>
              )}
            </div>
          )}
          <div className="schedule-section">
            <Title
              text={
                intl.formatMessage({
                  id: "DRUG_CHART_MODAL_SCHEDULE_REMAINDER",
                  defaultMessage: "Schedule time (remainder, ",
                }) +
                (enable24HourTimers ? timeText24 : timeText12) +
                ")"
              }
              isRequired={true}
            />
            <div className="inline-field" id="schedule">
              {Array.from(
                {
                  length: firstDaySlotsMissed,
                },
                (_, index) =>
                  enable24HourTimers ? (
                    <div
                      className={
                        enableSchedule?.frequencyPerDay == 4
                          ? "schedule-time-remainder"
                          : "schedule-time"
                      }
                      key={index}
                    >
                      <TimePicker24Hour
                        key={index}
                        id={`schedule-${index}`}
                        defaultTime={finalDaySchedules[index]}
                        onChange={(time) => {
                          handleFinalDaySchedule(time, index);
                        }}
                        labelText=" "
                        width="70%"
                        invalidText={invalidTimeText24Hour}
                      />
                    </div>
                  ) : (
                    <div
                      className={
                        enableSchedule?.frequencyPerDay == 4
                          ? "schedule-time-remainder"
                          : "schedule-time"
                      }
                      key={index}
                    >
                      <TimePicker
                        key={index}
                        labelText=" "
                        defaultTime={finalDaySchedules[index]}
                        onChange={(time) => {
                          handleFinalDaySchedule(time, index);
                        }}
                        id={`schedule-${index}`}
                        invalidText={invalidTimeText12Hour}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
          {showFinalDayScheduleOrderWarning && (
            <p className="time-error">
              <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_ORDER_WARNING"></FormattedMessage>
            </p>
          )}
          {showEmptyFinalDayScheduleWarning && (
            <p className="time-error">
              <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_SCHEDULE_WARNING"></FormattedMessage>
            </p>
          )}
        </div>
      )}
      {enableSchedule && firstDaySlotsMissed == 0 && (
        <div>
          <div className="schedule-section">
            <Title
              text={
                intl.formatMessage({
                  id: "DRUG_CHART_MODAL_SCHEDULES",
                  defaultMessage: "Schedule(s)",
                }) +
                " (" +
                (enable24HourTimers ? timeText24 : timeText12) +
                ")"
              }
              isRequired={true}
            />
            <div className="inline-field" id="schedule">
              {Array.from(
                { length: enableSchedule?.frequencyPerDay },
                (_, index) =>
                  enable24HourTimers ? (
                    <div
                      className={`schedule-time${
                        showScheduleNextDayWarning[index]
                          ? " schedule-time-next-day"
                          : ""
                      }`}
                      key={index}
                    >
                      <TimePicker24Hour
                        key={index}
                        id={`schedule-${index}`}
                        defaultTime={schedules[index]}
                        onChange={(time) => {
                          handleSubsequentDaySchedule(time, index);
                        }}
                        labelText=" "
                        width="70%"
                        invalidText={invalidTimeText24Hour}
                      />
                    </div>
                  ) : (
                    <div
                      className={`schedule-time${
                        showScheduleNextDayWarning[index]
                          ? " schedule-time-next-day"
                          : ""
                      }`}
                      key={index}
                    >
                      <TimePicker
                        key={index}
                        labelText=" "
                        defaultTime={schedules[index]}
                        onChange={(time) => {
                          handleSubsequentDaySchedule(time, index);
                        }}
                        id={`schedule-${index}`}
                        invalidText={invalidTimeText12Hour}
                      />
                    </div>
                  )
              )}
            </div>
            {showScheduleOrderWarning && (
              <p className="time-error">
                <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_ORDER_WARNING"></FormattedMessage>
              </p>
            )}
            {showEmptyScheduleWarning && (
              <p className="time-error">
                <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_SCHEDULE_WARNING"></FormattedMessage>
              </p>
            )}
            {showSchedulePassedWarning.some(
              (showSchedulePassed) => showSchedulePassed === true
            ) && (
              <p className="time-warning">
                <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_PASSED_WARNING"></FormattedMessage>
              </p>
            )}
          </div>
          {hasAnyNextDay && (
            <div className="schedule-info-notification schedule-next-day-notification">
              <Information20 />
              <span>
                <FormattedMessage
                  id="DRUG_CHART_MODAL_SCHEDULE_NEXT_DAY_WARNING"
                  defaultMessage="Updated timing causes highlighted doses to cross midnight and appear on the next day."
                />
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

ScheduleSection.propTypes = {
  enableSchedule: PropTypes.shape({
    frequencyPerDay: PropTypes.number.isRequired,
  }),
  firstDaySlotsMissed: PropTypes.number.isRequired,
  firstDaySchedules: PropTypes.array.isRequired,
  schedules: PropTypes.array.isRequired,
  finalDaySchedules: PropTypes.array.isRequired,
  handleFirstDaySchedule: PropTypes.func.isRequired,
  handleSubsequentDaySchedule: PropTypes.func.isRequired,
  handleFinalDaySchedule: PropTypes.func.isRequired,
  showFirstDayScheduleOrderWarning: PropTypes.bool.isRequired,
  showEmptyFirstDayScheduleWarning: PropTypes.bool.isRequired,
  showFirstDaySchedulePassedWarning: PropTypes.array.isRequired,
  showScheduleOrderWarning: PropTypes.bool.isRequired,
  showEmptyScheduleWarning: PropTypes.bool.isRequired,
  showFinalDayScheduleOrderWarning: PropTypes.bool.isRequired,
  showEmptyFinalDayScheduleWarning: PropTypes.bool.isRequired,
  showSchedulePassedWarning: PropTypes.array.isRequired,
  enable24HourTimers: PropTypes.bool.isRequired,
  showScheduleNextDayWarning: PropTypes.array,
  showFirstDayScheduleNextDayWarning: PropTypes.array,
  applyToAllDays: PropTypes.bool,
  onApplyToAllDaysToggle: PropTypes.func,
  isToggleEnabled: PropTypes.bool,
  duration: PropTypes.number,
};
