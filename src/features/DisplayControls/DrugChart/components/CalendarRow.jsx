import React from "react";
import PropTypes from "prop-types";
import TimeCell from "./TimeCell.jsx";
import { currentShiftHoursArray } from "../utils/DrugChartUtils.js";
export default function CalendarRow(props) {
  const { rowData } = props;
  const hours = currentShiftHoursArray();
  return (
    <div style={{ display: "flex" }}>
      {hours.map((hour) => {
        const date = new Date();
        const currentHour = date.getHours();
        const currentMinute = date.getMinutes();
        const isCurrentHour = hour === currentHour;
        const highlightedCell = currentMinute < 30 ? "left" : "right";

        if (rowData[hour]) {
          const { minutes, status, administrationInfo, notes } = rowData[hour];

          return (
            <TimeCell
              minutes={minutes}
              status={status}
              key={hour}
              administrationInfo={administrationInfo}
              medicationNotes={notes}
              doHighlightCell={isCurrentHour}
              highlightedCell={highlightedCell}
            />
          );
        }
        return (
          <TimeCell
            key={hour}
            doHighlightCell={isCurrentHour}
            highlightedCell={highlightedCell}
          />
        );
      })}
    </div>
  );
}

CalendarRow.propTypes = {
  rowData: PropTypes.object.isRequired,
};
