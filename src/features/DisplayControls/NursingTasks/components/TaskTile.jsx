import React from "react";
import PropTypes from "prop-types";
import SVGIcon from "../../../SVGIcon/SVGIcon";
import Clock from "../../../../icons/clock.svg";
import data from "../../../../utils/config.json";

import "../styles/TaskTile.scss";

export default function TaskTile(props) {
  const { medicationNursingTask } = props;
  const newMedicationNursingTask = medicationNursingTask[0];

  let isGroupedTask, taskCount;
  if (medicationNursingTask.length > 1) {
    isGroupedTask = true;
    taskCount = medicationNursingTask.length - 1;
  }

  const {
    drugName,
    dosage,
    doseType,
    drugRoute,
    startTime,
    startTimeInEpochSeconds,
  } = newMedicationNursingTask;

  const { config: { nursingTasks = {} } = {} } = data;

  const getRelevantTaskStatus = () => {
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const relevantTaskStatusWindowInSeconds =
      nursingTasks &&
      nursingTasks.timeInMinutesFromNowToShowTaskAsRelevant * 60;

    return (
      startTimeInEpochSeconds >= currentTimeInSeconds &&
      startTimeInEpochSeconds <=
        currentTimeInSeconds + relevantTaskStatusWindowInSeconds
    );
  };

  const isLateTask = () => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const lateTaskStatusWindowInSeconds =
      nursingTasks.timeInMinutesFromNowToShowPastTaskAsLate * 60;

    return (
      startTimeInEpochSeconds < currentTime - lateTaskStatusWindowInSeconds
    );
  };

  const iconType = isLateTask() ? "Late" : "Pending";
  const isRelevantTask = getRelevantTaskStatus();

  const drugNameText = (
    <div
      className="drug-title"
      style={{ color: isRelevantTask ? "#393939" : "#A9A9A9" }}
    >
      {drugName}
    </div>
  );
  return (
    <div className="tile-parent-container">
      <div
        className="tile"
        style={{
          backgroundColor: isRelevantTask ? "#e3fed1" : "#EDF8E6",
        }}
      >
        <div className="tile-content">
          <div className="tile-title">
            <SVGIcon iconType={iconType} />
            {drugNameText}
          </div>
          <div
            className="tile-content-subtext"
            style={{ color: isRelevantTask ? "#393939" : "#A9A9A9" }}
          >
            <span>{dosage}</span>
            {doseType && <span>&nbsp;-&nbsp;{doseType}</span>}
            <span>&nbsp;-&nbsp;{drugRoute}</span>
          </div>
          <div className="tile-content-subtext">
            <Clock />
            <div>&nbsp;{startTime}</div>
          </div>
          {isGroupedTask && <div className="more-info">({taskCount} more)</div>}
        </div>
      </div>
      {isGroupedTask && (
        <div
          className="tile tile-2"
          style={{
            backgroundColor: isRelevantTask ? "#e3fed1" : "#EDF8E6",
          }}
        ></div>
      )}
    </div>
  );
}
TaskTile.propTypes = {
  medicationNursingTask: PropTypes.array.isRequired,
};
