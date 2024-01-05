import React from "react";
import { render } from "@testing-library/react";
import CalendarHeader from "../components/CalendarHeader";
import { currentShiftHoursArray } from "../utils/DrugChartUtils";
import MockDate from "mockdate";

describe("CalendarHeader", () => {
  it("should match snapshot", () => {
    MockDate.set("2023-12-22T00:00:00.000+0530");
    const currentShiftArray = [14, 15, 16, 17, 18, 19, 20, 21];
    const { container } = render(
      <CalendarHeader currentShiftArray={currentShiftArray} />
    );
    expect(container).toMatchSnapshot();
    MockDate.reset();
  });
  it("should render shiftHours hours", () => {
    const currentShiftArray = [14, 15, 16, 17, 18, 19, 20, 21];
    const { getAllByTestId } = render(
      <CalendarHeader currentShiftArray={currentShiftArray} />
    );
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(currentShiftHoursArray().length);
  });
});
