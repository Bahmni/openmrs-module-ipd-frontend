import React from "react";
import { render } from "@testing-library/react";
import CalendarRow from "../components/CalendarRow";
import MockDate from "mockdate";

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
    MockDate.set("2023-12-22T08:00:00.000+0530");
    const rowData = {
      0: {
        minutes: 0,
        status: "Late",
        administrationInfo: "Dr. Jane Doe [14:00]",
        doHighlightCell: false,
        highlightedCell: "right",
      },
    };
    const currentShiftArray = [14, 15, 16, 17, 18, 19, 20, 21];
    render(<CalendarRow rowData={rowData} currentShiftArray={currentShiftArray} />);
    expect(mockTimeCell).toHaveBeenCalled();
    // expect(mockTimeCell).toHaveBeenCalledWith({
    //   minutes: 0,
    //   status: "Late",
    //   administrationInfo: "Dr. Jane Doe [14:00]",
    //   doHighlightCell: false,
    //   highlightedCell: "right",
    // });
    MockDate.reset();
  });
});
