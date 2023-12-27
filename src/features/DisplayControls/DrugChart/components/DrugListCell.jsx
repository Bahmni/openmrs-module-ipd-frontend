import React from "react";
import PropTypes from "prop-types";
import Clock from "../../../../icons/clock.svg";
import "../styles/DrugListCell.scss";
import { TooltipCarbon } from "bahmni-carbon-ui";
import NoteIcon from "../../../../icons/note.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";

export default function DrugListCell(props) {
  const { drugInfo } = props;
  const {
    drugName,
    dosage,
    doseType,
    drugRoute,
    duration,
    administrationInfo,
    dosingInstructions,
    dosingTagInfo,
  } = drugInfo;

  let parsedDosingInstructions;
  if (dosingInstructions !== null && dosingInstructions !== undefined) {
    parsedDosingInstructions = JSON.parse(dosingInstructions);
  }

  const toolTipContent = (
    <div>
      Instructions:&nbsp;{parsedDosingInstructions.instructions}
      <br />
      {parsedDosingInstructions.additionalInstructions && (
        <>
          <div className="tooltip-content-separater" />
          Additional Instructions:&nbsp;
          {parsedDosingInstructions.additionalInstructions}
        </>
      )}
    </div>
  );
  const drugNameText = (
    <div className="drug-name-container">
      <div className={"drug-chart-drug-name"}>{drugName}</div>
      {dosingInstructions && (
        <TooltipCarbon icon={() => icon} content={toolTipContent} />
      )}
      <div className="drug-name-cell">
        <DisplayTags drugOrder={dosingTagInfo} />
      </div>
    </div>
  );
  const icon = (
    <div className="note-icon-container">
      <NoteIcon />
    </div>
  );
  return (
    <td>
      {drugNameText}

      <div className={"dosage"}>
        <span>{dosage}</span>
        {doseType && <span>&nbsp;-&nbsp;{doseType}</span>}
        <span>&nbsp;-&nbsp;{drugRoute}</span>
        {duration && <span>&nbsp;-&nbsp;{duration}</span>}
      </div>
      {administrationInfo.length >= 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Clock />
          {administrationInfo.map((adminInfo, index) => {
            if (adminInfo.kind === "Administered-Late") {
              return (
                <span style={{ color: "#da1e28" }} key={index}>
                  {adminInfo.time}
                  {index !== administrationInfo.length - 1 && (
                    <span style={{ color: "#525252" }}>,</span>
                  )}
                </span>
              );
            } else {
              return (
                <span style={{ color: "#525252" }} key={index}>
                  {adminInfo.time}
                  {index !== administrationInfo.length - 1 && <span>,</span>}
                </span>
              );
            }
          })}
        </div>
      )}
    </td>
  );
}
DrugListCell.propTypes = {
  drugInfo: PropTypes.object.isRequired,
};
