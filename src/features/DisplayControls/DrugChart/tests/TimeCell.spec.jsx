import React from "react";
import TimeCell from "../components/TimeCell";
import { render } from "@testing-library/react";

describe("TimeCell", () => {
  it("should render icon on left side of cell if minutes is less than 30", () => {
    const component = render(<TimeCell minutes="20" status="Pending" />);
    expect(component.getByTestId("left-icon")).toBeTruthy();
  });

  it("should render icon on right side of cell if minutes is less than 30", () => {
    const component = render(<TimeCell minutes="40" status="Administered" />);
    expect(component.getByTestId("right-icon")).toBeTruthy();
  });
});
