import React from "react";
import { render } from "@testing-library/react";
import CalendarHeader from "../components/CalendarHeader";
import { currentShiftHoursArray } from "../utils/DrugChartUtils";

describe("CalendarHeader", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<CalendarHeader />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("should render shiftHours hours", () => {
    const { getAllByTestId } = render(<CalendarHeader />);
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(currentShiftHoursArray().length);
  });
});
