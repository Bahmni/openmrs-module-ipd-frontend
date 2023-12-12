import React from "react";
import { render } from "@testing-library/react";
import Calendar from "../components/Calendar";

const mockCalendarRow = jest.fn();
jest.mock("../components/CalendarRow", () => {
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
