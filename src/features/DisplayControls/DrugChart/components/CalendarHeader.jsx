import React from "react";
import PropTypes from "prop-types";
import "../styles/CalendarHeader.scss";
import data from "../../../../utils/config.json";

export default function CalendarHeader(props) {
  const { currentShiftArray } = props;
  const enable24hour = data.config.drugChart.enable24HourTime;

  return (
    <div className="calendar-header">
      <div style={{ display: "flex" }}>
        {currentShiftArray.map((hour) => {
          const transformedHour = enable24hour ? hour : hour % 12 || 12;
          const formattedHour = `${transformedHour.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}:00`;

          return (
            <div data-testid="hour" key={hour} className={"hour-header"}>
              {formattedHour}
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
