/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import PropTypes from "prop-types";
import TimeCell from "../DrugChartTimeCell/TimeCell.jsx";
export default function CalendarRow(props) {
  const { rowData } = props;
  const hours = [...Array(24).keys()];
  return (
    <div style={{ display: "flex" }}>
      {hours.map((hour) => {
        if (rowData[hour]) {
          const { minutes, status, administrationInfo } = rowData[hour];
          return (
            <TimeCell
              minutes={minutes}
              status={status}
              key={hour}
              administrationInfo={administrationInfo}
            />
          );
        }
        return <TimeCell key={hour} />;
      })}
    </div>
  );
}

CalendarRow.propTypes = {
  rowData: PropTypes.object.isRequired,
};
