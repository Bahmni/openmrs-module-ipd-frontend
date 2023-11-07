import React from "react";
import PropTypes from "prop-types";
import SVGIcon from "../../../SVGIcon/SVGIcon";
import Clock from "../../../../icons/clock.svg";
import "../styles/TaskTile.scss";

export default function TaskTile(props) {
  const { medicationNursingTask } = props;
  const newMedicationNursingTask = medicationNursingTask[0];
  //   if(medicationNursingTask.length >1) {
  //   newMedicationNursingTask = medicationNursingTask[0];
  // }
  // else {
  //   newMedicationNursingTask = medicationNursingTask;
  // }
  let isGroupedTask, taskCount;
  if (medicationNursingTask.length > 1) {
    isGroupedTask = true;
    taskCount = medicationNursingTask.length - 1;
  }
  console.log(
    "inside tasktile newMedicationNursingTask",
    newMedicationNursingTask
  );
  const { drugName, dosage, doseType, drugRoute, duration, starttime } =
    newMedicationNursingTask;
  const isRelevantTask = false;

  // const drugName = "Sodium chloride 0.9% (1L) Infusion bag (normal saline) (injection)";
  // const drugName = "Sodium chloride 0.9% ";
  // const dosage = "500";
  // const doseType = "mg";
  // const drugRoute = "Oral";
  // const duration = "5 days";
  // const administrationInfo = [

  // ];

  // const showMoreInfo = true;
  // const tileNumber = 2;
  const drugNameText = (
    <div
      className={"drug-name"}
      style={{ color: isRelevantTask ? "#393939" : "#A9A9A9" }}
    >
      {drugName}
    </div>
  );
  return (
    <div style={{ position: "relative", width: "350px" }}>
      {isGroupedTask && (
        <div
          className="tile tile-2"
          style={{
            backgroundColor: isRelevantTask ? "#e3fed1" : "#EDF8E6",
          }}
        ></div>
      )}

      <div
        className="tile tile-1"
        style={{
          backgroundColor: isRelevantTask ? "#e3fed1" : "#EDF8E6",
        }}
      >
        <div className="tile-content">
          <div className="tile-title">
            <SVGIcon />
            {drugNameText}
          </div>
          <div
            className={"dosage"}
            style={{ color: isRelevantTask ? "#393939" : "#A9A9A9" }}
          >
            <span>{dosage}</span>
            {doseType && <span>&nbsp;-&nbsp;{doseType}</span>}
            <span>&nbsp;-&nbsp;{drugRoute}</span>
            {duration && <span>&nbsp;-&nbsp;{duration}</span>}
          </div>
          <div className="dosage">
            <Clock />
            <div>&nbsp;{starttime}</div>
          </div>
          {isGroupedTask && <div className="more-info">({taskCount} more)</div>}
        </div>
      </div>
    </div>
  );
}
TaskTile.propTypes = {
  medicationNursingTask: PropTypes.array.isRequired,
};
