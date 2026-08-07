import React, { useContext } from "react";
import PropTypes from "prop-types";
import SVGIcon from "../../../SVGIcon/SVGIcon";
import Clock from "../../../../icons/clock.svg";
import { Calendar16 } from "@carbon/icons-react";
import {
  getTime,
  getRelevantTaskStatus,
  iconType,
} from "../utils/TaskTileUtils";
import { TooltipDefinition, Tag } from "carbon-components-react";
import "../styles/TaskTile.scss";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import { IPDContext } from "../../../../context/IPDContext";
import {
  asNeededPlaceholderConceptName,
  timeFormatFor12Hr,
  timeFormatFor24Hr,
  nonMedicationTaskKey,
  TASK_COLORS,
  NURSING_ACTIVITY_SYSTEM,
} from "../../../../constants";
import { FormattedMessage } from "react-intl";
import {
  getTranslationKey,
  isSystemGeneratedTask,
} from "../../../../utils/CommonUtils";
import { formatDate } from "../../../../utils/DateTimeUtils";
import TaskFormLink from "./TaskFormLink";

export default function TaskTile(props) {
  const { medicationNursingTask, formUuid, patientId } = props;
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
    intradayDoseString,
  } = newMedicationNursingTask;
  const moreTask = (
    <FormattedMessage id="TASK_TILE_MORE" defaultMessage="more task(s)" />
  );

  const isRelevantTask = getRelevantTaskStatus(
    startTimeInEpochSeconds,
    nursingTasks
  );

  const isSystemTask = taskType?.display === NURSING_ACTIVITY_SYSTEM;
  const taskLabel = isSystemTask ? (
    <FormattedMessage
      id={getTranslationKey(drugName, nonMedicationTaskKey)}
      defaultMessage={drugName}
    />
  ) : (
    drugName
  );
  const isFormLink = isSystemTask && formUuid && patientId;
  const fontWeight = !isANonMedicationTask && isRelevantTask ? 500 : 400;
  const taskTitleStyle = isFormLink
    ? {
        color: TASK_COLORS.LINK_BLUE,
        fontWeight,
      }
    : {
        color: stopTime
          ? TASK_COLORS.STOP_RED
          : isRelevantTask
          ? TASK_COLORS.RELEVANT_DARK
          : TASK_COLORS.NON_RELEVANT_GRAY,
        fontWeight,
      };

  const creatorName = (creator) => {
    return creator.split(".").join(" ");
  };

  const drugNameText = (
    <span className="drug-title" style={taskTitleStyle}>
      {taskLabel}
    </span>
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
              {isANonMedicationTask ? (
                <TooltipDefinition
                  tooltipText={taskLabel}
                  className={
                    isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                  }
                >
                  {isFormLink ? (
                    <TaskFormLink
                      patientId={patientId}
                      formUuid={formUuid}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="drug-title" style={taskTitleStyle}>
                        {taskLabel}
                      </span>
                    </TaskFormLink>
                  ) : (
                    drugNameText
                  )}
                </TooltipDefinition>
              ) : (
                <TooltipDefinition
                  tooltipText={drugName}
                  className={
                    isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                  }
                >
                  {drugNameText}
                </TooltipDefinition>
              )}
            </div>
            {!isANonMedicationTask && (
              <div className="tile-name-cell">
                {dosingInstructions ? (
                  <DisplayTags drugOrder={dosingInstructions} />
                ) : (
                  taskType &&
                  !isSystemGeneratedTask(newMedicationNursingTask) && (
                    <Tag type="blue">
                      <span>{taskType.display}</span>
                    </Tag>
                  )
                )}
              </div>
            )}
          </div>
          <div
            className="tile-content-subtext"
            style={{
              color: isRelevantTask ? "#393939" : "#525252",
              paddingLeft: "25px",
            }}
          >
            {intradayDoseString ? (
              <span>{intradayDoseString}</span>
            ) : (
              <>
                <span>{dosage}</span>
                {doseType && <span>&nbsp;-&nbsp;{doseType}</span>}
                {drugRoute && <span>&nbsp;-&nbsp;{drugRoute}</span>}
              </>
            )}
          </div>
          {!(
            dosingInstructions?.asNeeded &&
            serviceType === asNeededPlaceholderConceptName
          ) && (
            <div className="tile-content-footer">
              <div className="tile-date-time">
                <div className="date-time-container">
                  <div className="date-row">
                    <Calendar16 />
                    <span className="tile-content-subtext-date">
                      &nbsp;
                      {formatDate(
                        new Date(startTimeInEpochSeconds * 1000),
                        "DD MMMM YYYY"
                      )}
                    </span>
                  </div>
                  <div className="time-row">
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
                </div>
              </div>
              <div className="footer-right-section">
                {creator &&
                  !isSystemGeneratedTask(newMedicationNursingTask) && (
                    <span className="creator-name">
                      {creatorName(creator.display)}
                    </span>
                  )}
                {isGroupedTask && (
                  <span className="grouped-task-count">
                    ({taskCount} {moreTask})
                  </span>
                )}
              </div>
            </div>
          )}
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
  medicationNursingTask: PropTypes.arrayOf(PropTypes.object).isRequired,
  formUuid: PropTypes.string,
  patientId: PropTypes.string,
};
