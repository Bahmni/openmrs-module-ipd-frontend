/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import {
  epochTo12HourTimeFormat,
  epochTo24HourTimeFormat,
} from "../../../utils/DateTimeUtils";
import React, { useContext } from "react";
import propTypes from "prop-types";
import { CareViewContext } from "../../../context/CareViewContext";

export const Header = ({ timeframeLimitInHours, navHourEpoch }) => {
  const { ipdConfig } = useContext(CareViewContext);
  const { enable24HourTime = {} } = ipdConfig;
  return (
    <tr className="patient-row-container">
      <td
        className="patient-details-container"
        key="patient-details-header"
        data-testid="patient-details-header"
      ></td>
      {Array.from({ length: timeframeLimitInHours }, (_, i) => {
        const startTime = navHourEpoch.startHourEpoch + i * 3600;
        if (startTime < navHourEpoch.endHourEpoch) {
          let headerKey = `slot-details-header-${i}`;
          return (
            <td
              className="slot-details-header"
              key={headerKey}
              data-testid={headerKey}
            >
              <div className="time" data-testid={`time-frame-${i}`}>
                {enable24HourTime
                  ? epochTo24HourTimeFormat(startTime, true)
                  : epochTo12HourTimeFormat(startTime, true)}
              </div>
            </td>
          );
        }
      })}
    </tr>
  );
};

Header.propTypes = {
  timeframeLimitInHours: propTypes.number.isRequired,
  navHourEpoch: propTypes.object.isRequired,
};
