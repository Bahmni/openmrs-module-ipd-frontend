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
  regenerateByFrequencyInterval,
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

// Dose bucket constants
const DOSE_BUCKETS = {
  FIRST_DAY: "FIRST_DAY",
  DAY_WISE: "DAY_WISE",
};

// Warning type constants
const WARNING_TYPES = {
  PASSED: "passed",
  EMPTY: "empty",
};

// Helper functions for crossing slot metadata
const getOriginDoseBucket = (slot) =>
  slot?.originDoseBucket ?? slot?.sourceBucket;
const getIsRecurringAcrossDays = (slot) =>
  slot?.isRecurringAcrossDays ?? slot?.recurring;

const DrugChartSlider = (props) => {
  const intl = useIntl();
  const { title, hostData, hostApi, setDrugChartNotes, drugChartNotes } = props;
  const { config, handleAuditEvent } = useContext(IPDContext);
  const { drugChartSlider = {} } = config;
  const timeWindowToDisableSlots =
    drugChartSlider.timeInMinutesToDisableSlotPostScheduledTime;

  const intradayDose = hostData?.drugOrder?.intradayDose;
  const intradayDosesPerDay = intradayDose
    ? Object.values(intradayDose).filter((v) => v != null && v !== 0).length
    : null;

  const enableSchedule = hostData?.drugOrder?.drugOrder?.duration
    ? intradayDose && intradayDosesPerDay
      ? hostData?.scheduleFrequencies?.find(
          (f) => f.frequencyPerDay === intradayDosesPerDay
        ) || null
      : hostData?.drugOrder?.uniformDosingType?.frequency
      ? hostData?.scheduleFrequencies?.find(
          (frequency) =>
            frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
        )
      : null
    : null;

  const enableStartTime =
    !intradayDose &&
    (hostData?.startTimeFrequencies?.includes(
      hostData?.drugOrder?.uniformDosingType?.frequency
    ) ||
      !hostData?.drugOrder?.uniformDosingType?.frequency ||
      !hostData?.drugOrder?.drugOrder?.duration);
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

  const [subsequentDaySchedules, setSubsequentDaySchedules] = useState([]);
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

  // Midnight crossing slot flags: boolean arrays tracking which slots cross from one day to next (crossing = true).
  // Used to visually highlight slots that span midnight boundaries in the UI.
  const [
    subsequentDayMidnightCrossingSlots,
    setSubsequentDayMidnightCrossingSlots,
  ] = useState([]);
  const [firstDayMidnightCrossingSlots, setFirstDayMidnightCrossingSlots] =
    useState([]);
  const [finalDayMidnightCrossingSlots, setFinalDayMidnightCrossingSlots] =
    useState([]);

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
    setSubsequentDaySchedules(shifted);
    if (firstDaySlotsMissed > 0) {
      setFinalDaySchedules(shifted.slice(0, firstDaySlotsMissed));
      const finalDayCrossings = detectNextDayCrossings(
        enableSchedule.scheduleTiming.slice(0, firstDaySlotsMissed),
        offsetMinutes,
        enable24HourTimers
      );
      setFinalDayMidnightCrossingSlots(finalDayCrossings);
    }
    const crossings = detectNextDayCrossings(
      enableSchedule.scheduleTiming,
      offsetMinutes,
      enable24HourTimers
    );
    setSubsequentDayMidnightCrossingSlots(crossings);
  };

  const applyRegeneratedSchedules = (
    regenerated,
    shouldUpdateSubsequent = false,
    shouldUpdateFirstDay = true
  ) => {
    // Update first day only if explicitly requested
    if (shouldUpdateFirstDay) {
      setFirstDaySchedules((prev) => {
        const updated = [...prev];
        regenerated.firstDaySchedules.forEach((value, valueIndex) => {
          updated[firstDaySlotsMissed + valueIndex] = value;
        });
        return updated;
      });

      setFirstDayMidnightCrossingSlots(
        Array(firstDaySlotsMissed)
          .fill(false)
          .concat(regenerated.firstDayCrossings)
      );
    }

    // Update subsequent and final days if requested
    if (shouldUpdateSubsequent) {
      setSubsequentDaySchedules(regenerated.subsequentSchedules);
      setSubsequentDayMidnightCrossingSlots(regenerated.subsequentCrossings);
      setFinalDaySchedules(regenerated.finalDaySchedules);
      setFinalDayMidnightCrossingSlots(regenerated.finalDayCrossings);
    }
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

      const autoFilledFirstSlotStr =
        autoFilledFirstEditableSlotRef.current !== null
          ? enable24HourTimers
            ? autoFilledFirstEditableSlotRef.current.format("HH:mm")
            : autoFilledFirstEditableSlotRef.current.format(timeFormatFor12Hr)
          : null;
      const isUntouchedAutoFilledFirstSlot =
        autoFilledFirstSlotStr !== null && timeStr === autoFilledFirstSlotStr;

      const firstDoseForRegeneration = isUntouchedAutoFilledFirstSlot
        ? enableSchedule.scheduleTiming[firstDaySlotsMissed]
        : timeStr;
      const isValid = enable24HourTimers
        ? moment(timeStr, "HH:mm", true).isValid()
        : moment(timeStr, timeFormatFor12Hr, true).isValid();
      if (isValid) {
        const editableCount = firstDaySchedules.length - firstDaySlotsMissed;
        let usedFixedIntervalRegeneration = false;
        const regenerated = regenerateByFrequencyInterval({
          firstDose: firstDoseForRegeneration,
          frequencyPerDay: enableSchedule?.frequencyPerDay,
          firstDayEditableCount: editableCount,
          subsequentCount: subsequentDaySchedules.length,
          remainderCount: finalDaySchedules.length,
          enable24HourTimers,
        });

        if (regenerated) {
          usedFixedIntervalRegeneration = true;
          applyRegeneratedSchedules(regenerated, checked, false);
          if (editableCount === 1 && isUntouchedAutoFilledFirstSlot) {
            setFirstDaySchedules((prev) => {
              const updated = [...prev];
              updated[firstDaySlotsMissed] = currentFirstSlot;
              return updated;
            });
          }
        } else {
          propagateToSubsequentDays(timeStr);
        }
        if (!usedFixedIntervalRegeneration && editableCount > 1) {
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
      setSubsequentDaySchedules(scheduleTimings);
      if (firstDaySlotsMissed > 0) {
        setFinalDaySchedules(scheduleTimings.slice(0, firstDaySlotsMissed));
        setFinalDayMidnightCrossingSlots(
          Array(firstDaySlotsMissed).fill(false)
        );
      }
      setSubsequentDayMidnightCrossingSlots(
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

        const regenerated = regenerateByFrequencyInterval({
          firstDose: newSchedule,
          frequencyPerDay: enableSchedule?.frequencyPerDay,
          firstDayEditableCount: editableCount,
          subsequentCount: subsequentDaySchedules.length,
          remainderCount: finalDaySchedules.length,
          enable24HourTimers,
        });

        if (regenerated) {
          applyRegeneratedSchedules(regenerated, applyToAllDays, true);
          setIsToggleEnabled(true);
          return;
        }

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
          firstDayMidnightCrossingSlots.slice(firstDaySlotsMissed + 1)
        );
        const fullWarnings = Array(firstDaySlotsMissed)
          .fill(false)
          .concat([false, ...editableWarnings]);
        setFirstDayMidnightCrossingSlots(fullWarnings);

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
    setFirstDayMidnightCrossingSlots((prev) => {
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
      subsequentDaySchedules.length > 1 &&
      !isInvalidTimeTextPresent(enable24HourTimers) &&
      newSchedule !== ""
    ) {
      const firstDoseOriginal = subsequentDaySchedules[0];
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
        if (!applyToAllDays) {
          const regenerated = regenerateByFrequencyInterval({
            firstDose: newSchedule,
            frequencyPerDay: enableSchedule?.frequencyPerDay,
            firstDayEditableCount: 0,
            subsequentCount: subsequentDaySchedules.length,
            remainderCount: 0,
            enable24HourTimers,
          });

          if (regenerated) {
            const regeneratedSubsequent = regenerated.subsequentSchedules;
            setSubsequentDaySchedules(regeneratedSubsequent);
            setSubsequentDayMidnightCrossingSlots(
              regenerated.subsequentCrossings
            );

            setShowSchedulePassedWarning((prev) => {
              const updated = [...prev];
              regeneratedSubsequent.forEach((val, i) => {
                if (regenerated.subsequentCrossings[i]) {
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
            return;
          }
        }

        const shifted = computeShiftedSchedules(
          subsequentDaySchedules,
          firstDoseOriginal,
          newSchedule,
          enable24HourTimers
        );
        setSubsequentDaySchedules(shifted);

        const offsetMinutes = computeOffsetMinutes(
          firstDoseOriginal,
          newSchedule,
          enable24HourTimers
        );
        const warnings = detectNextDayCrossings(
          subsequentDaySchedules.slice(1),
          offsetMinutes,
          enable24HourTimers,
          subsequentDayMidnightCrossingSlots.slice(1)
        );
        setSubsequentDayMidnightCrossingSlots([false, ...warnings]);

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
            finalDayMidnightCrossingSlots
          );
          setFinalDayMidnightCrossingSlots(finalDayCrossings);
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
    const newScheduleArray = [...subsequentDaySchedules];
    newScheduleArray[index] = enable24HourTimers
      ? newSchedule
      : moment(newSchedule, timeFormatFor12Hr);
    setSubsequentDaySchedules(newScheduleArray);
    const prevScheduleSlot =
      index > 0 ? subsequentDaySchedules[index - 1] : null;
    const isManualNextDay =
      prevScheduleSlot !== null &&
      isNextDayCrossing(newSchedule, prevScheduleSlot, enable24HourTimers);
    setSubsequentDayMidnightCrossingSlots((prev) => {
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
          finalDayMidnightCrossingSlots.slice(1)
        );
        setFinalDayMidnightCrossingSlots([false, ...warnings]);
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
    setFinalDayMidnightCrossingSlots((prev) => {
      const updated = [...prev];
      updated[index] = isManualNextDay;
      return updated;
    });
  };

  const handleScheduleWarnings = async () => {
    const { isValid, warningType } = await validateSchedules(
      subsequentDaySchedules,
      timeFormat,
      subsequentDayMidnightCrossingSlots
    );
    setShowEmptyScheduleWarning(!isValid && warningType === "empty");
    // Suppress order warning when crossing slots exist (intentionally out of order)
    setShowScheduleOrderWarning(
      !isValid &&
        warningType === WARNING_TYPES.PASSED &&
        !subsequentDayMidnightCrossingSlots.some(Boolean)
    );
    return { isValid, warningType };
  };

  const isValidSchedule = async () => {
    const { isValid, warningType } = await handleScheduleWarnings();
    if (!isValid && warningType === "empty") return false;
    if (
      !isValid &&
      warningType === WARNING_TYPES.PASSED &&
      !subsequentDayMidnightCrossingSlots.some(Boolean)
    )
      return false;
    return true;
  };

  const handleFirstDayScheduleWarnings = async () => {
    // Validate only real first-day slots so crossing flags line up with the filtered list.
    const filteredSchedules = firstDaySchedules.filter(
      (firstDaySchedule) => firstDaySchedule !== UNSET_SCHEDULE_TIME
    );
    const filteredNextDayFlags = firstDaySchedules.reduce(
      (filteredWarningFlags, scheduleTime, scheduleIndex) =>
        scheduleTime !== UNSET_SCHEDULE_TIME
          ? [
              ...filteredWarningFlags,
              firstDayMidnightCrossingSlots[scheduleIndex] || false,
            ]
          : filteredWarningFlags,
      []
    );
    const { isValid, warningType } = await validateSchedules(
      filteredSchedules,
      timeFormat,
      filteredNextDayFlags
    );
    setShowEmptyFirstDayScheduleWarning(!isValid && warningType === "empty");
    // Suppress order warning when crossing slots exist (intentionally out of order)
    setShowFirstDayScheduleOrderWarning(
      !isValid &&
        warningType === "passed" &&
        !firstDayMidnightCrossingSlots.some(Boolean)
    );
    return { isValid, warningType };
  };

  const isValidFirstDaySchedule = async () => {
    const { isValid, warningType } = await handleFirstDayScheduleWarnings();
    if (!isValid && warningType === "empty") return false;
    return !(
      !isValid &&
      warningType === "passed" &&
      !firstDayMidnightCrossingSlots.some(Boolean)
    );
  };

  const handleFinalDayScheduleWarnings = async () => {
    const { isValid, warningType } = await validateSchedules(
      finalDaySchedules,
      timeFormat,
      finalDayMidnightCrossingSlots
    );
    setShowEmptyFinalDayScheduleWarning(!isValid && warningType === "empty");
    // Suppress order warning when crossing slots exist (intentionally out of order)
    setShowFinalDayScheduleOrderWarning(
      !isValid &&
        warningType === "passed" &&
        !finalDayMidnightCrossingSlots.some(Boolean)
    );
    return { isValid, warningType };
  };

  const isValidFinalDaySchedule = async () => {
    const { isValid, warningType } = await handleFinalDayScheduleWarnings();
    if (!isValid && warningType === "empty") return false;
    if (
      !isValid &&
      warningType === "passed" &&
      !finalDayMidnightCrossingSlots.some(Boolean)
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
      payload.crossingSlots = [];
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
        // Remaining-day slots position depends on whether first day is complete or partial:
        // - Complete first day (firstDaySlotsMissed = 0): remaining day is last day (duration - 1)
        // - Partial first day (firstDaySlotsMissed > 0): remaining day is one day after (duration)
        const duration = hostData?.drugOrder?.drugOrder?.duration;
        const finalScheduleDate =
          nextScheduleDate *
          (firstDaySlotsMissed > 0 ? duration : Math.max(0, duration - 1));

        // Split first-day slots into normal and midnight-crossing epochs before building the payload.
        const firstDaySchedulesUTCTimeEpoch = firstDaySchedules.reduce(
          (result, schedule, i) => {
            if (schedule !== UNSET_SCHEDULE_TIME) {
              if (!firstDayMidnightCrossingSlots[i]) {
                const epoch = getUTCTimeEpoch(
                  schedule,
                  enable24HourTimers,
                  hostData?.drugOrder?.drugOrder?.scheduledDate
                );
                result.push(epoch);
              }
            }
            return result;
          },
          []
        );

        const hasDayWiseOffset = firstDaySchedules.some(
          (schedule) => schedule == UNSET_SCHEDULE_TIME
        );

        const getDayWiseEpoch = (epoch, isCrossing) => {
          if (hasDayWiseOffset) return epoch + nextScheduleDate;
          return isCrossing ? epoch + nextScheduleDate : epoch;
        };

        const firstDayCrossingEpochs = firstDaySchedules.reduce(
          (result, schedule, i) => {
            if (
              schedule !== UNSET_SCHEDULE_TIME &&
              firstDayMidnightCrossingSlots[i]
            ) {
              const epoch = getUTCTimeEpoch(
                schedule,
                enable24HourTimers,
                hostData?.drugOrder?.drugOrder?.scheduledDate
              );
              result.push(getDayWiseEpoch(epoch, true));
            }
            return result;
          },
          []
        );

        const dayWiseScheduleEpochs = (subsequentDaySchedules || []).reduce(
          (result, schedule, i) => {
            if (schedule !== UNSET_SCHEDULE_TIME) {
              const isCrossing = !!subsequentDayMidnightCrossingSlots[i];
              const epoch = getUTCTimeEpoch(
                schedule,
                enable24HourTimers,
                hostData?.drugOrder?.drugOrder?.scheduledDate
              );
              result.push({
                epoch: getDayWiseEpoch(epoch, isCrossing),
                isCrossing,
              });
            }
            return result;
          },
          []
        );

        const dayWiseRegularEpochs = dayWiseScheduleEpochs
          .filter((slot) => !slot?.isCrossing)
          .map((slot) => slot.epoch);

        const crossingSlots = [
          ...firstDayCrossingEpochs.map((epoch) => ({
            epoch,
            isRecurringAcrossDays: applyToAllDays, // FIRST_DAY: toggle controls recurrence
            originDoseBucket: DOSE_BUCKETS.FIRST_DAY,
          })),
        ];

        const hasFirstDayCrossing = firstDayCrossingEpochs.length > 0;

        const finalDaySchedulesUTCTimeEpoch = finalDaySchedules?.map(
          (schedule) =>
            getUTCTimeEpoch(
              schedule,
              enable24HourTimers,
              hostData?.drugOrder?.drugOrder?.scheduledDate
            )
        );

        const remainingDaySlotsStartTime = finalDaySchedulesUTCTimeEpoch?.map(
          (scheduleEpoch) => scheduleEpoch + finalScheduleDate
        );

        // Use the earliest normal day-wise slot and the earliest remaining-day slot as span anchors.
        const dayWiseStartEpoch =
          dayWiseRegularEpochs.length > 0
            ? Math.min(...dayWiseRegularEpochs)
            : null;
        const remainingStartEpoch =
          (remainingDaySlotsStartTime || []).length > 0
            ? Math.min(...remainingDaySlotsStartTime)
            : null;
        const dayWiseToRemainingOffsetDays =
          dayWiseStartEpoch != null && remainingStartEpoch != null
            ? Math.max(
                1,
                moment
                  .unix(remainingStartEpoch)
                  .startOf("day")
                  .diff(moment.unix(dayWiseStartEpoch).startOf("day"), "days")
              )
            : 1;

        // Build day-wise crossing slots from the next-day buckets.
        // Always detect crossing slots; use toggle to control recurrence (same-day automation).
        (subsequentDaySchedules || []).forEach((schedule, i) => {
          if (
            schedule !== UNSET_SCHEDULE_TIME &&
            subsequentDayMidnightCrossingSlots[i]
          ) {
            const epoch = getUTCTimeEpoch(
              schedule,
              enable24HourTimers,
              hostData?.drugOrder?.drugOrder?.scheduledDate
            );
            const dayWiseCrossingEpoch = getDayWiseEpoch(epoch, true);

            let recurringDayWiseEpoch =
              !hasFirstDayCrossing &&
              dayWiseCrossingEpoch <=
                (Math.min(...dayWiseRegularEpochs) || Number.MAX_SAFE_INTEGER)
                ? dayWiseCrossingEpoch + nextScheduleDate
                : dayWiseCrossingEpoch;

            const isDuplicateWithFirstDay =
              firstDayCrossingEpochs.includes(dayWiseCrossingEpoch);
            if (isDuplicateWithFirstDay) {
              recurringDayWiseEpoch = dayWiseCrossingEpoch + nextScheduleDate;
            }

            const recurrenceDurationDays =
              remainingStartEpoch != null
                ? Math.max(
                    1,
                    moment
                      .unix(remainingStartEpoch)
                      .startOf("day")
                      .diff(
                        moment.unix(recurringDayWiseEpoch).startOf("day"),
                        "days"
                      ) + 1
                  )
                : Math.max(1, dayWiseToRemainingOffsetDays);

            for (
              let dayOffset = 0;
              dayOffset < recurrenceDurationDays;
              dayOffset++
            ) {
              crossingSlots.push({
                epoch: recurringDayWiseEpoch + dayOffset * nextScheduleDate,
                isRecurringAcrossDays: true, // DAY_WISE: always recurring (dayWise array itself is recurring)
                originDoseBucket: DOSE_BUCKETS.DAY_WISE,
              });
            }
          }
        });

        // If editing with apply-to-all-days, drop duplicate crossing slots and keep recurrence flags aligned.
        if (isEdit && applyToAllDays) {
          const firstDayCrossingEpochsForEdit = crossingSlots
            .filter(
              (slot) => getOriginDoseBucket(slot) === DOSE_BUCKETS.FIRST_DAY
            )
            .map((slot) => slot.epoch)
            .filter((epoch) => epoch != null);

          const firstDayCrossingDaySet = new Set(
            firstDayCrossingEpochsForEdit.map((epoch) =>
              moment.unix(epoch).startOf("day").unix()
            )
          );

          const normalizedCrossingSlots = crossingSlots.filter((slot) => {
            if (
              getOriginDoseBucket(slot) !== DOSE_BUCKETS.DAY_WISE ||
              slot?.epoch == null
            ) {
              return true;
            }

            const crossingDay = moment.unix(slot.epoch).startOf("day").unix();
            return !firstDayCrossingDaySet.has(crossingDay);
          });

          const dayWiseCrossingEpochSet = new Set(
            normalizedCrossingSlots
              .filter(
                (slot) => getOriginDoseBucket(slot) === DOSE_BUCKETS.DAY_WISE
              )
              .map((slot) => slot.epoch)
          );

          normalizedCrossingSlots.forEach((slot) => {
            if (
              getOriginDoseBucket(slot) !== DOSE_BUCKETS.FIRST_DAY ||
              slot?.epoch == null
            )
              return;
            slot.isRecurringAcrossDays = dayWiseCrossingEpochSet.has(
              slot.epoch + nextScheduleDate
            );
          });

          crossingSlots.length = 0;
          crossingSlots.push(...normalizedCrossingSlots);
        }

        // De-duplicate crossing slots one last time before sending the save payload.
        const uniqueCrossingSlots = [];
        const uniqueCrossingSlotKeys = new Set();
        crossingSlots.forEach((slot) => {
          if (slot?.epoch == null) return;
          const key = `${slot.epoch}-${getOriginDoseBucket(
            slot
          )}-${getIsRecurringAcrossDays(slot)}`;
          if (!uniqueCrossingSlotKeys.has(key)) {
            uniqueCrossingSlotKeys.add(key);
            uniqueCrossingSlots.push(slot);
          }
        });

        payload.firstDaySlotsStartTime =
          firstDaySlotsMissed > 0 ? firstDaySchedulesUTCTimeEpoch : [];
        const crossingEpochSet = new Set(
          uniqueCrossingSlots.map((slot) => slot.epoch)
        );
        payload.dayWiseSlotsStartTime = [
          ...new Set(
            dayWiseRegularEpochs.filter((epoch) => !crossingEpochSet.has(epoch))
          ),
        ];
        payload.remainingDaySlotsStartTime = [
          ...new Set(
            (remainingDaySlotsStartTime || []).filter(
              (epoch) => !crossingEpochSet.has(epoch)
            )
          ),
        ];
        payload.crossingSlots = uniqueCrossingSlots;
        payload.medicationFrequency =
          medicationFrequency.FIXED_SCHEDULE_FREQUENCY;
        payload.isUpdateCompleteSchedule = applyToAllDays;
      }
    }
    if (hostData?.drugOrder?.variableDosageSequence != null) {
      payload.variableDosageSequence =
        hostData.drugOrder.variableDosageSequence;
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
            setSubsequentDaySchedules((prevSchedules) => [
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
            setSubsequentDaySchedules((prevSchedules) => [
              ...prevSchedules,
              upcomingSchedule,
            ]);
          }
        }
      } else {
        setSubsequentDaySchedules(scheduleTimings || []);
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
      setSubsequentDaySchedules(defaultSchedules);
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
      const isVdpStage = hostData?.drugOrder?.variableDosageSequence != null;
      let totalNoOfSlots;
      if (isVdpStage) {
        const stageDurationInDays = hostData?.drugOrder?.drugOrder?.duration;
        totalNoOfSlots = enableSchedule?.frequencyPerDay * stageDurationInDays;
      } else {
        const quantity =
          hostData?.drugOrder?.drugOrder?.dosingInstructions?.quantity;
        const dose = hostData?.drugOrder?.drugOrder?.dosingInstructions?.dose;
        totalNoOfSlots = Math.ceil(quantity / dose);
      }
      if (totalNoOfSlots === enableSchedule?.frequencyPerDay) {
        setSubsequentDaySchedules([]);
      }
    }
  }, [firstDaySlotsMissed, isAutoFill, enable24HourTimers, enableSchedule]);

  useEffect(() => {
    if (isEdit) {
      const drugOrderSchedule = hostData?.drugOrder?.drugOrderSchedule;
      const toDisplayTime = (epoch) =>
        enable24HourTimers
          ? epochTo24HourTimeFormat(epoch)
          : epochTo12HourTimeFormat(epoch);
      const scheduleTimings = enable24HourTimers
        ? setDrugOrderScheduleIn24HourFormat(drugOrderSchedule)
        : setDrugOrderScheduleIn12HourFormat(drugOrderSchedule);

      if (Object.keys(scheduleTimings).length === 0) {
        const startTimeValue = enable24HourTimers
          ? epochTo24HourTimeFormat(drugOrderSchedule.slotStartTime)
          : epochTo12HourTimeFormat(drugOrderSchedule.slotStartTime);
        setStartTime(startTimeValue);
      }
      const frequency = enableSchedule?.frequencyPerDay || 0;
      const firstDayFromApiEpochs = Array.isArray(
        drugOrderSchedule?.firstDaySlotsStartTime
      )
        ? [...drugOrderSchedule.firstDaySlotsStartTime]
        : [];
      const dayWiseFromApiEpochs = Array.isArray(
        drugOrderSchedule?.dayWiseSlotsStartTime
      )
        ? [...drugOrderSchedule.dayWiseSlotsStartTime]
        : [];
      const remainingFromApiEpochs = Array.isArray(
        drugOrderSchedule?.remainingDaySlotsStartTime
      )
        ? [...drugOrderSchedule.remainingDaySlotsStartTime]
        : [];
      const crossingSlotsFromApi =
        drugOrderSchedule?.crossingSlots &&
        Array.isArray(drugOrderSchedule.crossingSlots)
          ? drugOrderSchedule.crossingSlots
          : [];

      // Use explicit toggle flag if available, otherwise infer from crossing slots (backward compatibility).
      if (drugOrderSchedule?.isUpdateCompleteSchedule != null) {
        setApplyToAllDays(drugOrderSchedule.isUpdateCompleteSchedule);
      } else {
        // Fallback: check FIRST_DAY crossings for backward compatibility.
        // DAY_WISE crossings are always recurring by design, so they shouldn't influence toggle state.
        const hasRecurringFirstDayCrossings = crossingSlotsFromApi.some(
          (slot) =>
            getOriginDoseBucket(slot) === DOSE_BUCKETS.FIRST_DAY &&
            getIsRecurringAcrossDays(slot) === true
        );
        setApplyToAllDays(hasRecurringFirstDayCrossings);
      }

      const firstDayCrossingsFromApi = crossingSlotsFromApi
        .filter((slot) => getOriginDoseBucket(slot) === DOSE_BUCKETS.FIRST_DAY)
        .map((slot) => slot.epoch);

      const dayWiseCrossingsFromApi = crossingSlotsFromApi
        .filter((slot) => getOriginDoseBucket(slot) === DOSE_BUCKETS.DAY_WISE)
        .map((slot) => slot.epoch);

      const firstDayCrossingTimeSet = new Set(
        firstDayCrossingsFromApi.filter((epoch) => epoch != null)
      );
      const dayWiseCrossingTimeSet = new Set(
        dayWiseCrossingsFromApi.filter((epoch) => epoch != null)
      );
      const allCrossingTimeSet = new Set([
        ...firstDayCrossingTimeSet,
        ...dayWiseCrossingTimeSet,
      ]);

      const recurringDayWiseCrossingsFromApi = crossingSlotsFromApi.filter(
        (slot) =>
          getOriginDoseBucket(slot) === DOSE_BUCKETS.DAY_WISE &&
          getIsRecurringAcrossDays(slot) === true &&
          slot?.epoch != null
      );

      // Rebuild the first-day view from saved API slots and keep crossing slots out of the normal list.
      const firstDayDisplayEpochs = [
        ...firstDayFromApiEpochs,
        ...firstDayCrossingsFromApi.filter(
          (epoch) => !firstDayFromApiEpochs.includes(epoch)
        ),
      ];
      const firstDayDisplaySlots = firstDayDisplayEpochs.map(toDisplayTime);
      const firstDaySlotsMissedCount = Math.max(
        0,
        frequency - firstDayDisplaySlots.length
      );
      setFirstDaySlotsMissed(firstDaySlotsMissedCount);
      // Recreate the editable first-day array with placeholders before the visible times.
      setFirstDaySchedules([
        ...Array.from(
          { length: firstDaySlotsMissedCount },
          () => UNSET_SCHEDULE_TIME
        ),
        ...firstDayDisplaySlots,
      ]);

      // Keep the toggle enabled only when the first editable slot has a valid time.
      const firstDaySchedulesForDisplay = [
        ...Array.from(
          { length: firstDaySlotsMissedCount },
          () => UNSET_SCHEDULE_TIME
        ),
        ...firstDayDisplaySlots,
      ];
      const firstEditableSchedule =
        firstDaySchedulesForDisplay[firstDaySlotsMissedCount];
      const isFirstEditableScheduleValid =
        firstEditableSchedule != null &&
        firstEditableSchedule !== UNSET_SCHEDULE_TIME &&
        (enable24HourTimers
          ? moment(firstEditableSchedule, "HH:mm", true).isValid()
          : moment.isMoment(firstEditableSchedule)
          ? firstEditableSchedule.isValid()
          : moment(firstEditableSchedule, timeFormatFor12Hr, true).isValid());
      setIsToggleEnabled(isFirstEditableScheduleValid);
      // Mark which first-day entries are midnight crossings so validation and save stay aligned.
      const firstDayFlags = [
        ...Array.from({ length: firstDaySlotsMissedCount }, () => false),
        ...firstDayDisplayEpochs.map((epoch) =>
          firstDayCrossingTimeSet.has(epoch)
        ),
      ];
      setFirstDayMidnightCrossingSlots(firstDayFlags);

      // Split day-wise and remaining-day slots into normal slots and crossing slots.
      const dayWiseSlotsForDisplayEpochs = [
        ...dayWiseFromApiEpochs.filter(
          (epoch) => !firstDayCrossingTimeSet.has(epoch)
        ),
        ...dayWiseCrossingsFromApi.filter(
          (epoch) =>
            epoch != null &&
            !dayWiseFromApiEpochs.includes(epoch) &&
            !firstDayCrossingTimeSet.has(epoch)
        ),
      ].sort((a, b) => a - b);
      const dayWiseSlotsForDisplay =
        dayWiseSlotsForDisplayEpochs.map(toDisplayTime);
      setSubsequentDaySchedules(dayWiseSlotsForDisplay);

      // Remove any epochs already accounted for as crossings from the final-day view.
      const remainingSlotsEpochs = remainingFromApiEpochs.filter(
        (epoch) => !allCrossingTimeSet.has(epoch)
      );
      const remainingSlots = remainingSlotsEpochs.map(toDisplayTime);
      setFinalDaySchedules(remainingSlots);

      // Highlight recurring day-wise crossings across all applicable days.
      const dayWiseAndRemainingEpochs = [
        ...dayWiseSlotsForDisplayEpochs,
        ...remainingSlotsEpochs,
      ];
      const recurringDayWiseHighlightEpochs = new Set();

      recurringDayWiseCrossingsFromApi.forEach((slot) => {
        const slotTime = moment(slot.epoch * 1000).format("HH:mm");
        dayWiseAndRemainingEpochs.forEach((epoch) => {
          if (
            epoch >= slot.epoch &&
            moment(epoch * 1000).format("HH:mm") === slotTime
          ) {
            recurringDayWiseHighlightEpochs.add(epoch);
          }
        });
      });

      const nextDayFlags = dayWiseSlotsForDisplayEpochs.map(
        (epoch) =>
          dayWiseCrossingTimeSet.has(epoch) ||
          recurringDayWiseHighlightEpochs.has(epoch)
      );
      setSubsequentDayMidnightCrossingSlots(nextDayFlags);

      const remainingFlags = remainingSlotsEpochs.map(
        (epoch) =>
          dayWiseCrossingTimeSet.has(epoch) ||
          recurringDayWiseHighlightEpochs.has(epoch)
      );
      setFinalDayMidnightCrossingSlots(remainingFlags);
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
          <DrugDetails
            hostData={hostData}
            intradayFrequencyName={enableSchedule?.name}
          />
          {!hostData?.drugOrder?.drugOrder?.dosingInstructions?.asNeeded && (
            <>
              <ScheduleSection
                enableSchedule={enableSchedule}
                firstDaySlotsMissed={firstDaySlotsMissed}
                firstDaySchedules={firstDaySchedules}
                subsequentDaySchedules={subsequentDaySchedules}
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
                subsequentDayMidnightCrossingSlots={
                  subsequentDayMidnightCrossingSlots
                }
                firstDayMidnightCrossingSlots={firstDayMidnightCrossingSlots}
                finalDayMidnightCrossingSlots={finalDayMidnightCrossingSlots}
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
