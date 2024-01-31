import React from "react";
import { render } from "@testing-library/react";
import CalendarHeader from "../components/CalendarHeader";
import { currentShiftHoursArray } from "../utils/DrugChartUtils";
import MockDate from "mockdate";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";

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
    const currentShiftArray = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const { getAllByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <CalendarHeader currentShiftArray={currentShiftArray} />
      </IPDContext.Provider>
    );
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(
      currentShiftHoursArray(mockConfig.config.drugChart).length
    );
  });
});
