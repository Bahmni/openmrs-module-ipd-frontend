import React from "react";
import { render } from "@testing-library/react";
import CalendarRow from "../components/CalendarRow";
import { calendarRowData, currentShiftArray } from "./CalendarRowMockData";
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
    render(
      <CalendarRow
        rowData={calendarRowData}
        currentShiftArray={currentShiftArray}
      />
    );
    expect(mockTimeCell).toHaveBeenCalled();
    MockDate.reset();
  });
});
