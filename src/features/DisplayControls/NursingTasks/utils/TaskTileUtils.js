import React from "react";
import {
  asNeededPlaceholderConceptName,
  asNeededMedicationRequestConceptName,
} from "../../../../constants";
import { formatTime } from "../../../../utils/DateTimeUtils";

export const getRelevantTaskStatus = (
  startTimeInEpochSeconds,
  nursingTasks
) => {
  const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
  const relevantTaskStatusWindowInSeconds =
    nursingTasks && nursingTasks.timeInMinutesFromNowToShowTaskAsRelevant * 60;

  return (
    startTimeInEpochSeconds >= currentTimeInSeconds &&
    startTimeInEpochSeconds <=
      currentTimeInSeconds + relevantTaskStatusWindowInSeconds
  );
};

const isLateTask = (startTimeInEpochSeconds, nursingTasks) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const lateTaskStatusWindowInSeconds =
    nursingTasks.timeInMinutesFromNowToShowPastTaskAsLate * 60;

  return startTimeInEpochSeconds < currentTime - lateTaskStatusWindowInSeconds;
};

export const iconType = (task, nursingTasks) => {
  const {
    stopTime,
    administeredTimeInEpochSeconds,
    startTimeInEpochSeconds,
    serviceType,
    taskType,
    status,
  } = task;
  if (serviceType === asNeededPlaceholderConceptName) return "Pending";
  else if (serviceType === asNeededMedicationRequestConceptName) {
    return "Administered";
  }
  if (stopTime) return "Stopped";
  if (status === "Not Done" || status === "missed") return "Not-Administered";
  if (
    administeredTimeInEpochSeconds ||
    (status === "COMPLETED" && taskType.display)
  ) {
    const administeredLateWindowInSeconds =
      startTimeInEpochSeconds +
      nursingTasks.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate * 60;
    const administeredTimeInSeconds = administeredTimeInEpochSeconds / 1000;
    const isLate = administeredTimeInSeconds > administeredLateWindowInSeconds;

    return isLate ? "Administered-Late" : "Administered";
  }

  return isLateTask(startTimeInEpochSeconds, nursingTasks) ? "Late" : "Pending";
};

export const getTime = (
  administeredTimeInEpochMilliSeconds,
  startTime,
  inputFormat,
  outputFormat
) => {
  if (administeredTimeInEpochMilliSeconds) {
    const administeredTime = new Date(
      administeredTimeInEpochMilliSeconds
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });

    return (
      formatTime(startTime, inputFormat, outputFormat) +
      " - " +
      formatTime(administeredTime, inputFormat, outputFormat) +
      " (actual)"
    );
  }
  return formatTime(startTime, inputFormat, outputFormat);
};

export const getMedicationDetails = (medication) => {
  return (
    <div>
      <span>{medication.dosage}</span>
      {medication.doseType && <span>&nbsp;-&nbsp;{medication.doseType}</span>}
      <span>&nbsp;-&nbsp;{medication.route}</span>
    </div>
  );
};
