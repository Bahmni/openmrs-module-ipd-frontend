import React, { useContext } from "react";
import PropTypes from "prop-types";
import SVGIcon from "../../../SVGIcon/SVGIcon";
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
import {
  asNeededPlaceholderConceptName,
  timeFormatFor12Hr,
  timeFormatFor24Hr,
} from "../../../../constants";

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
    isANonMedicationTask,
    creator,
    taskType,
  } = newMedicationNursingTask;

  const isRelevantTask = getRelevantTaskStatus(
    startTimeInEpochSeconds,
    nursingTasks
  );

  const isSystemGeneratedTask = taskType?.display === "nursing_activity_system";

  const creatorName = (creator) => {
    var formattedName = creator.split(".").join(" ");
    return formattedName;
  };

  const drugNameText = (
    <div
      className="drug-title"
      style={{
        color: stopTime ? "#FF0000" : isRelevantTask ? "#393939" : "#525252",
        fontWeight: !isANonMedicationTask && isRelevantTask ? 500 : 400,
      }}
    >
      {drugName}
    </div>
  );
  const statusIcon = iconType(newMedicationNursingTask, nursingTasks);
  return (
    <div className="tile-parent-container">
      <div
        className={`${
          isANonMedicationTask ? "nonMedicationTile" : "nursing-tasks-tile"
        } ${
          !isANonMedicationTask &&
          isRelevantTask &&
          !stopTime &&
          "relevant-task-tile"
        }
        ${
          isDisabled
            ? isANonMedicationTask
              ? "non-medication-disabled-tile"
              : "disabled-tile"
            : ""
        }`}
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
          {!isANonMedicationTask && (
            <div className="tile-name-cell">
              <DisplayTags drugOrder={dosingInstructions} />
            </div>
          )}
          <div
            className="tile-content-subtext"
            style={{
              color: isRelevantTask ? "#393939" : "#525252",
              paddingLeft: "25px",
            }}
          >
            <span>{dosage}</span>
            {creator && !isSystemGeneratedTask && (
              <span style={{ textTransform: "capitalize" }}>
                {creatorName(creator.display)}
              </span>
            )}
            {doseType && <span>&nbsp;-&nbsp;{doseType}</span>}
            {drugRoute && <span>&nbsp;-&nbsp;{drugRoute}</span>}
          </div>
          {!(
            dosingInstructions?.asNeeded &&
            serviceType === asNeededPlaceholderConceptName
          ) && (
            <div className="tile-content-subtext">
              <Clock />
              <div className="tile-content-subtext-time">
                &nbsp;
                {enable24HourTime
                  ? getTime(
                      administeredTimeInEpochSeconds,
                      startTime,
                      "hh:mm",
                      timeFormatFor24Hr
                    )
                  : getTime(
                      administeredTimeInEpochSeconds,
                      startTime,
                      "hh:mm",
                      timeFormatFor12Hr
                    )}
              </div>
            </div>
          )}
          {isGroupedTask && <div className="more-info">({taskCount} more)</div>}
        </div>
      </div>
      {isGroupedTask && (
        <div
          className={`${
            isANonMedicationTask ? "nonMedicationTile" : "nursing-tasks-tile"
          } stacked-tile ${
            !isANonMedicationTask && isRelevantTask && "relevant-task-tile"
          }`}
        ></div>
      )}
    </div>
  );
}
TaskTile.propTypes = {
  medicationNursingTask: PropTypes.array.isRequired,
};
