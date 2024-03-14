import { epochTo24HourTimeFormat } from "../../../utils/DateTimeUtils";
import React from "react";
import propTypes from "prop-types";

export const Header = ({ timeframeLimitInHours, nearestHourEpoch }) => {
  return (
    <tr className="patient-row-container">
      <td
        className="patient-details-container"
        key="patient-details-header"
        data-testid="patient-details-header"
      ></td>
      {Array.from({ length: timeframeLimitInHours }, (_, i) => {
        const startTime = nearestHourEpoch + i * 3600;
        let headerKey = `slot-details-header-${i}`;
        return (
          <td
            className="slot-details-header"
            key={headerKey}
            data-testid={headerKey}
          >
            <div className="time" data-testid={`time-frame-${i}`}>
              {epochTo24HourTimeFormat(startTime, true)}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

Header.propTypes = {
  timeframeLimitInHours: propTypes.number.isRequired,
  nearestHourEpoch: propTypes.number.isRequired,
};
