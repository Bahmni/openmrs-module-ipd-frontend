import React from "react";
import { render, waitFor } from "@testing-library/react";
import CareViewDashboard from "./CareViewDashboard";

describe("CareViewDashboard", () => {
  it("should match the snapshot", async () => {
    const { container, getByLabelText } = render(<CareViewDashboard />);
    await waitFor(() => {
      expect(getByLabelText("home-button")).toBeTruthy();
    });
    expect(container).toMatchSnapshot();
  });

  it("should render the component", async () => {
    const { getByLabelText } = render(<CareViewDashboard />);
    await waitFor(() => {
      expect(getByLabelText("home-button")).toBeTruthy();
    });
  });
});
