import React from "react";
import { render } from "@testing-library/react";
import CalendarHeader from "../components/CalendarHeader";
import { currentShiftHoursArray } from "../utils/DrugChartUtils";
import MockDate from "mockdate";

describe("CalendarHeader", () => {
  it("should match snapshot", () => {
    MockDate.set("2023-12-22T00:00:00.000+0530");
    const { container } = render(<CalendarHeader />);
    expect(container).toMatchSnapshot();
    MockDate.reset();
  });
  it("should render shiftHours hours", () => {
    const { getAllByTestId } = render(<CalendarHeader />);
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(currentShiftHoursArray().length);
  });
});
