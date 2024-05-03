import React, { useContext } from "react";
import PropTypes from "prop-types";
import "../styles/CalendarHeader.scss";
import { IPDContext } from "../../../../context/IPDContext";
import {
  add30Minutes,
  getFormattedDateTime,
} from "../../../../utils/DateTimeUtils";

export default function CalendarHeader(props) {
  const { config } = useContext(IPDContext);
  const { enable24HourTime = {} } = config;
  const { currentShiftArray } = props;

  const updatedCurrentShiftArray = currentShiftArray.flatMap(add30Minutes);

  return (
    <div className="calendar-header">
      <div style={{ display: "flex" }}>
        {updatedCurrentShiftArray.map((time) => {
          const [hour, minute] = time.split(":");
          const transformedTime = getFormattedDateTime(
            hour,
            minute,
            enable24HourTime
          );
          return (
            <div data-testid="hour" key={time} className={"hour-header"}>
              {transformedTime}
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
