import React, { useContext } from "react";
import PropTypes from "prop-types";
import "../styles/CalendarHeader.scss";
import { IPDContext } from "../../../../context/IPDContext";

export default function CalendarHeader(props) {
  const { config } = useContext(IPDContext);
  const { enable24HourTime = {} } = config;
  const { currentShiftArray } = props;
  const enable24Hour = enable24HourTime;

  return (
    <div className="calendar-header">
      <div style={{ display: "flex" }}>
        {currentShiftArray.map((hour) => {
          const transformedHour = enable24Hour ? hour : hour % 12 || 12;
          const period = enable24Hour ? '' : hour < 12 ? 'am' : 'pm';
          const formattedHour = `${transformedHour.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}:00 ${period}`;

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
