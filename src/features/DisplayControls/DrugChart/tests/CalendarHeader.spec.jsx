import React from "react";
import { render } from "@testing-library/react";
import CalendarHeader from "../components/CalendarHeader";
import { currentShiftHoursArray } from "../utils/DrugChartUtils";
import MockDate from "mockdate";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig, mockConfigFor12HourFormat} from "../../../../utils/CommonUtils";

describe("CalendarHeader", () => {
  it("should match snapshot", () => {
    MockDate.set("2023-12-22T00:00:00.000+0530");
    const currentShiftArray = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const { container } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <CalendarHeader currentShiftArray={currentShiftArray} />
      </IPDContext.Provider>
    );
    expect(container).toMatchSnapshot();
    MockDate.reset();
  });
  it("should render shiftHours hours", () => {
    MockDate.set("2024-01-05 10:00");
    const currentShiftArray = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const shiftDetails = {
      1: { shiftStartTime: "06:00", shiftEndTime: "18:00" },
      2: { shiftStartTime: "18:00", shiftEndTime: "06:00" },
    };
    const { getAllByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <CalendarHeader currentShiftArray={currentShiftArray} />
      </IPDContext.Provider>
    );
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(
      currentShiftHoursArray(new Date(), shiftDetails).currentShiftHoursArray
        .length
    );
    MockDate.reset();
  });

  it("should render shiftHours hours when time in 12 hour format", () => {
    MockDate.set("2024-01-05 10:00");
    const currentShiftArray = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const shiftDetails = {
      1: { shiftStartTime: "06:00", shiftEndTime: "18:00" },
      2: { shiftStartTime: "18:00", shiftEndTime: "06:00" },
    };
    const { getAllByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfigFor12HourFormat }}>
        <CalendarHeader currentShiftArray={currentShiftArray} />
      </IPDContext.Provider>
    );
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(
      currentShiftHoursArray(new Date(), shiftDetails).currentShiftHoursArray
        .length
    );
    MockDate.reset();
  });
});
