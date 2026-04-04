/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import PropTypes from "prop-types";
import CalendarRow from "./CalendarRow.jsx";
import "../styles/Calendar.scss";
export default function Calendar(props) {
  const { calendarData, currentShiftArray, selectedDate, shiftIndex } = props;
  return (
    <table className="drug-chart-calendar">
      <tbody>
        {calendarData.map((rowData, index) => {
          return (
            <tr key={index}>
              <CalendarRow
                rowData={rowData}
                currentShiftArray={currentShiftArray}
                selectedDate={selectedDate}
                shiftIndex={shiftIndex}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Calendar.propTypes = {
  calendarData: PropTypes.array.isRequired,
  currentShiftArray: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date),
  shiftIndex: PropTypes.number,
};
