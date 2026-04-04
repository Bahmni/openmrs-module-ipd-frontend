/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { render } from "@testing-library/react";
import Calendar from "./Calendar";

const mockCalendarRow = jest.fn();
jest.mock("../CalendarRow/CalendarRow", () => {
  return function CalendarRow(props) {
    mockCalendarRow(props);
    return <div>CalendarRow</div>;
  };
});

describe("Calendar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render calendar row for calendar data", () => {
    const calendarData = [
      {
        8: {
          minutes: 0,
          status: "Late",
          administrationInfo: "Dr. John Doe [14:00]",
        },
        14: {
          minutes: 0,
          status: "Administered-Late",
          administrationInfo: "Dr. John Doe [14:00]",
        },
      },
    ];

    render(<Calendar calendarData={calendarData} />);
    expect(mockCalendarRow).toHaveBeenCalled();
    expect(mockCalendarRow).toHaveBeenCalledWith({
      rowData: {
        8: {
          minutes: 0,
          status: "Late",
          administrationInfo: "Dr. John Doe [14:00]",
        },
        14: {
          minutes: 0,
          status: "Administered-Late",
          administrationInfo: "Dr. John Doe [14:00]",
        },
      },
    });
  });
});
