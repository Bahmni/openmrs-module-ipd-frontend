import React from "react";
import { render } from "@testing-library/react";
import CalendarRow from "../components/CalendarRow";

const mockTimeCell = jest.fn();
jest.mock("../components/TimeCell", () => {
  return function TimeCell(props) {
    mockTimeCell(props);
    return <div>TimeCell</div>;
  };
});

describe("CalendarRow", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return timecell when row data is  present", () => {
    const rowData = {
      8: {
        minutes: 0,
        status: "Late",
        administrationInfo: "Dr. Jane Doe [14:00]",
      },
    };
    render(<CalendarRow rowData={rowData} />);
    expect(mockTimeCell).toHaveBeenCalled();
    expect(mockTimeCell).toHaveBeenCalledWith({
      minutes: 0,
      status: "Late",
      administrationInfo: "Dr. Jane Doe [14:00]",
    });
  });
});
