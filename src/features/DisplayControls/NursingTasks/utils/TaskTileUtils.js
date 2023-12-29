import data from "../../../../utils/config.json";
import React from "react";

const { config: { nursingTasks = {} } = {} } = data;

export const getRelevantTaskStatus = (startTimeInEpochSeconds) => {
  const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
  const relevantTaskStatusWindowInSeconds =
    nursingTasks && nursingTasks.timeInMinutesFromNowToShowTaskAsRelevant * 60;

  return (
    startTimeInEpochSeconds >= currentTimeInSeconds &&
    startTimeInEpochSeconds <=
      currentTimeInSeconds + relevantTaskStatusWindowInSeconds
  );
};

const isLateTask = (startTimeInEpochSeconds) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const lateTaskStatusWindowInSeconds =
    nursingTasks.timeInMinutesFromNowToShowPastTaskAsLate * 60;

  return startTimeInEpochSeconds < currentTime - lateTaskStatusWindowInSeconds;
};

export const iconType = (task) => {
  const {
    stopTime,
    administeredTimeInEpochSeconds,
    startTimeInEpochSeconds,
    status,
  } = task;
  console.log("task", task);
  if (stopTime) return "Stopped";
  if (status === "Not Done") return "Not-Administered";
  if (administeredTimeInEpochSeconds) {
    const administeredLateWindowInSeconds =
      startTimeInEpochSeconds +
      nursingTasks.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate * 60;
    const administeredTimeInSeconds = administeredTimeInEpochSeconds / 1000;
    const isLate = administeredTimeInSeconds > administeredLateWindowInSeconds;

    return isLate ? "Administered-Late" : "Administered";
  }

  return isLateTask(startTimeInEpochSeconds) ? "Late" : "Pending";
};

export const getTime = (administeredTimeInEpochmilliSeconds, startTime) => {
  if (administeredTimeInEpochmilliSeconds) {
    const administeredTimeInSeconds =
      administeredTimeInEpochmilliSeconds / 1000;
    const administeredTime = new Date(
      administeredTimeInSeconds * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return startTime + " - " + administeredTime + " (actual)";
  }
  return startTime;
};

export const getMedicationDetails = (medication) => {
  return (
    <div>
      <span>{medication.dosage}</span>
      {medication.doseType && <span>&nbsp;-&nbsp;{medication.doseType}</span>}
      <span>&nbsp;-&nbsp;{medication.drugRoute}</span>
    </div>
  );
};
