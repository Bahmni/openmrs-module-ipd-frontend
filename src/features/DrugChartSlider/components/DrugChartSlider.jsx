import React, { useContext, useEffect, useState } from "react";
import { TimePicker, TimePicker24Hour, Title } from "bahmni-carbon-ui";
import { TextArea } from "carbon-components-react";
import moment from "moment";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../i18n/I18nProvider";
import SideBarPanel from "../../SideBarPanel/components/SideBarPanel";
import "../styles/DrugChartSlider.scss";
import { medicationFrequency } from "../../../constants";
import { SaveAndCloseButtons } from "../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import { SliderContext } from "../../../context/SliderContext";
import {
  isTimePassed,
  validateSchedules,
  saveMedication,
  updateStartTimeBasedOnFrequency,
  isInvalidTimeTextPresent,
  invalidTimeText24Hour,
  invalidTimeText12Hour,
  getUTCTimeEpoch,
} from "../utils/DrugChartSliderUtils";
import { DrugDetails } from "./DrugDetails";
import { DrugInstructions } from "./DrugInstructions";
import { StartTimeSection } from "./StartTimeSection";

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
  const isAutoFill = Boolean(enableSchedule?.scheduleTiming);

  const { setSliderContentModified } = useContext(SliderContext);
  const updateSliderContentModified = (value) => {
    setSliderContentModified((prev) => {
      return {
        ...prev,
        treatments: value,
      };
    });
  };
  const [firstDaySlotsMissed, setFirstDaySlotsMissed] = useState(0);
  const [startTime, setStartTime] = useState("");

  const [
    showStartTimeBeyondNextDoseWarning,
    setShowStartTimeBeyondNextDoseWarning,
  ] = useState(false);
  const [showStartTimePassedWarning, setShowStartTimePassedWarning] =
    useState(false);
  const [showEmptyStartTimeWarning, setShowEmptyStartTimeWarning] =
    useState(false);

  const [schedules, setSchedules] = useState([]);
  const [firstDaySchedules, setFirstDaySchedules] = useState([]);
  const [finalDaySchedules, setFinalDaySchedules] = useState([]);

  const [showSchedulePassedWarning, setShowSchedulePassedWarning] = useState(
    []
  );
  const [showScheduleOrderWarning, setShowScheduleOrderWarning] =
    useState(false);
  const [showEmptyScheduleWarning, setShowEmptyScheduleWarning] =
    useState(false);

  const [
    showFirstDaySchedulePassedWarning,
    setShowFirstDaySchedulePassedWarning,
  ] = useState([]);
  const [
    showFirstDayScheduleOrderWarning,
    setShowFirstDayScheduleOrderWarning,
  ] = useState(false);
  const [
    showEmptyFirstDayScheduleWarning,
    setShowEmptyFirstDayScheduleWarning,
  ] = useState(false);

  const [
    showFinalDayScheduleOrderWarning,
    setShowFinalDayScheduleOrderWarning,
  ] = useState(false);
  const [
    showEmptyFinalDayScheduleWarning,
    setShowEmptyFinalDayScheduleWarning,
  ] = useState(false);

  const handleFirstDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);
    const newScheduleArray = [...firstDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, "hh:mm A");
    setFirstDaySchedules(newScheduleArray);
    if (!isInvalidTimeTextPresent(enable24HourTimers)) {
      setShowFirstDaySchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isTimePassed(newSchedule);
        return newSchedulePassedWarnings;
      });
    }
  };

  const handleSubsequentDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);
    const newScheduleArray = [...schedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, "hh:mm A");
    setSchedules(newScheduleArray);
    if (!isInvalidTimeTextPresent(enable24HourTimers)) {
      setShowSchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isTimePassed(newSchedule);
        return newSchedulePassedWarnings;
      });
    }
  };

  const handleFinalDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);
    const newScheduleArray = [...finalDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, "hh:mm A");
    setFinalDaySchedules(newScheduleArray);
  };

  const handleScheduleWarnings = async () => {
    const { isValid, warningType } = await validateSchedules(schedules);
    setShowEmptyScheduleWarning(!isValid && warningType === "empty");
    setShowScheduleOrderWarning(!isValid && warningType === "passed");
    return { isValid, warningType };
  };

  const isValidSchedule = async () => {
    const { isValid, warningType } = await handleScheduleWarnings();
    if (!isValid && (warningType === "empty" || warningType === "passed"))
      return false;
    return true;
  };

  const handleFirstDayScheduleWarnings = async () => {
    const { isValid, warningType } = await validateSchedules(
      firstDaySchedules.filter(
        (firstDaySchedule) => firstDaySchedule != "hh:mm"
      )
    );
    setShowEmptyFirstDayScheduleWarning(!isValid && warningType === "empty");
    setShowFirstDayScheduleOrderWarning(!isValid && warningType === "passed");
    return { isValid, warningType };
  };

  const isValidFirstDaySchedule = async () => {
    const { isValid, warningType } = await handleFirstDayScheduleWarnings();
    if (!isValid && (warningType === "empty" || warningType === "passed"))
      return false;
    return true;
  };

  const handleFinalDayScheduleWarnings = async () => {
    const { isValid, warningType } = await validateSchedules(finalDaySchedules);
    setShowEmptyFinalDayScheduleWarning(!isValid && warningType === "empty");
    setShowFinalDayScheduleOrderWarning(!isValid && warningType === "passed");
    return { isValid, warningType };
  };

  const isValidFinalDaySchedule = async () => {
    const { isValid, warningType } = await handleFinalDayScheduleWarnings();
    if (!isValid && (warningType === "empty" || warningType === "passed"))
      return false;
    return true;
  };

  const isStartTimeExceedingFrequency = (time, frequency) => {
    const currentTime = moment();
    const enteredTime = enable24HourTimers
      ? moment(time, "HH:mm")
      : moment(time, "hh:mm A");
    const updatedTime = updateStartTimeBasedOnFrequency(frequency, currentTime);
    return enteredTime.isAfter(updatedTime);
  };

  const handleStartTime = async (time) => {
    updateSliderContentModified(true);
    if (time === "") {
      setShowEmptyStartTimeWarning(true);
      setShowStartTimeBeyondNextDoseWarning(false);
      setShowStartTimePassedWarning(false);
      return;
    } else {
      setShowEmptyStartTimeWarning(false);
    }
    if (
      (enable24HourTimers && !moment(time, "HH:mm", true).isValid()) ||
      (!enable24HourTimers && !moment(time, "hh:mm A", true).isValid())
    ) {
      setStartTime(time);
      return;
    }
    isStartTimeExceedingFrequency(
      time,
      hostData?.drugOrder?.uniformDosingType?.frequency
    )
      ? setShowStartTimeBeyondNextDoseWarning(true)
      : setShowStartTimeBeyondNextDoseWarning(false);
    isTimePassed(time)
      ? setShowStartTimePassedWarning(true)
      : setShowStartTimePassedWarning(false);

    enable24HourTimers
      ? setStartTime(time)
      : setStartTime(moment(time, "hh:mm A"));
  };

  const createDrugChartPayload = () => {
    var payload = {
      providerUuid: hostData?.drugOrder?.provider?.uuid,
      patientUuid: hostData?.patientId,
      orderUuid: hostData?.drugOrder?.uuid,
      slotStartTime: null,
      firstDaySlotsStartTime: null,
      dayWiseSlotsStartTime: null,
      remainingDaySlotsStartTime: null,
      comments: drugChartNotes,
      medicationFrequency: "",
    };
    if (enableStartTime) {
      const startTimeUTCEpoch = getUTCTimeEpoch(
        startTime,
        enable24HourTimers,
        hostData?.drugOrder?.scheduledDate
      );
      payload.slotStartTime = startTimeUTCEpoch;
      payload.medicationFrequency =
        medicationFrequency.START_TIME_DURATION_FREQUENCY;
    }
    if (enableSchedule) {
      const nextScheduleDate = 24 * 60 * 60;
      const finalScheduleDate =
        nextScheduleDate * hostData?.drugOrder?.duration;

      const firstDaySchedulesUTCTimeEpoch = firstDaySchedules.reduce(
        (result, schedule) => {
          if (schedule !== "hh:mm") {
            result.push(
              getUTCTimeEpoch(
                schedule,
                enable24HourTimers,
                hostData?.drugOrder?.scheduledDate
              )
            );
          }
          return result;
        },
        []
      );

      const schedulesUTCTimeEpoch = schedules.map((schedule) =>
        getUTCTimeEpoch(
          schedule,
          enable24HourTimers,
          hostData?.drugOrder?.scheduledDate
        )
      );

      const finalDaySchedulesUTCTimeEpoch = finalDaySchedules.map((schedule) =>
        getUTCTimeEpoch(
          schedule,
          enable24HourTimers,
          hostData?.drugOrder?.scheduledDate
        )
      );

      payload.firstDaySlotsStartTime =
        firstDaySlotsMissed > 0 ? firstDaySchedulesUTCTimeEpoch : [];
      payload.dayWiseSlotsStartTime = firstDaySchedules.some(
        (schedule) => schedule == "hh:mm"
      )
        ? schedulesUTCTimeEpoch.map((schedules) => schedules + nextScheduleDate)
        : schedulesUTCTimeEpoch;
      const remainingDaySlotsStartTime = finalDaySchedulesUTCTimeEpoch.map(
        (schedules) => schedules + finalScheduleDate
      );

      const remainingDaySlotsTime = remainingDaySlotsStartTime.slice(
        0,
        firstDaySlotsMissed
      );
      payload.remainingDaySlotsStartTime = remainingDaySlotsTime;
      payload.medicationFrequency =
        medicationFrequency.FIXED_SCHEDULE_FREQUENCY;
    }
    return payload;
  };

  const validateSave = async () => {
    if (isInvalidTimeTextPresent(enable24HourTimers)) return false;
    if (enableSchedule) {
      const validFirstDaySchedules = await isValidFirstDaySchedule();
      const validSchedules = await isValidSchedule();
      const validFinalDaySchedules = await isValidFinalDaySchedule();
      if (!validFirstDaySchedules || !validSchedules || !validFinalDaySchedules)
        return false;
      return true;
    }
    if (enableStartTime) {
      if (!startTime) {
        setShowEmptyStartTimeWarning(true);
        return false;
      }
      return true;
    }
  };

  useEffect(() => {
    if (isAutoFill) {
      const scheduleTimings = enable24HourTimers
        ? enableSchedule?.scheduleTiming
        : enableSchedule?.scheduleTiming.map((time) => moment(time, "hh:mm A"));
      let finalScheduleCount = 0;
      scheduleTimings.forEach((schedule) => {
        if (isTimePassed(schedule)) {
          setFirstDaySchedules((prevSchedules) => [...prevSchedules, "hh:mm"]);
          finalScheduleCount = finalScheduleCount + 1;
          setFirstDaySlotsMissed((prevSlotNumber) => prevSlotNumber + 1);
        } else {
          setFirstDaySchedules((prevSchedules) => [...prevSchedules, schedule]);
        }
      });
      setSchedules(scheduleTimings || []);
      finalScheduleCount > 0 &&
        setFinalDaySchedules(scheduleTimings.slice(firstDaySlotsMissed) || []);
      if (finalScheduleCount == enableSchedule?.frequencyPerDay) {
        setFirstDaySchedules([]);
        setFinalDaySchedules([]);
        setFirstDaySlotsMissed(0);
      }
    } else {
      const defaultSchedules = Array.from(
        { length: enableSchedule?.frequencyPerDay },
        () => ""
      );
      setSchedules(defaultSchedules);
    }
  }, [isAutoFill, enable24HourTimers, enableSchedule]);

  const handleSave = async () => {
    const performSave = await validateSave();
    if (performSave) {
      const medication = createDrugChartPayload();
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

  const handleNotes = (e) => {
    updateSliderContentModified(true);
    setDrugChartNotes(e.target.value);
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
          <DrugDetails hostData={hostData} />
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
          {enableStartTime && (
            <StartTimeSection
              startTime={startTime}
              handleStartTime={handleStartTime}
              showEmptyStartTimeWarning={showEmptyStartTimeWarning}
              showStartTimeBeyondNextDoseWarning={
                showStartTimeBeyondNextDoseWarning
              }
              showStartTimePassedWarning={showStartTimePassedWarning}
              enable24HourTimers={enable24HourTimers}
            />
          )}
          <DrugInstructions hostData={hostData} />
          <div className="notes-sections">
            <TextArea
              data-testid="notes-section"
              className="notes-section"
              type="text"
              rows={3}
              value={drugChartNotes}
              onChange={(e) => handleNotes(e)}
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
