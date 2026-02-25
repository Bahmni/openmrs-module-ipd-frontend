/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import PropTypes from "prop-types";
import Clock from "../../icons/clock.svg";
import "./DrugListCell.scss";
// import { TooltipDefinitionCarbon } from "bahmni-carbon-ui";

export default function DrugListCell(props) {
  const { drugInfo } = props;
  const {
    drugName,
    dosage,
    doseType,
    drugRoute,
    duration,
    administrationInfo,
  } = drugInfo;
  const drugNameText = <div className={"drug-name"}>{drugName}</div>;
  //TODO: Add tooltip for drug name
  return (
    <td>
      {/*<TooltipDefinitionCarbon tooltipText={drugName} content={drugNameText}/>*/}
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
                <span style={{ color: "#FF0000" }} key={index}>
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
