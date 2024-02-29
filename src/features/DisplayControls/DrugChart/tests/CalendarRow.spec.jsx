import React from "react";
import { render } from "@testing-library/react";
import CalendarRow from "../components/CalendarRow";
import { calendarRowData, currentShiftArray } from "./CalendarRowMockData";
import MockDate from "mockdate";
import {
  mockConfig,
  mockConfigFor12HourFormat,
} from "../../../../utils/CommonUtils";
import { IPDContext } from "../../../../context/IPDContext";

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
      <IPDContext.Provider value={{ config: mockConfig }}>
        <CalendarRow
          rowData={calendarRowData}
          currentShiftArray={currentShiftArray}
        />
      </IPDContext.Provider>
    );
    expect(mockTimeCell).toHaveBeenCalled();
    MockDate.reset();
  });
});
