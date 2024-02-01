import React, { useContext } from "react";
import PropTypes from "prop-types";
import "../styles/CalendarHeader.scss";
import { IPDContext } from "../../../../context/IPDContext";

export default function CalendarHeader(props) {
  const { config } = useContext(IPDContext);
  const { drugChart = {} } = config;
  const { currentShiftArray } = props;
  const enable24hour = drugChart.enable24HourTime;

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
