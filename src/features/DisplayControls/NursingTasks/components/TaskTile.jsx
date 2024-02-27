import React, { useContext } from "react";
import PropTypes from "prop-types";
import SVGIcon from "../../../SVGIcon/SVGIcon";
import moment from "moment";
import Clock from "../../../../icons/clock.svg";
import {
  getTime,
  getRelevantTaskStatus,
  iconType,
} from "../utils/TaskTileUtils";
import { TooltipDefinition } from "carbon-components-react";
import "../styles/TaskTile.scss";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import { IPDContext } from "../../../../context/IPDContext";
import { asNeededPlaceholderConceptName, timeFormatFor12hr, timeFormatfor24Hr} from "../../../../constants";
import { formatTime } from "../../../../utils/DateTimeUtils";

export default function TaskTile(props) {
  const { medicationNursingTask } = props;
  const newMedicationNursingTask = medicationNursingTask[0];

  const { config } = useContext(IPDContext);
  const { nursingTasks = {}, enable24HourTime = {} } = config;

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
    dosingInstructions,
    stopTime,
    isDisabled,
    administeredTimeInEpochSeconds,
    serviceType,
  } = newMedicationNursingTask;

  const isRelevantTask = getRelevantTaskStatus(
    startTimeInEpochSeconds,
    nursingTasks
  );

  const drugNameText = (
    <div
      className="drug-title"
      style={{
        color: stopTime ? "#FF0000" : isRelevantTask ? "#393939" : "#525252",
        fontWeight: isRelevantTask ? 500 : 400,
      }}
    >
      {drugName}
    </div>
  );
  const statusIcon = iconType(newMedicationNursingTask, nursingTasks);
  return (
    <div className="tile-parent-container">
      <div
        className={`nursing-tasks-tile ${
          isRelevantTask && !stopTime && "relevant-task-tile"
        } 
        ${isDisabled && "disabled-tile"}`}
      >
        <div className="tile-content">
          <div className={`tile-title ${stopTime && "red-text"}`}>
            <div>
              <div
                className="nursing-task-icon-container"
                data-testid={statusIcon}
              >
                <SVGIcon iconType={statusIcon} />
              </div>
              <TooltipDefinition
                tooltipText={drugName}
                className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
              >
                {drugNameText}
              </TooltipDefinition>
            </div>
          </div>
          <div className="tile-name-cell">
            <DisplayTags drugOrder={dosingInstructions} />
          </div>
          <div
            className="tile-content-subtext"
            style={{ color: isRelevantTask ? "#393939" : "#525252" }}
          >
            <span>{dosage}</span>
            {doseType && <span>&nbsp;-&nbsp;{doseType}</span>}
            <span>&nbsp;-&nbsp;{drugRoute}</span>
          </div>
          {!(
            dosingInstructions?.asNeeded &&
            serviceType === asNeededPlaceholderConceptName
          ) && (
            <div className="tile-content-subtext">
              <Clock />
              <div>
                &nbsp;{enable24HourTime? formatTime(getTime(administeredTimeInEpochSeconds, startTime), "hh:mm", timeFormatfor24Hr) : formatTime(getTime(administeredTimeInEpochSeconds, startTime), "hh:mm", timeFormatFor12hr)}
              </div>
            </div>
          )}
          {isGroupedTask && <div className="more-info">({taskCount} more)</div>}
        </div>
      </div>
      {isGroupedTask && (
        <div
          className={`nursing-tasks-tile stacked-tile ${
            isRelevantTask && "relevant-task-tile"
          }`}
        ></div>
      )}
    </div>
  );
}
TaskTile.propTypes = {
  medicationNursingTask: PropTypes.array.isRequired,
};
