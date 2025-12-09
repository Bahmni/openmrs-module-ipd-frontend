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
import { SliderContext } from "../../../../context/SliderContext";
import { DrugChartSlotContext } from "../../../../context/DrugChartSlotContext";

const mockTimeCell = jest.fn();
jest.mock("../components/TimeCell", () => {
  return function TimeCell(props) {
    mockTimeCell(props);
    return <div>TimeCell</div>;
  };
});

const mockSliderContext = {
  provider: { uuid: "provider-uuid-123" },
  isSliderOpen: {},
  updateSliderOpen: jest.fn(),
};

const mockDrugChartSlotContext = {
  onSlotClick: jest.fn(),
};

const renderWithContexts = (component, config = mockConfig) => {
  return render(
    <SliderContext.Provider value={mockSliderContext}>
      <DrugChartSlotContext.Provider value={mockDrugChartSlotContext}>
        <IPDContext.Provider value={{ config }}>
          {component}
        </IPDContext.Provider>
      </DrugChartSlotContext.Provider>
    </SliderContext.Provider>
  );
};

describe("CalendarRow", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return timecell when row data is  present", () => {
    MockDate.set("2023-12-22T08:00:00.000+0530");
    renderWithContexts(
      <CalendarRow
        rowData={calendarRowData}
        currentShiftArray={currentShiftArray}
        shiftIndex={0}
      />
    );
    expect(mockTimeCell).toHaveBeenCalled();
    MockDate.reset();
  });

  it("should return mock timeCell with isblank prop as true when both shiftStartTime and shiftEndTime is not wholeHour or half-hour", () => {
    MockDate.set("2023-12-22T08:00:00.000+0530");
    renderWithContexts(
      <CalendarRow
        rowData={calendarRowData}
        currentShiftArray={currentShiftArray}
        shiftIndex={0}
      />,
      {
        ...mockConfig,
        shiftDetails: {
          1: { shiftStartTime: "08:00", shiftEndTime: "19:30" },
          2: { shiftStartTime: "19:30", shiftEndTime: "08:00" },
        },
      }
    );
    expect(mockTimeCell).toHaveBeenCalledTimes(8);
    expect(mockTimeCell).toHaveBeenLastCalledWith({
      doHighlightCell: false,
      highlightedCell: "left",
      isBlank: true,
      isWholeHourStartTime: true,
      currentProviderUuid: "provider-uuid-123",
    });
    MockDate.reset();
  });

  it("should return mock timeCell with isblank prop as false when both shiftStartTime and shiftEndTime is wholeHour", () => {
    MockDate.set("2023-12-22T08:00:00.000+0530");
    renderWithContexts(
      <CalendarRow
        rowData={calendarRowData}
        currentShiftArray={currentShiftArray}
        shiftIndex={0}
      />,
      {
        ...mockConfig,
        shiftDetails: {
          1: { shiftStartTime: "08:00", shiftEndTime: "19:00" },
          2: { shiftStartTime: "19:00", shiftEndTime: "08:00" },
        },
      }
    );
    expect(mockTimeCell).toHaveBeenCalledTimes(8);
    expect(mockTimeCell).toHaveBeenLastCalledWith({
      doHighlightCell: false,
      highlightedCell: "left",
      isBlank: false,
      isWholeHourStartTime: true,
      currentProviderUuid: "provider-uuid-123",
    });
    MockDate.reset();
  });

  it("should return mock timeCell with isblank prop as false when both shiftStartTime and shiftEndTime is half-hour", () => {
    MockDate.set("2023-12-22T08:00:00.000+0530");
    renderWithContexts(
      <CalendarRow
        rowData={calendarRowData}
        currentShiftArray={currentShiftArrayWithHalfHour}
        shiftIndex={0}
      />,
      {
        ...mockConfig,
        shiftDetails: {
          1: { shiftStartTime: "08:30", shiftEndTime: "19:30" },
          2: { shiftStartTime: "19:30", shiftEndTime: "08:30" },
        },
      }
    );
    expect(mockTimeCell).toHaveBeenCalledTimes(8);
    expect(mockTimeCell).toHaveBeenLastCalledWith({
      doHighlightCell: false,
      highlightedCell: "left",
      isBlank: false,
      isWholeHourStartTime: false,
      currentProviderUuid: "provider-uuid-123",
    });
    MockDate.reset();
  });
});
