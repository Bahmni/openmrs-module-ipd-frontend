import React, { useContext } from "react";
import PropTypes from "prop-types";
import Clock from "../../../../icons/clock.svg";
import "../styles/DrugListCell.scss";
import { TooltipDefinition } from "carbon-components-react";
import { TooltipCarbon } from "bahmni-carbon-ui";
import NoteIcon from "../../../../icons/note.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import moment from "moment";
import { IPDContext } from "../../../../context/IPDContext";

export default function DrugListCell(props) {
  const { dosingInstructions, duration, name, slots, notes, orderReasonText } =
    props.drugInfo;
  const { instructions, dosage, doseUnits, route } = dosingInstructions;
  const { config } = useContext(IPDContext);
  const { drugChart = {} } = config;

  const enable24hour = drugChart.enable24HourTime;

  const showInstructionsIcon =
    instructions?.instructions ||
    instructions?.additionalInstructions ||
    notes ||
    orderReasonText;
  const administrationInfo = [];
  slots.forEach((slot) => {
    if (
      ["Administered", "Administered-Late"].includes(
        slot.administrationSummary.status
      )
    ) {
      administrationInfo.push({
        kind: slot.administrationSummary.status,
        time: moment(slot.startTime * 1000).format("HH:mm"),
      });
    }
  });
  const toolTipContent = (
    <div>
      {dosingInstructions?.instructions?.instructions && (
        <>Instructions:&nbsp;{dosingInstructions?.instructions?.instructions}</>
      )}
      {dosingInstructions?.instructions?.additionalInstructions && (
        <>
          {dosingInstructions?.instructions?.instructions && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Additional Instructions:&nbsp;
          {dosingInstructions?.instructions?.additionalInstructions}
        </>
      )}
      {orderReasonText && (
        <>
          {(dosingInstructions?.instructions?.instructions ||
            dosingInstructions?.instructions?.additionalInstructions) && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Stopping Notes:&nbsp;{orderReasonText}
        </>
      )}
      {notes && (
        <>
          <br />
          <div className="tooltip-content-separater" />
          Notes:&nbsp;
          {notes}
        </>
      )}
    </div>
  );
  const getMedicationName = () => {
    return (
      <div className="drug-name-container">
        <TooltipDefinition tooltipText={name} className={"name-tooltip"}>
          <div className={"drug-chart-drug-name"}>{name}</div>
        </TooltipDefinition>
        &nbsp;
        {showInstructionsIcon && (
          <TooltipCarbon icon={() => <NoteIcon />} content={toolTipContent} />
        )}
      </div>
    );
  };
  const getToolTipTextForAdministeredTime = () => {
    let administeredTimes = [];
    administrationInfo.map((adminInfo) => {
      let adminInfoTime = adminInfo.time;
      if (adminInfoTime && !enable24hour) {
        const [hours, minutes] = adminInfoTime.split(":");
        const hours12 = hours % 12 || 12;
        adminInfoTime = `${hours12}:${minutes}`;
      }
      administeredTimes.push(adminInfoTime);
    });
    return administeredTimes.join(", ");
  };
  return (
    <div className="drug-order-details">
      <div className="order-details">
        {getMedicationName()}
        <div>
          {dosage}
          {doseUnits && ` - ${doseUnits}`}
          {route && ` - ${route}`}
          {duration && ` -  ${duration}`}
        </div>
        <div>
          {administrationInfo.length >= 1 && (
            <div className={"administration-details"}>
              <TooltipDefinition
                tooltipText={getToolTipTextForAdministeredTime()}
                className={"administration-details-tooltip"}
              >
                <div className={"administration-time-info"}>
                  <Clock className={"clock-icon"} />
                  {administrationInfo.map((adminInfo, index) => {
                    let adminInfoTime = adminInfo.time;
                    if (adminInfoTime && !enable24hour) {
                      const [hours, minutes] = adminInfoTime.split(":");
                      const hours12 = hours % 12 || 12;
                      adminInfoTime = `${hours12}:${minutes}`;
                    }
                    if (adminInfo.kind === "Administered-Late") {
                      return (
                        <span style={{ color: "#FF0000" }} key={index}>
                          {adminInfoTime}
                          {index !== administrationInfo.length - 1 && (
                            <span style={{ color: "#525252" }}>, </span>
                          )}
                        </span>
                      );
                    } else {
                      return (
                        <span style={{ color: "#525252" }} key={index}>
                          {adminInfoTime}
                          {index !== administrationInfo.length - 1 && (
                            <span>, </span>
                          )}
                        </span>
                      );
                    }
                  })}
                </div>
              </TooltipDefinition>
            </div>
          )}
        </div>
      </div>
      <div className="medication-tags">
        <DisplayTags drugOrder={dosingInstructions} />
        {/*{dateStopped && <Tag className={"red-tag"}><FormattedMessage id={"STOPPED"} defaultMessage={"Stopped"} /></Tag>}*/}
      </div>
    </div>
  );
}
DrugListCell.propTypes = {
  drugInfo: PropTypes.object.isRequired,
};
