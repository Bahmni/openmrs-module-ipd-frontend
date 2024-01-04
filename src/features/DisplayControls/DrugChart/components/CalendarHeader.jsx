import React from "react";
import PropTypes from "prop-types";
import "../styles/CalendarHeader.scss";

export default function CalendarHeader(props) {
  const { currentShiftArray } = props;
  const hours = currentShiftArray;

  return (
    <div className="calendar-header">
      <div style={{ display: "flex" }}>
        {hours.map((hour) => {
          return (
            <div data-testid="hour" key={hour} className={"hour-header"}>
              {hour.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
              :00
            </div>
          );
        })}
      </div>
    </div>
  );
}

CalendarHeader.propTypes = {
  currentShiftArray: PropTypes.array,
};
