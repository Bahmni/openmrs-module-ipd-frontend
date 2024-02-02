import React from "react";
import PropTypes from "prop-types";
import {
  invalidTimeText12Hour,
  invalidTimeText24Hour,
} from "../utils/DrugChartSliderUtils";
import { FormattedMessage } from "react-intl";
import { TimePicker, TimePicker24Hour, Title } from "bahmni-carbon-ui";

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
}) => {
  return (
    <>
      {enableSchedule && firstDaySlotsMissed > 0 && (
        <div>
          <div className="schedule-section">
            <Title text="Schedule time (start date)" isRequired={true} />
            <div className="inline-field" id="schedule">
              {Array.from(
                { length: enableSchedule?.frequencyPerDay },
                (_, index) =>
                  enable24HourTimers ? (
                    <div className="schedule-time" key={index}>
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
                    <div className="schedule-time" key={index}>
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
          {schedules.length != 0 && (
            <div className="schedule-section">
              <Title text="Schedule time (subsequent)" isRequired={true} />
              <div className="inline-field" id="schedule">
                {Array.from(
                  { length: enableSchedule?.frequencyPerDay },
                  (_, index) =>
                    enable24HourTimers ? (
                      <div className="schedule-time" key={index}>
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
                      <div className="schedule-time" key={index}>
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
            <Title text="Schedule time (remainder)" isRequired={true} />
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
            <Title text="Schedule(s)" isRequired={true} />
            <div className="inline-field" id="schedule">
              {Array.from(
                { length: enableSchedule?.frequencyPerDay },
                (_, index) =>
                  enable24HourTimers ? (
                    <div className="schedule-time" key={index}>
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
                    <div className="schedule-time" key={index}>
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
};
