import { render } from "@testing-library/react";
import React from "react";
import AdministrationLegend from "./AdministrationLegend";

describe("AdministrationLegend", () => {
  it("should render without crashing", () => {
    const { container } = render(<AdministrationLegend />);
    expect(container).toMatchSnapshot();
  });
  it("should render legends", () => {
    const { getByText } = render(<AdministrationLegend />);
    expect(getByText("Pending")).toBeTruthy();
    expect(getByText("Late")).toBeTruthy();
    expect(getByText("Administered")).toBeTruthy();
    expect(getByText("Administered Late")).toBeTruthy();
    expect(getByText("Not Administered")).toBeTruthy();
  });
});
