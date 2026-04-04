/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import "./CalendarHeader.scss";

export default function CalendarHeader() {
  const hours = [...Array(24).keys()];

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
