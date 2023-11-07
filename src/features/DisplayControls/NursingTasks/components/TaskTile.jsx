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
  console.log(
    "inside tasktile newMedicationNursingTask",
    newMedicationNursingTask
  );
  const { drugName, dosage, doseType, drugRoute, duration, starttime } =
    newMedicationNursingTask;

  // const drugName = "Sodium chloride 0.9% (1L) Infusion bag (normal saline) (injection)";
  // const drugName = "Sodium chloride 0.9% ";
  // const dosage = "500";
  // const doseType = "mg";
  // const drugRoute = "Oral";
  // const duration = "5 days";
  // const administrationInfo = [

  // ];

  const moreInfo = true;
  const tileNumber = 2;
  const drugNameText = <div className={"drug-name"}>{drugName}</div>;
  return (
    <div style={{ position: "relative" }}>
      <div className="tile tile-2"></div>

      <div className="tile tile-1">
        {/* style={1>2 ? {backGround: ''} ''} */}
        <div className="tile-content">
          <div className="tile-title">
            <SVGIcon />
            {drugNameText}
          </div>
          <div className={"dosage"}>
            <span>{dosage}</span>
            {doseType && <span>&nbsp;-&nbsp;{doseType}</span>}
            <span>&nbsp;-&nbsp;{drugRoute}</span>
            {duration && <span>&nbsp;-&nbsp;{duration}</span>}
          </div>
          <div className="dosage">
            <Clock />
            <div>{starttime}</div>
          </div>
          {moreInfo && <div className="more-info">{tileNumber}</div>}
        </div>
      </div>
    </div>
  );
}
TaskTile.propTypes = {
  medicationNursingTask: PropTypes.array.isRequired,
};
