import React from "react";
import { render } from "@testing-library/react";
import { CalendarHeader } from "./CalendarHeader";

describe("CalendarHeader", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<CalendarHeader />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("should render 24 hours", () => {
    const { container } = render(<CalendarHeader />);
    const hours = container.querySelectorAll("td");
    expect(hours.length).toBe(24);
  });
});
