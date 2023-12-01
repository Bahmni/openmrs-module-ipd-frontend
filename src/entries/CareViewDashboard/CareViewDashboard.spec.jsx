import React from "react";
import { render } from "@testing-library/react";
import CareViewDashboard from "./CareViewDashboard";

describe("CareViewDashboard", () => {
  it("should match the snapshot", () => {
    const { container } = render(<CareViewDashboard />);
    expect(container).toMatchSnapshot();
  });

  it("should render the component", () => {
    const { getByLabelText } = render(<CareViewDashboard />);
    expect(getByLabelText("home-button")).toBeTruthy();
  });
});
