import React from "react";
import { render } from "@testing-library/react";
import { CareViewSummary } from "../components/CareViewSummary";
import { mockWardList } from "./CareViewSummaryMock";
import { CareViewContext } from "../../../context/CareViewContext";

const mockGetWardDetails = jest.fn();
const mockFetchWardSummary = jest.fn();
const mockGetSliderPerView = jest.fn();
const mockContext = {
  selectedWard: { label: "ward", uuid: "uuid" },
  setSelectedWard: jest.fn,
  wardSummary: {
    totalPatients: 27,
  },
  setWardSummary: jest.fn,
};

jest.mock("swiper/react", () => ({
  Swiper: ({ children }) => children,
  SwiperSlide: ({ children }) => children,
}));
jest.mock("swiper/modules", () => ({
  Pagination: (props) => [props],
}));
jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/pagination", () => jest.fn());

jest.mock("../utils/CareViewSummary", () => {
  return {
    getWardDetails: () => mockGetWardDetails(),
    fetchWardSummary: () => mockFetchWardSummary(),
    getSlidesPerView: () => mockGetSliderPerView(),
  };
});

describe("CareViewSummary", function () {
  it("should render Dropdown and summary tiles", () => {
    mockGetWardDetails.mockReturnValue(mockWardList);
    mockFetchWardSummary.mockReturnValue({
      totalPatients: 27,
    });
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewSummary callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );
    expect(container.querySelector(".bx--list-box__wrapper")).toBeTruthy();
    expect(container.querySelectorAll(".summary-tile")).toBeTruthy();
    expect(container.querySelectorAll(".summary-tile").length).toEqual(5);
  });

  it("should display the total patient count", () => {
    mockGetWardDetails.mockReturnValue(mockWardList);
    mockFetchWardSummary.mockReturnValue({
      totalPatients: 27,
    });
    const { getByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewSummary callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );
    expect(getByText("27")).toBeTruthy();
  });
});
