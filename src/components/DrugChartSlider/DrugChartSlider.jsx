import React, { useEffect, useState } from "react";
import {
  DatePickerCarbon,
  DropdownCarbon,
  NumberInputCarbon,
  TimePicker,
  TimePicker24Hour,
  Title,
} from "bahmni-carbon-ui";
import { TextArea, TextInput } from "carbon-components-react";
import moment from "moment";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import { saveMedication } from "../../utils/DrugChartSliderUtils";
import SideBarPanel from "../../features/SideBarPanel/components/SideBarPanel";
import "./DrugChartSlider.scss";
import { SaveAndCloseButtons } from "../../features/SaveAndCloseButtons/components/SaveAndCloseButtons";
import {
  isInvalidTimeTextPresent,
  isValidSchedule,
  createDrugChartPayload,
  handleSchedule,
  handleStartTime,
} from "./DrugChartSliderUtils";

const DrugChartSlider = (props) => {
  const { title, hostData, hostApi, setDrugChartNotes, drugChartNotes } = props;
  const enableSchedule = hostData?.scheduleFrequencies.find(
    (frequency) =>
      frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enableStartTime = hostData?.startTimeFrequencies.includes(
    hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enable24HourTimers = hostData?.enable24HourTimers || false;
  const isAutoFill = !!enableSchedule?.scheduleTiming;

  const [schedules, setSchedules] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [
    showStartTimeBeyondNextDoseWarning,
    setShowStartTimeBeyondNextDoseWarning,
  ] = useState(false);
  const [showStartTimePassedWarning, setShowStartTimePassedWarning] =
    useState(false);
  const [showSchedulePassedWarning, setShowSchedulePassedWarning] = useState(
    []
  );
  const [showScheduleOrderWarning, setShowScheduleOrderWarning] =
    useState(false);
  const [showEmptyScheduleWarning, setShowEmptyScheduleWarning] =
    useState(false);
  const [showEmptyStartTimeWarning, setShowEmptyStartTimeWarning] =
    useState(false);
  const invalidTimeText24Hour = "Please enter in 24-hr format";
  const invalidTimeText12Hour = "Please enter in 12-hr format";

  useEffect(() => {
    if (isAutoFill) {
      if (enable24HourTimers) {
        setSchedules(enableSchedule?.scheduleTiming || []);
      } else {
        const parsedTimings = enableSchedule?.scheduleTiming.map((time) =>
          moment(time, "hh:mm A")
        );
        setSchedules(parsedTimings || []);
      }
    } else {
      const defaultSchedules = Array.from(
        { length: enableSchedule?.frequencyPerDay },
        () => ""
      );
      setSchedules(defaultSchedules);
    }
  }, [isAutoFill, enable24HourTimers, enableSchedule]);

  const validateSave = async () => {
    if (
      isInvalidTimeTextPresent(
        enable24HourTimers,
        invalidTimeText12Hour,
        invalidTimeText24Hour
      )
    )
      return false;
    if (enableSchedule) {
      return await isValidSchedule(
        schedules,
        setShowEmptyScheduleWarning,
        setShowScheduleOrderWarning
      );
    }
    if (enableStartTime) {
      if (!startTime) {
        setShowEmptyStartTimeWarning(true);
        return false;
      }
      return true;
    }
  };

  const handleSave = async () => {
    const performSave = await validateSave();
    if (performSave) {
      const medication = createDrugChartPayload(
        hostData,
        drugChartNotes,
        enableStartTime,
        enableSchedule,
        enable24HourTimers,
        schedules,
        startTime
      );
      const response = await saveMedication(medication);
      response.status === 200 ? hostApi.onModalSave?.() : null;
    }
  };

  const handleCancel = () => {
    hostApi.onModalCancel?.();
  };

  const handleClose = () => {
    hostApi.onModalClose?.();
  };

  return (
    <I18nProvider>
      <SideBarPanel
        title={
          title ? title : <FormattedMessage id="DRUG_CHART_MODAL_HEADER" />
        }
        closeSideBar={handleClose}
      >
        <div style={{ padding: "20px", paddingBottom: "120px" }}>
          <TextInput
            id="drug-name"
            className="drug-name"
            type="text"
            value={hostData?.drugOrder?.drug?.name}
            labelText="Drug Name"
            disabled
          />
          <div className="inline-field">
            <div className="dose-field-with-units">
              <NumberInputCarbon
                id={"Dropdown"}
                onChange={() => {}}
                style={{ width: "50%" }}
                label={"Dose"}
                value={hostData?.drugOrder?.uniformDosingType?.dose}
                isDisabled={true}
              />
              <DropdownCarbon
                id={"Dropdown"}
                onChange={() => {}}
                titleText={" "}
                style={{ paddingLeft: "10px" }}
                selectedValue={
                  hostData?.drugOrder?.uniformDosingType?.doseUnits
                }
                options={[]}
                isDisabled={true}
              />
            </div>
            <div className="route">
              <DropdownCarbon
                id={"Dropdown"}
                onChange={() => {}}
                titleText={"Route"}
                selectedValue={hostData?.drugOrder?.route}
                options={[]}
                isDisabled={true}
              />
            </div>
          </div>
          <div className="inline-field">
            <div className="duration-field-with-units">
              <NumberInputCarbon
                id={"Dropdown"}
                onChange={() => {}}
                label={"Duration"}
                value={hostData?.drugOrder?.duration}
                isDisabled={true}
              />
              <DropdownCarbon
                id={"Dropdown"}
                onChange={() => {}}
                titleText={" "}
                selectedValue={hostData?.drugOrder?.durationUnit}
                options={[]}
                isDisabled={true}
              />
            </div>
            <DatePickerCarbon
              id={"Dropdown"}
              onChange={() => {}}
              titleText={"Start Date"}
              title={"Start Date"}
              value={moment(hostData?.drugOrder?.scheduledDate).format(
                "MM/DD/YYYY"
              )}
              isDisabled={true}
            />
          </div>
          <div className="frequency">
            <DropdownCarbon
              id={"DropdownFrequency"}
              onChange={() => {}}
              titleText={"Frequency"}
              selectedValue={hostData?.drugOrder?.uniformDosingType?.frequency}
              options={[]}
              isDisabled={true}
            />
          </div>
          {enableSchedule && (
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
                            handleSchedule(
                              time,
                              index,
                              schedules,
                              setSchedules,
                              enable24HourTimers,
                              invalidTimeText12Hour,
                              invalidTimeText24Hour,
                              setShowSchedulePassedWarning
                            );
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
                            handleSchedule(
                              time,
                              index,
                              schedules,
                              setSchedules,
                              enable24HourTimers,
                              invalidTimeText12Hour,
                              invalidTimeText24Hour,
                              setShowSchedulePassedWarning
                            );
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
          )}
          {enableStartTime && (
            <div className="start-time">
              {enable24HourTimers ? (
                <>
                  <TimePicker24Hour
                    data-modal-primary-focus
                    labelText={"Start Time"}
                    id={"start-time"}
                    onChange={(time) =>
                      handleStartTime(
                        time,
                        enable24HourTimers,
                        hostData,
                        setShowEmptyStartTimeWarning,
                        setShowStartTimeBeyondNextDoseWarning,
                        setShowStartTimePassedWarning,
                        setStartTime
                      )
                    }
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
                    onChange={(time) =>
                      handleStartTime(
                        time,
                        enable24HourTimers,
                        hostData,
                        setShowEmptyStartTimeWarning,
                        setShowStartTimeBeyondNextDoseWarning,
                        setShowStartTimePassedWarning,
                        setStartTime
                      )
                    }
                    defaultTime={startTime}
                    labelText={"Start Time"}
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
          )}
          <div className="instructions">
            <TextArea
              className="instruction"
              readOnly
              type="text"
              rows={1}
              value={hostData?.drugOrder?.instructions}
              labelText="Instruction"
              disabled
            />
          </div>
          <div className="additional-instructions">
            <TextArea
              className="additional-instruction"
              readOnly
              type="text"
              rows={1}
              value={hostData?.drugOrder?.additionalInstructions}
              labelText="Additional Instruction"
              disabled
            />
          </div>
          <div className="notes-sections">
            <TextArea
              data-testid="notes-section"
              className="notes-section"
              type="text"
              rows={3}
              value={drugChartNotes}
              onChange={(e) => setDrugChartNotes(e.target.value)}
              labelText="Notes"
            />
          </div>
        </div>
        <SaveAndCloseButtons
          onSave={() => handleSave()}
          onClose={() => handleCancel()}
        />
      </SideBarPanel>
    </I18nProvider>
  );
};

DrugChartSlider.propTypes = {
  title: PropTypes.string.isRequired,
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
  setDrugChartNotes: PropTypes.func.isRequired,
  drugChartNotes: PropTypes.string.isRequired,
};

export default DrugChartSlider;
