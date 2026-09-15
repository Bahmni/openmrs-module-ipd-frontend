import { render } from "@testing-library/react";
import React from "react";
import NoteLegend from "./NoteLegend";

describe("NoteLegend", () => {
  it("should render without crashing", () => {
    const { container } = render(<NoteLegend />);
    expect(container).toMatchSnapshot();
  });
  it("should render note legends", () => {
    const { getByText } = render(<NoteLegend />);
    expect(getByText("Note")).toBeTruthy();
    expect(getByText("New / Amended Note")).toBeTruthy();
    expect(getByText("Acknowledged Note")).toBeTruthy();
  });
});
