import React from "react";
import { render } from "@testing-library/react";
import CalendarHeader from "./CalendarHeader";

describe("CalendarHeader", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<CalendarHeader />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("should render 24 hours", () => {
    const { getAllByTestId } = render(<CalendarHeader />);
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(24);
  });
});
