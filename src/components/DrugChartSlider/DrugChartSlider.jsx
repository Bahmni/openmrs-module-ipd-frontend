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
import { medicationFrequency } from "../../constants";
import { SaveAndCloseButtons } from "../../features/SaveAndCloseButtons/components/SaveAndCloseButtons";

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
    showFinalDaySchedulePassedWarning,
    setShowFinalDaySchedulePassedWarning,
  ] = useState([]);
  const [
    showFinalDayScheduleOrderWarning,
    setShowFinalDayScheduleOrderWarning,
  ] = useState(false);
  const [
    showEmptyFinalDayScheduleWarning,
    setShowEmptyFinalDayScheduleWarning,
  ] = useState(false);

  const invalidTimeText24Hour = "Please enter in 24-hr format";
  const invalidTimeText12Hour = "Please enter in 12-hr format";

  const isInvalidTimeTextPresent = () => {
    const screenContent = document.body.textContent;
    const invalidTimeText = enable24HourTimers
      ? invalidTimeText24Hour
      : invalidTimeText12Hour;
    return screenContent.includes(invalidTimeText);
  };

  const isTimePassed = (newTime) => {
    const currentTime = moment();
    const enteredTime = enable24HourTimers
      ? moment(newTime, "HH:mm")
      : moment(newTime, "hh:mm A");
    return currentTime.isAfter(enteredTime);
  };

  const handleFirstDaySchedule = (newSchedule, index) => {
    const newScheduleArray = [...firstDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, "hh:mm A");
    setFirstDaySchedules(newScheduleArray);
    if (!isInvalidTimeTextPresent()) {
      setShowFirstDaySchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isTimePassed(newSchedule);
        return newSchedulePassedWarnings;
      });
    }
  };

  const handleSubsequentDaySchedule = (newSchedule, index) => {
    const newScheduleArray = [...schedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, "hh:mm A");
    setSchedules(newScheduleArray);
    if (!isInvalidTimeTextPresent()) {
      setShowSchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isTimePassed(newSchedule);
        return newSchedulePassedWarnings;
      });
    }
  };

  const handleFinalDaySchedule = (newSchedule, index) => {
    const newScheduleArray = [...finalDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, "hh:mm A");
    setFinalDaySchedules(newScheduleArray);
    if (!isInvalidTimeTextPresent()) {
      setShowFinalDaySchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isTimePassed(newSchedule);
        return newSchedulePassedWarnings;
      });
    }
  };

  const areSchedulesInOrder = (allSchedule) => {
    return allSchedule.every((schedule, index) => {
      if (index === 0) return true;
      const currentTime = moment(schedule, "HH:mm");
      const prevTime = moment(allSchedule[index - 1], "HH:mm");
      return currentTime.isAfter(prevTime);
    });
  };

  const validateSchedules = async (schedules) => {
    if (schedules.some((schedule) => schedule === "")) {
      return { isValid: false, warningType: "empty" };
    }

    if (areSchedulesInOrder(schedules)) {
      return { isValid: true, warningType: "" };
    } else {
      return { isValid: false, warningType: "passed" };
    }
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

  const updateStartTimeBasedOnFrequency = (frequency, time) => {
    switch (frequency) {
      case "Every Hour":
        time.add(1, "hour");
        break;
      case "Every 2 hours":
        time.add(2, "hours");
        break;
      case "Every 3 hours":
        time.add(3, "hours");
        break;
      case "Every 4 hours":
        time.add(4, "hours");
        break;
      case "Every 6 hours":
        time.add(6, "hours");
        break;
      case "Every 8 hours":
        time.add(8, "hours");
        break;
      case "Every 12 hours":
        time.add(12, "hours");
        break;
      case "Once a day":
        time.add(1, "day");
        break;
      case "Nocte (At Night)":
        time.set({ hour: 23, minute: 59, second: 59 });
        break;
      case "Every 30 minutes":
        time.add(30, "minutes");
        break;
      default:
        break;
    }
    return time;
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

  const getUTCTimeEpoch = (time) => {
    const [hours, minutes] = enable24HourTimers
      ? time.split(":")
      : moment(time, "hh:mm A").format("HH:mm").split(":");
    const [day, month, year] = moment(hostData?.drugOrder?.scheduledDate)
      .format("DD-MM-YYYY")
      .split("-");
    const localTime = moment(
      `${year}-${month}-${day} ${hours}:${minutes}`,
      "YYYY-MM-DD HH:mm"
    );
    const utcTimeEpoch = moment.utc(localTime).unix();
    return utcTimeEpoch;
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
      const startTimeUTCEpoch = getUTCTimeEpoch(startTime);
      payload.slotStartTime = startTimeUTCEpoch;
      payload.medicationFrequency =
        medicationFrequency.START_TIME_DURATION_FREQUENCY;
    }
    if (enableSchedule) {
      const nextScheduleDate = 24 * 60 * 60;
      const finalScheduleDate =
        nextScheduleDate * enableSchedule?.frequencyPerDay;

      const firstDaySchedulesUTCTimeEpoch = firstDaySchedules
        .filter((schedule) => schedule !== "hh:mm")
        .map((schedule) => getUTCTimeEpoch(schedule));

      const schedulesUTCTimeEpoch = schedules.map((schedule) =>
        getUTCTimeEpoch(schedule)
      );

      const finalDaySchedulesUTCTimeEpoch = finalDaySchedules.map((schedule) =>
        getUTCTimeEpoch(schedule)
      );

      payload.firstDaySlotsStartTime = firstDaySchedulesUTCTimeEpoch;
      payload.dayWiseSlotsStartTime = firstDaySchedules.some(
        (schedule) => schedule != "hh:mm"
      )
        ? schedulesUTCTimeEpoch.map((schedules) => schedules + nextScheduleDate)
        : schedulesUTCTimeEpoch;
      const remainingDaySlotsStartTime = finalDaySchedulesUTCTimeEpoch.map(
        (schedules) => schedules + finalScheduleDate
      );
      remainingDaySlotsStartTime.slice(0, firstDaySlotsMissed);
      payload.remainingDaySlotsStartTime = remainingDaySlotsStartTime;
      payload.medicationFrequency =
        medicationFrequency.FIXED_SCHEDULE_FREQUENCY;
      console.log("payload", payload);
    }
    return payload;
  };

  const validateSave = async () => {
    if (isInvalidTimeTextPresent()) return false;
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
    console.log("handleSave", firstDaySchedules, schedules, finalDaySchedules);
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
                {showSchedulePassedWarning.some(
                  (showSchedulePassed) => showSchedulePassed === true
                ) && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_PASSED_WARNING"></FormattedMessage>
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
                        <div className="schedule-time" key={index}>
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
                        <div className="schedule-time" key={index}>
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
              {showFinalDaySchedulePassedWarning.some(
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
