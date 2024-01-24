import React from "react";
import PropTypes from "prop-types";
import Clock from "../../../../icons/clock.svg";
import "../styles/DrugListCell.scss";
import { TooltipDefinition } from "carbon-components-react";
import { TooltipCarbon } from "bahmni-carbon-ui";
import NoteIcon from "../../../../icons/note.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import data from "../../../../utils/config.json";
import moment from "moment";

export default function DrugListCell(props) {
  const { dosingInstructions, duration, name, slots } = props.drugInfo;
  const { instructions, dosage, doseUnits, route } = dosingInstructions;
  const enable24hour = data.config.drugChart.enable24HourTime;

  const showInstructionsIcon =
    instructions?.instructions || instructions?.additionalInstructions;
  const administrationInfo = [];
  slots.forEach((slot) => {
    if (
      ["Administered", "Administered-Late", "Not-Administered"].includes(
        slot.administrationSummary.status
      )
    ) {
      administrationInfo.push({
        kind: slot.administrationSummary.status,
        time: moment(slot.startTime * 1000).format("HH: mm"),
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
              <Clock />
              {administrationInfo.map((adminInfo, index) => {
                let adminInfoTime = adminInfo.time;
                if (adminInfoTime && !enable24hour) {
                  const [hours, minutes] = adminInfoTime.split(":");
                  const hours12 = hours % 12 || 12;
                  adminInfoTime = `${hours12}:${minutes}`;
                }
                if (adminInfo.kind === "Administered-Late") {
                  return (
                    <span style={{ color: "#da1e28" }} key={index}>
                      {adminInfoTime}
                      {index !== administrationInfo.length - 1 && (
                        <span style={{ color: "#525252" }}>,</span>
                      )}
                    </span>
                  );
                } else {
                  return (
                    <span style={{ color: "#525252" }} key={index}>
                      {adminInfoTime}
                      {index !== administrationInfo.length - 1 && (
                        <span>,</span>
                      )}
                    </span>
                  );
                }
              })}
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
