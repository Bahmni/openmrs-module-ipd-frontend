import {
  DatePickerCarbon,
  DropdownCarbon,
  NumberInputCarbon,
  TimePicker,
  TimePicker24Hour,
  Title,
} from "bahmni-carbon-ui";
import { Modal, TextArea, TextInput } from "carbon-components-react";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import {
  getDrugOrderFrequencies,
  saveMedication,
  updateStartTimeBasedOnFrequency,
} from "../../utils/DrugChartModalUtils";
import "./DrugChartModal.scss";

export default function DrugChartModal(props) {
  const { hostData, hostApi } = props;
  const [allFrequencies, setAllFrequencies] = useState([]);
  const enableSchedule = hostData?.scheduleFrequencies.find(
    (frequency) =>
      frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enableStartTime = hostData?.startTimeFrequencies.includes(
    hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enable24HourTimers = hostData?.enable24HourTimers || false;

  const [schedules, setSchedules] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [showStartTimePassedWarning, setShowStartTimePassedWarning] =
    useState(false);
  const [showScheduleOrderWarning, setShowScheduleOrderWarning] =
    useState(false);
  const [showEmptyScheduleWarning, setShowEmptyScheduleWarning] =
    useState(false);
  const [showEmptyStartTimeWarning, setShowEmptyStartTimeWarning] =
    useState(false);
  const [drugChartNotes, setDrugChartNotes] = useState("");

  const isInvalidTimeTextPresent = () => {
    const screenContent = document.body.textContent;
    const invalidTimeText = enable24HourTimers
      ? "Please enter a valid time in 24-hr format"
      : "Please enter a valid time in 12-hr format";
    return screenContent.includes(invalidTimeText);
  };

  const handleSchedule = (newSchedule, index) => {
    const newScheduleArray = [...schedules];
    newScheduleArray[index] = newSchedule;
    setSchedules(newScheduleArray);
  };

  const areSchedulesInOrder = (allSchedule) => {
    return allSchedule.every((schedule, index) => {
      if (index === 0) return true;
      const currentTime = moment(schedule, "HH:mm");
      const prevTime = moment(allSchedule[index - 1], "HH:mm");
      return currentTime.isSameOrAfter(prevTime);
    });
  };

  const validateSchedules = async (schedules) => {
    if (
      schedules.length === 0 ||
      schedules.length !== getRequiredFrequency().frequencyPerDay ||
      schedules.every((schedule) => !schedule)
    ) {
      return { isValid: false, warningType: "empty" };
    }

    if (areSchedulesInOrder(schedules)) {
      return { isValid: true, warningType: "" };
    } else {
      return { isValid: false, warningType: "passed" };
    }
  };

  const convertSchedules = (schedules, enable24HourTimers) => {
    return enable24HourTimers
      ? schedules
      : schedules.map((time) => moment(time, "hh:mm A"));
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

  const isStartTimeExceedingFrequency = (time, frequency) => {
    const currentTime = moment();
    const enteredTime = moment(time, "HH:mm");
    const updatedTime = updateStartTimeBasedOnFrequency(frequency, currentTime);
    return enteredTime.isAfter(updatedTime);
  };

  const handleStartTime = (time) => {
    isStartTimeExceedingFrequency(
      time,
      hostData?.drugOrder?.uniformDosingType?.frequency
    )
      ? setShowStartTimePassedWarning(true)
      : setShowStartTimePassedWarning(false);
    setStartTime(time);
  };

  const getRequiredFrequency = () => {
    return allFrequencies.find(
      (frequency) =>
        frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
    );
  };

  const convertStartTime = (time, enable24HourTimers) => {
    return enable24HourTimers ? time : time.format("hh:mm A");
  };

  const handleStartTimeChange = () => {
    const time = convertStartTime(startTime, enable24HourTimers);
    const frequencyConfig = getRequiredFrequency();
    console.log(
      "Number of Slots = ",
      frequencyConfig?.frequencyPerDay *
        hostData?.drugOrder?.uniformDosingType?.dose *
        hostData?.drugOrder?.duration,
      "Time = ",
      time
    );
  };

  const getUTCTime = (time) => {
    const [hours, minutes] = time.split(":");
    const [day, month, year] = moment(hostData?.drugOrder?.scheduledDate)
      .format("DD-MM-YYYY")
      .split("-");
    const utcTime = moment(
      `${year}-${month}-${day}T${hours}:${minutes}:00.0`
    ).format("YYYY-MM-DDTHH:mm:ss.SSS");
    console.log("utcTime = ", utcTime);
    return utcTime;
  };

  const createDrugChartPayload = () => {
    var payload = {
      providerUuid: hostData?.drugOrder?.provider?.uuid,
      patientUuid: hostData?.patientId,
      orderUuid: hostData?.drugOrder?.uuid,
      slotStartTime: "",
      firstDaySlotsStartTime: [],
      dayWiseSlotsStartTime: [],
      comments: drugChartNotes,
      medicationFrequency: "",
    };
    if (enableStartTime) {
      const startTimeUTC = getUTCTime(startTime);
      payload.slotStartTime = startTimeUTC;
      payload.medicationFrequency = "START_TIME_DURATION_FREQUENCY";
    }
    if (enableSchedule) {
      const schedulesUTC = schedules.map((schedule) => {
        return getUTCTime(schedule);
      });
      console.log("schedules = ", schedulesUTC);
      payload.dayWiseSlotsStartTime = schedulesUTC;
      payload.medicationFrequency = "FIXED_SCHEDULE_FREQUENCY";
    }
    console.log("payload = ", payload);
    return payload;
  };

  const handleSchedulesChange = () => {
    const schedulesArray = convertSchedules(schedules, enable24HourTimers);

    const frequencyConfig = getRequiredFrequency();
    console.log(
      "Number of Slots = ",
      frequencyConfig?.frequencyPerDay *
        hostData?.drugOrder?.uniformDosingType?.dose *
        hostData?.drugOrder?.duration,
      "Schedules = ",
      schedulesArray
    );
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
      if (showStartTimePassedWarning) return false;
      return true;
    }
  };

  const handleSave = async () => {
    const performSave = await validateSave();
    if (performSave) {
      enableStartTime && handleStartTimeChange();
      enableSchedule && handleSchedulesChange();
      console.log("Drug Chart Modal Save Clicked and Validated");
      console.log("ShowStartTimePassedWarning = ", showStartTimePassedWarning);
      console.log("ShowEmptyScheduleWarning = ", showEmptyScheduleWarning);
      console.log("ShowSchedulePassedWarning = ", showScheduleOrderWarning);
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

  useEffect(async () => {
    setAllFrequencies(await getDrugOrderFrequencies());
  }, []);

  return (
    <>
      <I18nProvider>
        <Modal
          className="drug-chart-modal"
          open
          modalHeading={<FormattedMessage id="DRUG_CHART_MODAL_HEADER" />}
          primaryButtonText={<FormattedMessage id="DRUG_CHART_MODAL_SAVE" />}
          secondaryButtonText={
            <FormattedMessage id="DRUG_CHART_MODAL_CANCEL" />
          }
          onRequestClose={handleClose}
          closeButtonLabel={<FormattedMessage id="DRUG_CHART_MODAL_CLOSE" />}
          onRequestSubmit={handleSave}
          onSecondarySubmit={handleCancel}
          preventCloseOnClickOutside={true}
        >
          <div>
            <TextInput
              id="drug-name"
              className="drug-name"
              readOnly
              type="text"
              value={hostData?.drugOrder?.drug?.name}
              labelText="Drug Name"
            />
            <div className="inline-field">
              <div className="field-with-units">
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
              <div className="field-with-units">
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
            </div>
            <div className="frequency">
              <DropdownCarbon
                id={"Dropdown"}
                onChange={() => {}}
                titleText={"Frequency"}
                selectedValue={
                  hostData?.drugOrder?.uniformDosingType?.frequency
                }
                options={[]}
                isDisabled={true}
              />
            </div>
            {enableSchedule && (
              <div className="schedule-section">
                <Title text="Schedule(s)" isRequired={true} />
                <div className="inline-field" id="schedule">
                  {Array.from(
                    { length: enableSchedule.frequencyPerDay },
                    (_, index) =>
                      enable24HourTimers ? (
                        <TimePicker24Hour
                          key={index}
                          id={`schedule-${index}`}
                          defaultTime={schedules[index]}
                          onChange={(time) => {
                            handleSchedule(time, index);
                          }}
                          labelText=" "
                          width="70%"
                        />
                      ) : (
                        <TimePicker
                          key={index}
                          labelText=" "
                          defaultTime={schedules[index]}
                          onChange={(time) => {
                            handleSchedule(time, index);
                          }}
                          id={`schedule-${index}`}
                        />
                      )
                  )}
                </div>
                {showScheduleOrderWarning && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_ORDER_WARNING"></FormattedMessage>
                  </p>
                )}
                {showEmptyScheduleWarning && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_SCHEDULE_WARNING"></FormattedMessage>
                  </p>
                )}
              </div>
            )}
            {enableStartTime && (
              <div className="start-time">
                {enable24HourTimers ? (
                  <TimePicker24Hour
                    data-modal-primary-focus
                    labelText={"Start Time"}
                    id={"start-time"}
                    onChange={(time) => handleStartTime(time)}
                    isRequired={true}
                    defaultTime={startTime}
                    showWarning={showStartTimePassedWarning}
                    width="80%"
                  />
                ) : (
                  <TimePicker
                    id={"start-time"}
                    onChange={(time) => handleStartTime(time)}
                    defaultTime={startTime}
                    labelText={"Start Time"}
                    isRequired={true}
                  />
                )}
                {showStartTimePassedWarning && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_PASSED"></FormattedMessage>
                  </p>
                )}
                {showEmptyStartTimeWarning && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_START_TIME_WARNING"></FormattedMessage>
                  </p>
                )}
              </div>
            )}
            <div className="instructions">
              <TextArea
                className="instruction"
                readOnly
                type="text"
                rows={1}
                disabled={true}
                value={hostData?.drugOrder?.instructions}
                labelText="Instruction"
              />
            </div>
            <div className="additional-instructions">
              <TextArea
                className="additional-instruction"
                readOnly
                type="text"
                rows={1}
                disabled={true}
                value={hostData?.drugOrder?.additionalInstructions}
                labelText="Additional Instruction"
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
        </Modal>
      </I18nProvider>
    </>
  );
}

DrugChartModal.propTypes = {
  hostData: PropTypes.shape({
    drugOrder: PropTypes.object,
    patientId: PropTypes.string,
    scheduleFrequencies: PropTypes.array,
    startTimeFrequencies: PropTypes.array,
    enable24HourTimers: PropTypes.bool,
  }).isRequired,
  hostApi: PropTypes.shape({
    onModalClose: PropTypes.func.isRequired,
    onModalSave: PropTypes.func.isRequired,
    onModalCancel: PropTypes.func.isRequired,
  }),
};
