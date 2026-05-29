import React, { useContext, useEffect, useRef, useState } from "react";
import { TextArea } from "carbon-components-react";
import moment from "moment";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
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
  computeShiftedSchedules,
  detectNextDayCrossings,
  isNextDayCrossing,
  computeShiftedScheduleTimings,
  computeOffsetMinutes,
} from "../utils/DrugChartSliderUtils";
import {
  epochTo24HourTimeFormat,
  epochTo12HourTimeFormat,
} from "../../../utils/DateTimeUtils";
import { DrugDetails } from "./DrugDetails";
import { DrugInstructions } from "./DrugInstructions";
import { StartTimeSection } from "./StartTimeSection";
import { ScheduleSection } from "./ScheduleSection";

const UNSET_SCHEDULE_TIME = "hh:mm";

const DrugChartSlider = (props) => {
  const intl = useIntl();
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
  const isLoadingDose = (() => {
    try {
      return JSON.parse(
        hostData?.drugOrder?.drugOrder?.dosingInstructions
          ?.administrationInstructions
      )?.isLoadingDose;
    } catch {
      return false;
    }
  })();
  const enableStartTime =
    isLoadingDose ||
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
  const [applyToAllDays, setApplyToAllDays] = useState(false);
  const [isToggleEnabled, setIsToggleEnabled] = useState(false);

  // Stores the auto-filled moment for the first editable slot so that
  // subsequent-day propagation uses the same reference as the day-1 cascade,
  // preventing minute-level drift between the auto-filled day-1 slot and propagated subsequent-day slots.
  const autoFilledFirstEditableSlotRef = useRef(null);

  const [
    showSubsequentDayScheduleNextDayWarning,
    setShowSubsequentDayScheduleNextDayWarning,
  ] = useState([]);
  const [
    showFirstDayScheduleNextDayWarning,
    setShowFirstDayScheduleNextDayWarning,
  ] = useState([]);
  const [
    showFinalDayScheduleNextDayWarning,
    setShowFinalDayScheduleNextDayWarning,
  ] = useState([]);

  const propagateToSubsequentDays = (newTime) => {
    const base =
      autoFilledFirstEditableSlotRef.current !== null
        ? autoFilledFirstEditableSlotRef.current
        : enableSchedule.scheduleTiming[firstDaySlotsMissed];
    const scheduleM = enable24HourTimers
      ? moment(typeof base === "string" ? base : base.format("HH:mm"), "HH:mm")
      : moment.isMoment(base)
      ? base.clone()
      : moment(base, timeFormatFor12Hr);
    const userM = enable24HourTimers
      ? moment(newTime, "HH:mm")
      : moment(newTime, timeFormatFor12Hr);
    const offsetMinutes = userM.diff(scheduleM, "minutes");
    const shifted = computeShiftedScheduleTimings(
      enableSchedule.scheduleTiming,
      offsetMinutes,
      enable24HourTimers
    );
    setSchedules(shifted);
    if (firstDaySlotsMissed > 0) {
      setFinalDaySchedules(shifted.slice(0, firstDaySlotsMissed));
      const finalDayCrossings = detectNextDayCrossings(
        enableSchedule.scheduleTiming.slice(0, firstDaySlotsMissed),
        offsetMinutes,
        enable24HourTimers
      );
      setShowFinalDayScheduleNextDayWarning(finalDayCrossings);
    }
    const crossings = detectNextDayCrossings(
      enableSchedule.scheduleTiming,
      offsetMinutes,
      enable24HourTimers
    );
    setShowSubsequentDayScheduleNextDayWarning(crossings);
  };

  const handleApplyToAllDaysToggle = (checked) => {
    setApplyToAllDays(checked);
    if (checked) {
      const currentFirstSlot = firstDaySchedules[firstDaySlotsMissed];
      if (
        !currentFirstSlot ||
        currentFirstSlot === UNSET_SCHEDULE_TIME ||
        currentFirstSlot === ""
      )
        return;
      const timeStr = enable24HourTimers
        ? currentFirstSlot
        : moment.isMoment(currentFirstSlot)
        ? currentFirstSlot.format(timeFormatFor12Hr)
        : currentFirstSlot;
      const isValid = enable24HourTimers
        ? moment(timeStr, "HH:mm", true).isValid()
        : moment(timeStr, timeFormatFor12Hr, true).isValid();
      if (isValid) {
        propagateToSubsequentDays(timeStr);
        const editableCount = firstDaySchedules.length - firstDaySlotsMissed;
        if (editableCount > 1) {
          const base =
            autoFilledFirstEditableSlotRef.current !== null
              ? autoFilledFirstEditableSlotRef.current
              : enableSchedule.scheduleTiming[firstDaySlotsMissed];
          const offsetMinutes = computeOffsetMinutes(
            base,
            timeStr,
            enable24HourTimers
          );
          const editableSlice = enableSchedule.scheduleTiming.slice(
            firstDaySlotsMissed + 1
          );
          const shiftedSlice = computeShiftedScheduleTimings(
            editableSlice,
            offsetMinutes,
            enable24HourTimers
          );
          setFirstDaySchedules((prev) => {
            const updated = [...prev];
            shiftedSlice.forEach((val, i) => {
              updated[firstDaySlotsMissed + 1 + i] = val;
            });
            return updated;
          });
        }
      }
    } else {
      const scheduleTimings = enable24HourTimers
        ? enableSchedule.scheduleTiming
        : enableSchedule.scheduleTiming.map((time) =>
            moment(time, timeFormatFor12Hr)
          );
      setSchedules(scheduleTimings);
      if (firstDaySlotsMissed > 0) {
        setFinalDaySchedules(scheduleTimings.slice(0, firstDaySlotsMissed));
        setShowFinalDayScheduleNextDayWarning(
          Array(firstDaySlotsMissed).fill(false)
        );
      }
      setShowSubsequentDayScheduleNextDayWarning(
        Array(enableSchedule.frequencyPerDay).fill(false)
      );
    }
  };

  const handleFirstDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);
    const editableCount = firstDaySchedules.length - firstDaySlotsMissed;

    // Cascade: only when editing first editable slot and original is valid
    if (
      index === firstDaySlotsMissed &&
      editableCount > 1 &&
      !isInvalidTimeTextPresent(enable24HourTimers) &&
      newSchedule !== ""
    ) {
      const firstDoseOriginal = firstDaySchedules[firstDaySlotsMissed];
      const isOriginalValid = enable24HourTimers
        ? typeof firstDoseOriginal === "string" &&
          firstDoseOriginal !== "" &&
          firstDoseOriginal !== UNSET_SCHEDULE_TIME &&
          moment(firstDoseOriginal, "HH:mm", true).isValid()
        : moment.isMoment(firstDoseOriginal)
        ? firstDoseOriginal.isValid()
        : typeof firstDoseOriginal === "string" &&
          firstDoseOriginal !== "" &&
          firstDoseOriginal !== UNSET_SCHEDULE_TIME &&
          moment(firstDoseOriginal, timeFormatFor12Hr, true).isValid();

      if (isOriginalValid) {
        const editablePortion = firstDaySchedules.slice(firstDaySlotsMissed);
        const shiftedEditable = computeShiftedSchedules(
          editablePortion,
          firstDoseOriginal,
          newSchedule,
          enable24HourTimers
        );
        const newScheduleArray = [...firstDaySchedules];
        shiftedEditable.forEach((val, i) => {
          newScheduleArray[firstDaySlotsMissed + i] = val;
        });
        setFirstDaySchedules(newScheduleArray);

        const offsetMinutes = computeOffsetMinutes(
          firstDoseOriginal,
          newSchedule,
          enable24HourTimers
        );
        const editableWarnings = detectNextDayCrossings(
          editablePortion.slice(1),
          offsetMinutes,
          enable24HourTimers,
          showFirstDayScheduleNextDayWarning.slice(firstDaySlotsMissed + 1)
        );
        const fullWarnings = Array(firstDaySlotsMissed)
          .fill(false)
          .concat([false, ...editableWarnings]);
        setShowFirstDayScheduleNextDayWarning(fullWarnings);

        setShowFirstDaySchedulePassedWarning((prev) => {
          const updated = [...prev];
          shiftedEditable.forEach((val, i) => {
            const arrayIndex = firstDaySlotsMissed + i;
            if (fullWarnings[arrayIndex]) {
              updated[arrayIndex] = false;
            } else {
              updated[arrayIndex] = isTimePassed(
                val,
                timeWindowToDisableSlots,
                enable24HourTimers
              );
            }
          });
          return updated;
        });
        setIsToggleEnabled(true);
        if (applyToAllDays) propagateToSubsequentDays(newSchedule);
        return;
      }
    }

    // Non-cascade: update only the triggered index
    const newScheduleArray = [...firstDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, timeFormatFor12Hr);
    setFirstDaySchedules(newScheduleArray);
    const prevFirstDaySlot = index > 0 ? firstDaySchedules[index - 1] : null;
    const isManualNextDay =
      prevFirstDaySlot !== null &&
      prevFirstDaySlot !== UNSET_SCHEDULE_TIME &&
      isNextDayCrossing(newSchedule, prevFirstDaySlot, enable24HourTimers);
    setShowFirstDayScheduleNextDayWarning((prev) => {
      const updated = [...prev];
      updated[index] = isManualNextDay;
      return updated;
    });
    if (!isInvalidTimeTextPresent(enable24HourTimers)) {
      setShowFirstDaySchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isManualNextDay
          ? false
          : isTimePassed(
              newSchedule,
              timeWindowToDisableSlots,
              enable24HourTimers
            );
        return newSchedulePassedWarnings;
      });
    }
    if (index === firstDaySlotsMissed) {
      const isNewScheduleValid = enable24HourTimers
        ? moment(newSchedule, "HH:mm", true).isValid()
        : moment(newSchedule, timeFormatFor12Hr, true).isValid();
      if (isNewScheduleValid) {
        setIsToggleEnabled(true);
        if (applyToAllDays) propagateToSubsequentDays(newSchedule);
      } else {
        setIsToggleEnabled(false);
      }
    }
  };

  const handleSubsequentDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);

    // Cascade: only when editing first dose and original first dose is valid
    if (
      index === 0 &&
      schedules.length > 1 &&
      !isInvalidTimeTextPresent(enable24HourTimers) &&
      newSchedule !== ""
    ) {
      const firstDoseOriginal = schedules[0];
      const isOriginalValid = enable24HourTimers
        ? typeof firstDoseOriginal === "string" &&
          firstDoseOriginal !== "" &&
          moment(firstDoseOriginal, "HH:mm", true).isValid()
        : moment.isMoment(firstDoseOriginal)
        ? firstDoseOriginal.isValid()
        : typeof firstDoseOriginal === "string" &&
          firstDoseOriginal !== "" &&
          moment(firstDoseOriginal, timeFormatFor12Hr, true).isValid();

      if (isOriginalValid) {
        const shifted = computeShiftedSchedules(
          schedules,
          firstDoseOriginal,
          newSchedule,
          enable24HourTimers
        );
        setSchedules(shifted);

        const offsetMinutes = computeOffsetMinutes(
          firstDoseOriginal,
          newSchedule,
          enable24HourTimers
        );
        const warnings = detectNextDayCrossings(
          schedules.slice(1),
          offsetMinutes,
          enable24HourTimers,
          showSubsequentDayScheduleNextDayWarning.slice(1)
        );
        setShowSubsequentDayScheduleNextDayWarning([false, ...warnings]);

        const fullWarnings = [false, ...warnings];
        setShowSchedulePassedWarning((prev) => {
          const updated = [...prev];
          shifted.forEach((val, i) => {
            if (fullWarnings[i]) {
              updated[i] = false;
            } else {
              updated[i] = isTimePassed(
                val,
                timeWindowToDisableSlots,
                enable24HourTimers
              );
            }
          });
          return updated;
        });

        if (applyToAllDays && firstDaySlotsMissed > 0) {
          const finalDayCrossings = detectNextDayCrossings(
            finalDaySchedules,
            offsetMinutes,
            enable24HourTimers,
            showFinalDayScheduleNextDayWarning
          );
          setShowFinalDayScheduleNextDayWarning(finalDayCrossings);
          setFinalDaySchedules((prev) =>
            computeShiftedScheduleTimings(
              prev,
              offsetMinutes,
              enable24HourTimers
            )
          );
        }
        return;
      }
    }

    // Non-cascade: update only the triggered index
    const newScheduleArray = [...schedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, timeFormatFor12Hr);
    setSchedules(newScheduleArray);
    const prevScheduleSlot = index > 0 ? schedules[index - 1] : null;
    const isManualNextDay =
      prevScheduleSlot !== null &&
      isNextDayCrossing(newSchedule, prevScheduleSlot, enable24HourTimers);
    setShowSubsequentDayScheduleNextDayWarning((prev) => {
      const updated = [...prev];
      updated[index] = isManualNextDay;
      return updated;
    });
    if (!isInvalidTimeTextPresent(enable24HourTimers)) {
      setShowSchedulePassedWarning((prevScheduleWarnings) => {
        const newSchedulePassedWarnings = [...prevScheduleWarnings];
        newSchedulePassedWarnings[index] = isManualNextDay
          ? false
          : isTimePassed(
              newSchedule,
              timeWindowToDisableSlots,
              enable24HourTimers
            );
        return newSchedulePassedWarnings;
      });
    }
  };

  const handleFinalDaySchedule = (newSchedule, index) => {
    updateSliderContentModified(true);

    // Cascade: only when editing first slot and original first slot is valid
    if (
      index === 0 &&
      finalDaySchedules.length > 1 &&
      !isInvalidTimeTextPresent(enable24HourTimers) &&
      newSchedule !== ""
    ) {
      const firstDoseOriginal = finalDaySchedules[0];
      const isOriginalValid = enable24HourTimers
        ? typeof firstDoseOriginal === "string" &&
          firstDoseOriginal !== "" &&
          moment(firstDoseOriginal, "HH:mm", true).isValid()
        : moment.isMoment(firstDoseOriginal)
        ? firstDoseOriginal.isValid()
        : typeof firstDoseOriginal === "string" &&
          firstDoseOriginal !== "" &&
          moment(firstDoseOriginal, timeFormatFor12Hr, true).isValid();

      if (isOriginalValid) {
        const shifted = computeShiftedSchedules(
          finalDaySchedules,
          firstDoseOriginal,
          newSchedule,
          enable24HourTimers
        );
        setFinalDaySchedules(shifted);

        const offsetMinutes = computeOffsetMinutes(
          firstDoseOriginal,
          newSchedule,
          enable24HourTimers
        );
        const warnings = detectNextDayCrossings(
          finalDaySchedules.slice(1),
          offsetMinutes,
          enable24HourTimers,
          showFinalDayScheduleNextDayWarning.slice(1)
        );
        setShowFinalDayScheduleNextDayWarning([false, ...warnings]);
        return;
      }
    }

    // Non-cascade: update only the triggered index
    const newScheduleArray = [...finalDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, timeFormatFor12Hr);
    setFinalDaySchedules(newScheduleArray);
    const prevFinalSlot = index > 0 ? finalDaySchedules[index - 1] : null;
    const isManualNextDay =
      prevFinalSlot !== null &&
      isNextDayCrossing(newSchedule, prevFinalSlot, enable24HourTimers);
    setShowFinalDayScheduleNextDayWarning((prev) => {
      const updated = [...prev];
      updated[index] = isManualNextDay;
      return updated;
    });
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
    if (!isValid && warningType === "empty") return false;
    if (
      !isValid &&
      warningType === "passed" &&
      !showSubsequentDayScheduleNextDayWarning.some(Boolean)
    )
      return false;
    return true;
  };

  const handleFirstDayScheduleWarnings = async () => {
    const { isValid, warningType } = await validateSchedules(
      firstDaySchedules.filter(
        (firstDaySchedule) => firstDaySchedule != UNSET_SCHEDULE_TIME
      ),
      timeFormat
    );
    setShowEmptyFirstDayScheduleWarning(!isValid && warningType === "empty");
    setShowFirstDayScheduleOrderWarning(!isValid && warningType === "passed");
    return { isValid, warningType };
  };

  const isValidFirstDaySchedule = async () => {
    const { isValid, warningType } = await handleFirstDayScheduleWarnings();
    if (!isValid && warningType === "empty") return false;
    return !(
      !isValid &&
      warningType === "passed" &&
      !showFirstDayScheduleNextDayWarning.some(Boolean)
    );
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
    if (!isValid && warningType === "empty") return false;
    if (
      !isValid &&
      warningType === "passed" &&
      !showFinalDayScheduleNextDayWarning.some(Boolean)
    )
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
          (result, schedule, i) => {
            if (schedule !== UNSET_SCHEDULE_TIME) {
              const epoch = getUTCTimeEpoch(
                schedule,
                enable24HourTimers,
                hostData?.drugOrder?.drugOrder?.scheduledDate
              );
              result.push(
                showFirstDayScheduleNextDayWarning[i]
                  ? epoch + nextScheduleDate
                  : epoch
              );
            }
            return result;
          },
          []
        );

        const hasDayWiseOffset = firstDaySchedules.some(
          (schedule) => schedule == UNSET_SCHEDULE_TIME
        );
        const schedulesUTCTimeEpoch = schedules?.map((schedule, i) => {
          const epoch = getUTCTimeEpoch(
            schedule,
            enable24HourTimers,
            hostData?.drugOrder?.drugOrder?.scheduledDate
          );
          return !hasDayWiseOffset && showSubsequentDayScheduleNextDayWarning[i]
            ? epoch + nextScheduleDate
            : epoch;
        });

        const finalDaySchedulesUTCTimeEpoch = finalDaySchedules?.map(
          (schedule, i) => {
            const epoch = getUTCTimeEpoch(
              schedule,
              enable24HourTimers,
              hostData?.drugOrder?.drugOrder?.scheduledDate
            );
            return showFinalDayScheduleNextDayWarning[i]
              ? epoch + nextScheduleDate
              : epoch;
          }
        );

        payload.firstDaySlotsStartTime =
          firstDaySlotsMissed > 0 ? firstDaySchedulesUTCTimeEpoch : [];
        payload.dayWiseSlotsStartTime = hasDayWiseOffset
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
    autoFilledFirstEditableSlotRef.current = null;
    if (isAutoFill) {
      const scheduleTimings = enable24HourTimers
        ? enableSchedule?.scheduleTiming
        : enableSchedule?.scheduleTiming.map((time) =>
            moment(time, timeFormatFor12Hr)
          );
      const currentTimeMomentObject = moment().startOf("minute");
      let finalScheduleCount = 0;
      scheduleTimings.forEach((schedule) => {
        if (isTimePassed(schedule, timeWindowToDisableSlots)) {
          setFirstDaySchedules((prevSchedules) => [
            ...prevSchedules,
            UNSET_SCHEDULE_TIME,
          ]);
          finalScheduleCount = finalScheduleCount + 1;
          setFirstDaySlotsMissed((prevSlotNumber) => prevSlotNumber + 1);
        } else if (checkIfTimeSlotIsEnabled(schedule)) {
          if (finalScheduleCount === 0) {
            setSchedules((prevSchedules) => [
              ...prevSchedules,
              currentTimeMomentObject,
            ]);
          } else {
            autoFilledFirstEditableSlotRef.current = currentTimeMomentObject;
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
            () => UNSET_SCHEDULE_TIME
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
              UNSET_SCHEDULE_TIME,
            ]);
            frequency--;
          }
          setFirstDaySchedules((prevSchedules) => [...prevSchedules, schedule]);
        });
      }

      setSchedules(scheduleTimings.dayWiseSlotsStartTime || []);

      if (scheduleTimings.dayWiseSlotsStartTime?.length > 1) {
        const loadedTimes = scheduleTimings.dayWiseSlotsStartTime;
        const nextDayFlags = loadedTimes.map((time, i) => {
          if (i === 0) return false;
          return isNextDayCrossing(
            time,
            loadedTimes[i - 1],
            enable24HourTimers
          );
        });
        setShowSubsequentDayScheduleNextDayWarning(nextDayFlags);
      }

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
                showSubsequentDayScheduleNextDayWarning={
                  showSubsequentDayScheduleNextDayWarning
                }
                showFirstDayScheduleNextDayWarning={
                  showFirstDayScheduleNextDayWarning
                }
                showFinalDayScheduleNextDayWarning={
                  showFinalDayScheduleNextDayWarning
                }
                applyToAllDays={applyToAllDays}
                onApplyToAllDaysToggle={handleApplyToAllDaysToggle}
                isToggleEnabled={isToggleEnabled}
                duration={hostData?.drugOrder?.drugOrder?.duration}
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
              labelText={intl.formatMessage({
                id: "DRUG_CHART_MODAL_NOTES",
                defaultMessage: "Notes",
              })}
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
