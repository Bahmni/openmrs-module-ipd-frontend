import React, { useContext, useEffect, useState } from "react";
import { TextArea } from "carbon-components-react";
import moment from "moment";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../i18n/I18nProvider";
import SideBarPanel from "../../SideBarPanel/components/SideBarPanel";
import "../styles/DrugChartSlider.scss";
import {
  medicationFrequency,
  serviceType,
  timeFormatFor12Hr,
  timeFormatFor24Hr,
} from "../../../constants";
import { SaveAndCloseButtons } from "../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import { SliderContext } from "../../../context/SliderContext";
import { IPDContext } from "../../../context/IPDContext";
import {
  isTimePassed,
  validateSchedules,
  saveMedication,
  updateMedication,
  updateStartTimeBasedOnFrequency,
  isInvalidTimeTextPresent,
  getUTCTimeEpoch,
  setDrugOrderScheduleIn24HourFormat,
  setDrugOrderScheduleIn12HourFormat,
} from "../utils/DrugChartSliderUtils";
import {
  epochTo24HourTimeFormat,
  epochTo12HourTimeFormat,
} from "../../../utils/DateTimeUtils";
import { DrugDetails } from "./DrugDetails";
import { DrugInstructions } from "./DrugInstructions";
import { StartTimeSection } from "./StartTimeSection";
import { ScheduleSection } from "./ScheduleSection";

const DrugChartSlider = (props) => {
  const { title, hostData, hostApi, setDrugChartNotes, drugChartNotes } = props;
  const { config, handleAuditEvent } = useContext(IPDContext);
  const { drugChartSlider = {} } = config;
  const timeWindowToDisableSlots =
    drugChartSlider.timeInMinutesToDisableSlotPostScheduledTime;

  const enableSchedule =
    hostData?.drugOrder?.uniformDosingType?.frequency &&
    hostData?.drugOrder?.drugOrder?.duration
      ? hostData?.scheduleFrequencies?.find(
          (frequency) =>
            frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
        )
      : null;
  const enableStartTime =
    hostData?.startTimeFrequencies?.includes(
      hostData?.drugOrder?.uniformDosingType?.frequency
    ) ||
    !hostData?.drugOrder?.uniformDosingType?.frequency ||
    !hostData?.drugOrder?.drugOrder?.duration;
  const enable24HourTimers = hostData?.enable24HourTimers || false;
  const timeFormat = enable24HourTimers ? timeFormatFor24Hr : timeFormatFor12Hr;
  const isEdit = Boolean(hostData?.drugOrder?.drugOrderSchedule);
  const isAutoFill = Boolean(enableSchedule?.scheduleTiming) && !isEdit;
  const { setSliderContentModified } = useContext(SliderContext);
  let sliderTitle = title;
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
  const [isSaveDisabled, updateIsSaveDisabled] = useState(false);

  const handleFirstDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);
    const newScheduleArray = [...firstDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, timeFormatFor12Hr);
    setFirstDaySchedules(newScheduleArray);
    if (!isInvalidTimeTextPresent(enable24HourTimers)) {
      setShowFirstDaySchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isTimePassed(
          newSchedule,
          timeWindowToDisableSlots,
          enable24HourTimers
        );
        return newSchedulePassedWarnings;
      });
    }
  };

  const handleSubsequentDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);
    const newScheduleArray = [...schedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, timeFormatFor12Hr);
    setSchedules(newScheduleArray);
    if (!isInvalidTimeTextPresent(enable24HourTimers)) {
      setShowSchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isTimePassed(
          newSchedule,
          timeWindowToDisableSlots
        );
        return newSchedulePassedWarnings;
      });
    }
  };

  const handleFinalDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);
    const newScheduleArray = [...finalDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, timeFormatFor12Hr);
    setFinalDaySchedules(newScheduleArray);
  };

  const handleScheduleWarnings = async () => {
    const { isValid, warningType } = await validateSchedules(
      schedules,
      timeFormat
    );
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
      ),
      timeFormat
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
    const { isValid, warningType } = await validateSchedules(
      finalDaySchedules,
      timeFormat
    );
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
      ? moment(time, timeFormatFor24Hr)
      : moment(time, timeFormatFor12Hr);
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
      (enable24HourTimers &&
        !moment(time, timeFormatFor24Hr, true).isValid()) ||
      (!enable24HourTimers && !moment(time, timeFormatFor12Hr, true).isValid())
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
    isTimePassed(time, timeWindowToDisableSlots)
      ? setShowStartTimePassedWarning(true)
      : setShowStartTimePassedWarning(false);

    enable24HourTimers
      ? setStartTime(time)
      : setStartTime(moment(time, timeFormatFor12Hr));
  };

  const createDrugChartPayload = () => {
    let payload = {
      providerUuid: hostData?.drugOrder?.provider?.uuid,
      patientUuid: hostData?.patientId,
      orderUuid: hostData?.drugOrder?.drugOrder?.uuid,
      comments: drugChartNotes,
    };
    if (hostData?.drugOrder?.drugOrder?.dosingInstructions?.asNeeded) {
      payload.serviceType = serviceType.AS_NEEDED_PLACEHOLDER;
    } else {
      payload.slotStartTime = null;
      payload.firstDaySlotsStartTime = null;
      payload.dayWiseSlotsStartTime = null;
      payload.remainingDaySlotsStartTime = null;
      payload.medicationFrequency = "";
      payload.serviceType = serviceType.MEDICATION_REQUEST;

      if (enableStartTime) {
        const startTimeUTCEpoch = getUTCTimeEpoch(
          startTime,
          enable24HourTimers,
          hostData?.drugOrder?.drugOrder?.scheduledDate
        );
        payload.slotStartTime = startTimeUTCEpoch;
        payload.medicationFrequency =
          medicationFrequency.START_TIME_DURATION_FREQUENCY;
      }
      if (enableSchedule) {
        const nextScheduleDate = 24 * 60 * 60;
        const finalScheduleDate =
          nextScheduleDate * hostData?.drugOrder?.drugOrder?.duration;

        const firstDaySchedulesUTCTimeEpoch = firstDaySchedules.reduce(
          (result, schedule) => {
            if (schedule !== "hh:mm") {
              result.push(
                getUTCTimeEpoch(
                  schedule,
                  enable24HourTimers,
                  hostData?.drugOrder?.drugOrder?.scheduledDate
                )
              );
            }
            return result;
          },
          []
        );

        const schedulesUTCTimeEpoch = schedules?.map((schedule) =>
          getUTCTimeEpoch(
            schedule,
            enable24HourTimers,
            hostData?.drugOrder?.drugOrder?.scheduledDate
          )
        );

        const finalDaySchedulesUTCTimeEpoch = finalDaySchedules?.map(
          (schedule) =>
            getUTCTimeEpoch(
              schedule,
              enable24HourTimers,
              hostData?.drugOrder?.drugOrder?.scheduledDate
            )
        );

        payload.firstDaySlotsStartTime =
          firstDaySlotsMissed > 0 ? firstDaySchedulesUTCTimeEpoch : [];
        payload.dayWiseSlotsStartTime = firstDaySchedules.some(
          (schedule) => schedule == "hh:mm"
        )
          ? schedulesUTCTimeEpoch?.map(
              (schedules) => schedules + nextScheduleDate
            )
          : schedulesUTCTimeEpoch;
        const remainingDaySlotsStartTime = finalDaySchedulesUTCTimeEpoch?.map(
          (schedules) => schedules + finalScheduleDate
        );

        const remainingDaySlotsTime = remainingDaySlotsStartTime?.slice(
          0,
          firstDaySlotsMissed
        );
        payload.remainingDaySlotsStartTime = remainingDaySlotsTime;
        payload.medicationFrequency =
          medicationFrequency.FIXED_SCHEDULE_FREQUENCY;
      }
    }
    return payload;
  };

  const validateSave = async () => {
    if (hostData?.drugOrder?.drugOrder?.dosingInstructions?.asNeeded)
      return true;
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

  const checkIfTimeSlotIsEnabled = (timeMomentObject) =>
    moment().diff(timeMomentObject, "minutes") >= 0 &&
    moment().diff(timeMomentObject, "minutes") <= timeWindowToDisableSlots;

  useEffect(() => {
    if (isAutoFill) {
      const scheduleTimings = enable24HourTimers
        ? enableSchedule?.scheduleTiming
        : enableSchedule?.scheduleTiming.map((time) =>
            moment(time, timeFormatFor12Hr)
          );
      const currentTimeMomentObject = moment(
        moment(),
        enable24HourTimers ? timeFormatFor24Hr : timeFormatFor12Hr
      );
      let finalScheduleCount = 0;
      scheduleTimings.forEach((schedule) => {
        if (isTimePassed(schedule, timeWindowToDisableSlots)) {
          setFirstDaySchedules((prevSchedules) => [...prevSchedules, "hh:mm"]);
          finalScheduleCount = finalScheduleCount + 1;
          setFirstDaySlotsMissed((prevSlotNumber) => prevSlotNumber + 1);
        } else if (checkIfTimeSlotIsEnabled(schedule)) {
          if (finalScheduleCount === 0) {
            setSchedules((prevSchedules) => [
              ...prevSchedules,
              currentTimeMomentObject,
            ]);
          } else {
            setFirstDaySchedules((prevSchedules) => [
              ...prevSchedules,
              currentTimeMomentObject,
            ]);
          }
        } else {
          setFirstDaySchedules((prevSchedules) => [...prevSchedules, schedule]);
        }
      });

      if (
        finalScheduleCount === 0 &&
        checkIfTimeSlotIsEnabled(scheduleTimings[0])
      ) {
        for (let i = 0; i < scheduleTimings.length; i++) {
          const upcomingSchedule = moment(
            scheduleTimings[i],
            enable24HourTimers ? timeFormatFor24Hr : timeFormatFor12Hr
          );
          if (i !== 0) {
            setSchedules((prevSchedules) => [
              ...prevSchedules,
              upcomingSchedule,
            ]);
          }
        }
      } else {
        setSchedules(scheduleTimings || []);
      }
      if (
        finalScheduleCount > 0 &&
        finalScheduleCount === enableSchedule?.frequencyPerDay
      ) {
        const currentTime = moment().format(
          enable24HourTimers ? timeFormatFor24Hr : timeFormatFor12Hr
        );
        const getUpdatedFirstDaySchedules = () => {
          const updatedSchedule = Array.from(
            { length: finalScheduleCount - 1 },
            () => "hh:mm"
          );
          updatedSchedule.push(currentTime.toString());
          return updatedSchedule;
        };
        const updatedFirstDaySchedules = getUpdatedFirstDaySchedules();
        setFirstDaySlotsMissed(finalScheduleCount - 1);
        setFirstDaySchedules(updatedFirstDaySchedules);
      }
    } else {
      const defaultSchedules = Array.from(
        { length: enableSchedule?.frequencyPerDay },
        () => ""
      );
      setSchedules(defaultSchedules);
    }
  }, [isAutoFill, enable24HourTimers, enableSchedule]);

  useEffect(() => {
    const scheduleTimings = enable24HourTimers
      ? enableSchedule?.scheduleTiming
      : enableSchedule?.scheduleTiming?.map((time) =>
          moment(time, timeFormatFor12Hr)
        );
    if (scheduleTimings && firstDaySlotsMissed > 0 && isAutoFill) {
      setFinalDaySchedules(scheduleTimings.slice(0, firstDaySlotsMissed) || []);
      const quantity =
        hostData?.drugOrder?.drugOrder?.dosingInstructions?.quantity;
      const dose = hostData?.drugOrder?.drugOrder?.dosingInstructions?.dose;
      const totalNoOfSlots = Math.ceil(quantity / dose);
      if (totalNoOfSlots === enableSchedule?.frequencyPerDay) {
        setSchedules([]);
      }
    }
  }, [firstDaySlotsMissed, isAutoFill, enable24HourTimers, enableSchedule]);

  useEffect(() => {
    if (isEdit) {
      const drugOrderSchedule = hostData?.drugOrder?.drugOrderSchedule;
      const scheduleTimings = enable24HourTimers
        ? setDrugOrderScheduleIn24HourFormat(drugOrderSchedule)
        : setDrugOrderScheduleIn12HourFormat(drugOrderSchedule);

      if (Object.keys(scheduleTimings).length === 0) {
        const startTimeValue = enable24HourTimers
          ? epochTo24HourTimeFormat(drugOrderSchedule.slotStartTime)
          : epochTo12HourTimeFormat(drugOrderSchedule.slotStartTime);
        setStartTime(startTimeValue);
      }
      if (scheduleTimings.firstDaySlotsStartTime) {
        let frequency = enableSchedule?.frequencyPerDay;
        setFirstDaySlotsMissed(
          frequency - scheduleTimings.firstDaySlotsStartTime.length
        );
        scheduleTimings.firstDaySlotsStartTime.forEach((schedule) => {
          while (scheduleTimings.firstDaySlotsStartTime.length < frequency) {
            setFirstDaySchedules((prevSchedules) => [
              ...prevSchedules,
              "hh:mm",
            ]);
            frequency--;
          }
          setFirstDaySchedules((prevSchedules) => [...prevSchedules, schedule]);
        });
      }

      setSchedules(scheduleTimings.dayWiseSlotsStartTime || []);

      setFinalDaySchedules(scheduleTimings.remainingDaySlotsStartTime);
    }
  }, [isEdit, enable24HourTimers, enableSchedule]);

  const handleSave = async () => {
    const performSave = await validateSave();
    if (performSave) {
      updateIsSaveDisabled(true);
      const medication = createDrugChartPayload();
      let response;
      if (isEdit) {
        response = await updateMedication(medication);
        handleAuditEvent("EDIT_SCHEDULED_MEDICATION_TASK");
      } else {
        response = await saveMedication(medication);
        handleAuditEvent("CREATE_SCHEDULED_MEDICATION_TASK");
      }
      if (response.status === 200) {
        updateIsSaveDisabled(false);
        hostApi.onModalSave?.();
      }
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
  if (isEdit) {
    sliderTitle = (
      <FormattedMessage
        id={"EDIT_DRUG_CHART_HEADER"}
        defaultMessage={"Edit Drug Chart"}
      />
    );
  } else {
    sliderTitle = title || (
      <FormattedMessage
        id="DRUG_CHART_MODAL_HEADER"
        defaultMessage={"Add to Drug Chart"}
      />
    );
  }
  return (
    <I18nProvider>
      <SideBarPanel title={sliderTitle} closeSideBar={handleClose}>
        <div style={{ padding: "20px", paddingBottom: "120px" }}>
          <DrugDetails hostData={hostData} />
          {!hostData?.drugOrder?.drugOrder?.dosingInstructions?.asNeeded && (
            <>
              <ScheduleSection
                enableSchedule={enableSchedule}
                firstDaySlotsMissed={firstDaySlotsMissed}
                firstDaySchedules={firstDaySchedules}
                schedules={schedules}
                finalDaySchedules={finalDaySchedules}
                handleFirstDaySchedule={handleFirstDaySchedule}
                handleSubsequentDaySchedule={handleSubsequentDaySchedule}
                handleFinalDaySchedule={handleFinalDaySchedule}
                showFirstDayScheduleOrderWarning={
                  showFirstDayScheduleOrderWarning
                }
                showEmptyFirstDayScheduleWarning={
                  showEmptyFirstDayScheduleWarning
                }
                showFirstDaySchedulePassedWarning={
                  showFirstDaySchedulePassedWarning
                }
                showScheduleOrderWarning={showScheduleOrderWarning}
                showEmptyScheduleWarning={showEmptyScheduleWarning}
                showFinalDayScheduleOrderWarning={
                  showFinalDayScheduleOrderWarning
                }
                showEmptyFinalDayScheduleWarning={
                  showEmptyFinalDayScheduleWarning
                }
                showSchedulePassedWarning={showSchedulePassedWarning}
                enable24HourTimers={enable24HourTimers}
              />
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
            </>
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
          isSaveDisabled={isSaveDisabled}
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
