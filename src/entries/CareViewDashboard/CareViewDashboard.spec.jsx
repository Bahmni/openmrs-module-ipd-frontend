import React from "react";
import { render, waitFor } from "@testing-library/react";
import CareViewDashboard from "./CareViewDashboard";

const mockConfig = jest.fn();
jest.mock("./CareViewDashboardUtils", () => {
  return {
    getConfigForCareViewDashboard: () => mockConfig(),
  };
});
describe("CareViewDashboard", () => {
  beforeEach(() => {
    mockConfig.mockReturnValue({
      pageSizeOptions: [10, 20, 30, 40, 50],
      defaultPageSize: 10,
    });
  });
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
