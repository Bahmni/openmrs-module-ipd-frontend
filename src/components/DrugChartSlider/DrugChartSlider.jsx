import React, { useEffect, useState, useRef } from "react";
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
  console.log("hostData", hostData);
  const enableSchedule = hostData?.scheduleFrequencies.find(
    (frequency) =>
      frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
  );
  console.log("enableSchedule", enableSchedule);
  const enableStartTime = hostData?.startTimeFrequencies.includes(
    hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enable24HourTimers = hostData?.enable24HourTimers || false;
  const isAutoFill = !!enableSchedule?.scheduleTiming;

  useEffect(() => {
    if (isAutoFill) {
      if (enable24HourTimers) {
        setSchedules(enableSchedule?.scheduleTiming || []);
        setFinalDaySchedules(enableSchedule?.scheduleTiming || []);
        setFirstDaySchedules(enableSchedule?.scheduleTiming || []);
      } else {
        const parsedTimings = enableSchedule?.scheduleTiming.map((time) =>
          moment(time, "hh:mm A")
        );
        setSchedules(parsedTimings || []);
        setFinalDaySchedules(parsedTimings || []);
        setFirstDaySchedules(parsedTimings || []);
      }
    } else {
      const defaultSchedules = Array.from(
        { length: enableSchedule?.frequencyPerDay },
        () => ""
      );
      setSchedules(defaultSchedules);
    }
  }, [isAutoFill, enable24HourTimers, enableSchedule]);

  // useEffect(() => {
  //   console.log("inside useeffect", firstDaySchedules);
  //   firstDaySchedules.forEach((schedule) => {
  //     if (isTimePassed(schedule)) {
  //       setFirstDaySlotNumber((prevSlotNumber) => prevSlotNumber + 1);
  //     }
  //   });
  // },[firstDaySchedules]);

  const firstDaySchedulesRef = useRef(firstDaySchedules);

  useEffect(() => {
    firstDaySchedulesRef.current = firstDaySchedules;
  }, [firstDaySchedules]);

  // Now you can use firstDaySchedulesRef.current in other parts of your component

  useEffect(() => {
    // Your code that depends on firstDaySchedules
    firstDaySchedulesRef.current.forEach((schedule) => {
      if (isTimePassed(schedule)) {
        setFirstDaySlotNumber((prevSlotNumber) => prevSlotNumber + 1);
      }
    });
  }, []);

  const [schedules, setSchedules] = useState([]);
  const [firstDaySchedules, setFirstDaySchedules] = useState([]);
  const [finalDaySchedules, setFinalDaySchedules] = useState([]);
  const [firstDaySlotNumber, setFirstDaySlotNumber] = useState(0);

  console.log("firstDaySlotNumber", firstDaySlotNumber);

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
      setShowSchedulePassedWarning((prevScheduleWarnings) => {
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
  };

  const handleFinalDaySchedule = (newSchedule, index) => {
    const newScheduleArray = [...finalDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, "hh:mm A");
    setFinalDaySchedules(newScheduleArray);
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
      const schedulesUTCTimeEpoch = schedules.map((schedule) => {
        return getUTCTimeEpoch(schedule);
      });
      const firstDaySchedulesUTCTimeEpoch = firstDaySchedules
        .filter((schedule) => !isTimePassed(schedule))
        .map((schedule) => {
          return getUTCTimeEpoch(schedule);
        });

      const finalDaySchedulesUTCTimeEpoch = finalDaySchedules.map(
        (schedule) => {
          return getUTCTimeEpoch(schedule);
        }
      );

      console.log("schedulesUTCTimeEpoch", schedulesUTCTimeEpoch);
      console.log(
        "firstDaySchedulesUTCTimeEpoch",
        firstDaySchedulesUTCTimeEpoch
      );
      const hrinseconds = 24 * 60 * 60;
      console.log(
        "enableSchedule?.frequencyPerDay",
        enableSchedule?.frequencyPerDay
      );
      const hrinsecondsFinal = 24 * 60 * 60 * enableSchedule?.frequencyPerDay;
      console.log("hrinsecondsFinal", hrinsecondsFinal);
      payload.dayWiseSlotsStartTime = firstDaySchedules
        ? schedulesUTCTimeEpoch.map((schedules) => schedules + hrinseconds)
        : schedulesUTCTimeEpoch;
      // payload.remainingDaySlotsStartTime = firstDaySchedules && finalDaySchedulesUTCTimeEpoch.map(
      //   (schedules) => schedules + hrinsecondsFinal
      // );
      const remainingDaySlotsStartTime = finalDaySchedulesUTCTimeEpoch.map(
        (schedules) => schedules + hrinsecondsFinal
      );
      console.log("remainingDaySlotsStartTime", remainingDaySlotsStartTime);
      payload.firstDaySlotsStartTime = firstDaySchedulesUTCTimeEpoch;
      payload.medicationFrequency =
        medicationFrequency.FIXED_SCHEDULE_FREQUENCY;
    }
    return payload;
  };

  const validateSave = async () => {
    if (isInvalidTimeTextPresent()) return false;
    if (enableSchedule) {
      return await isValidSchedule();
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
                            defaultTime={
                              isTimePassed(firstDaySchedules[index])
                                ? "hh:mm"
                                : firstDaySchedules[index]
                            }
                            onChange={(time) => {
                              handleFirstDaySchedule(time, index);
                            }}
                            labelText=" "
                            width="70%"
                            invalidText={invalidTimeText24Hour}
                            isDisabled={isTimePassed(firstDaySchedules[index])}
                          />
                        </div>
                      ) : (
                        <div className="schedule-time" key={index}>
                          <TimePicker
                            key={index}
                            labelText=" "
                            defaultTime={
                              isTimePassed(firstDaySchedules[index])
                                ? "hh:mm"
                                : firstDaySchedules[index]
                            }
                            onChange={(time) => {
                              handleFirstDaySchedule(time, index);
                            }}
                            id={`schedule-${index}`}
                            isDisabled={isTimePassed(firstDaySchedules[index])}
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
                      length:
                        enableSchedule?.frequencyPerDay - firstDaySlotNumber,
                    },
                    // { length: finalDaySlotNumber },
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
