import React from "react";
import { render, waitFor } from "@testing-library/react";
import CareViewDashboard from "./CareViewDashboard";
import MockDate from "mockdate";

const mockConfig = jest.fn();

jest.mock("swiper/react", () => ({
  Swiper: ({ children }) => children,
  SwiperSlide: ({ children }) => children,
}));
jest.mock("swiper/modules", () => ({
  Pagination: (props) => [props],
}));
jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/pagination", () => jest.fn());
jest.mock("./CareViewDashboardUtils", () => {
  return {
    getConfigForCareViewDashboard: () => mockConfig(),
  };
});
describe("CareViewDashboard", () => {
  afterEach(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    mockConfig.mockReturnValue({
      pageSizeOptions: [10, 20, 30, 40, 50],
      defaultPageSize: 10,
      timeframeLimitInHours: 2,
    });

    MockDate.set("2023-01-01T12:00:00");
  });

  it("should match the snapshot", async () => {
    const { container, getByLabelText } = render(
      <CareViewDashboard
        hostData={{ provider: "c61c0d60-b483-4c6a-ad97-8cdec7d48b08" }}
        hostApi={{ onHome: jest.fn(), onLogOut: jest.fn() }}
      />
    );
    await waitFor(() => {
      expect(getByLabelText("home-button")).toBeTruthy();
    });
    expect(container).toMatchSnapshot();
  });

  it("should render the component", async () => {
    const { getByLabelText } = render(
      <CareViewDashboard
        hostData={{ provider: "c61c0d60-b483-4c6a-ad97-8cdec7d48b08" }}
        hostApi={{ onHome: jest.fn(), onLogOut: jest.fn() }}
      />
    );
    await waitFor(() => {
      expect(getByLabelText("home-button")).toBeTruthy();
    });
  });
});
