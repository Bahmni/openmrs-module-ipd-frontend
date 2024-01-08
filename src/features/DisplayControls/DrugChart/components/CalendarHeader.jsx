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
          const formattedHour = enable24hour
            ? hour.toLocaleString("en-US", {
                hour: "2-digit",
                minimumIntegerDigits: 2,
              })
            : (((hour + 11) % 12) + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
              });

          return (
            <div data-testid="hour" key={hour} className={"hour-header"}>
              {formattedHour}:00
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
