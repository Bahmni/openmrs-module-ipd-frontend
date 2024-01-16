import React from "react";
import PropTypes from "prop-types";
import TimeCell from "./TimeCell.jsx";
import { areDatesSame } from "../../../../utils/DateTimeUtils.js";

export default function CalendarRow(props) {
  const { rowData, currentShiftArray, selectedDate } = props;
  return (
    <div style={{ display: "flex" }}>
      {currentShiftArray.map((hour) => {
        const date = new Date();
        const currentHour = date.getHours();
        const currentMinute = date.getMinutes();
        const sameDate = areDatesSame(date, selectedDate);
        const isCurrentHour = hour === currentHour && sameDate;
        const highlightedCell = currentMinute < 30 ? "left" : "right";
        if (rowData[hour]) {
          return (
            <TimeCell
              slotInfo={rowData[hour]}
              key={hour}
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
  currentShiftArray: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date),
};
