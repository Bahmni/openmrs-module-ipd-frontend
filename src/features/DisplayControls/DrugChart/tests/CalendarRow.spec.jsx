import React from "react";
import { render } from "@testing-library/react";
import CalendarRow from "../components/CalendarRow";
import {
  calendarRowData,
  currentShiftArray,
  currentShiftArrayWithHalfHour,
} from "./CalendarRowMockData";
import MockDate from "mockdate";
import { mockConfig } from "../../../../utils/CommonUtils";
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
          shiftIndex={0}
        />
      </IPDContext.Provider>
    );
    expect(mockTimeCell).toHaveBeenCalled();
    MockDate.reset();
  });

  it("should return mock timeCell with isblank prop as true when both shiftStartTime and shiftEndTime is not wholeHour or half-hour", () => {
    MockDate.set("2023-12-22T08:00:00.000+0530");
    render(
      <IPDContext.Provider
        value={{
          config: {
            ...mockConfig,
            shiftDetails: {
              1: { shiftStartTime: "08:00", shiftEndTime: "19:30" },
              2: { shiftStartTime: "19:30", shiftEndTime: "08:00" },
            },
          },
        }}
      >
        <CalendarRow
          rowData={calendarRowData}
          currentShiftArray={currentShiftArray}
          shiftIndex={0}
        />
      </IPDContext.Provider>
    );
    expect(mockTimeCell).toHaveBeenCalledTimes(8);
    expect(mockTimeCell).toHaveBeenLastCalledWith({
      doHighlightCell: false,
      highlightedCell: "left",
      isBlank: true,
      isWholeHourStartTime: true,
    });
    MockDate.reset();
  });

  it("should return mock timeCell with isblank prop as false when both shiftStartTime and shiftEndTime is wholeHour", () => {
    MockDate.set("2023-12-22T08:00:00.000+0530");
    render(
      <IPDContext.Provider
        value={{
          config: {
            ...mockConfig,
            shiftDetails: {
              1: { shiftStartTime: "08:00", shiftEndTime: "19:00" },
              2: { shiftStartTime: "19:00", shiftEndTime: "08:00" },
            },
          },
        }}
      >
        <CalendarRow
          rowData={calendarRowData}
          currentShiftArray={currentShiftArray}
          shiftIndex={0}
        />
      </IPDContext.Provider>
    );
    expect(mockTimeCell).toHaveBeenCalledTimes(8);
    expect(mockTimeCell).toHaveBeenLastCalledWith({
      doHighlightCell: false,
      highlightedCell: "left",
      isBlank: false,
      isWholeHourStartTime: true,
    });
    MockDate.reset();
  });

  it("should return mock timeCell with isblank prop as false when both shiftStartTime and shiftEndTime is half-hour", () => {
    MockDate.set("2023-12-22T08:00:00.000+0530");
    render(
      <IPDContext.Provider
        value={{
          config: {
            ...mockConfig,
            shiftDetails: {
              1: { shiftStartTime: "08:30", shiftEndTime: "19:30" },
              2: { shiftStartTime: "19:30", shiftEndTime: "08:30" },
            },
          },
        }}
      >
        <CalendarRow
          rowData={calendarRowData}
          currentShiftArray={currentShiftArrayWithHalfHour}
          shiftIndex={0}
        />
      </IPDContext.Provider>
    );
    expect(mockTimeCell).toHaveBeenCalledTimes(8);
    expect(mockTimeCell).toHaveBeenLastCalledWith({
      doHighlightCell: false,
      highlightedCell: "left",
      isBlank: false,
      isWholeHourStartTime: false,
    });
    MockDate.reset();
  });
});
