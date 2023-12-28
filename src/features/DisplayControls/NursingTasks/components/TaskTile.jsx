import React from "react";
import PropTypes from "prop-types";
import SVGIcon from "../../../SVGIcon/SVGIcon";
import Clock from "../../../../icons/clock.svg";
import {
  getTime,
  getRelevantTaskStatus,
  iconType,
} from "../utils/TaskTileUtils";
import { Tag, TooltipDefinition } from "carbon-components-react";
import "../styles/TaskTile.scss";
import { FormattedMessage } from "react-intl";

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
    stopTime,
    isDisabled,
    administeredTimeInEpochSeconds,
  } = newMedicationNursingTask;

  const isRelevantTask = getRelevantTaskStatus(startTimeInEpochSeconds);

  const drugNameText = (
    <div
      className="drug-title"
      style={{
        color: stopTime ? "#da1e28" : isRelevantTask ? "#393939" : "#525252",
        fontWeight: isRelevantTask ? 500 : 400,
      }}
    >
      {drugName}
    </div>
  );
  return (
    <div className="tile-parent-container">
      <div
        className={`nursing-tasks-tile ${stopTime && "no-hover"}
        ${isRelevantTask && !stopTime && "relevant-task-tile"} ${
          isDisabled ? "disabled-tile no-hover" : ""
        }`}
      >
        <div className="tile-content">
          <div className={`tile-title ${stopTime && "red-text"}`}>
            <div>
              <div
                className="nursing-task-icon-container"
                data-testid={iconType(
                  administeredTimeInEpochSeconds,
                  startTimeInEpochSeconds
                )}
              >
                <SVGIcon
                  iconType={iconType(
                    administeredTimeInEpochSeconds,
                    startTimeInEpochSeconds
                  )}
                />
              </div>
              <TooltipDefinition
                tooltipText={drugName}
                className={stopTime ? "cursor-not-allowed" : "cursor-pointer"}
              >
                {drugNameText}
              </TooltipDefinition>
            </div>
            {stopTime && (
              <Tag className={"red-tag"}>
                <FormattedMessage id={"STOPPED"} defaultMessage={"Stopped"} />
              </Tag>
            )}
          </div>
          <div
            className="tile-content-subtext"
            style={{ color: isRelevantTask ? "#393939" : "#525252" }}
          >
            <span>{dosage}</span>
            {doseType && <span>&nbsp;-&nbsp;{doseType}</span>}
            <span>&nbsp;-&nbsp;{drugRoute}</span>
          </div>
          <div className="tile-content-subtext">
            <Clock />
            <div>
              &nbsp;{getTime(administeredTimeInEpochSeconds, startTime)}
            </div>
          </div>
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
