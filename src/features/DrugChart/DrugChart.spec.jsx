import React from "react";
import { render } from "@testing-library/react";
import DrugChart from "./DrugChart";
import { drugChartData } from "./DrugChartMockData";

const mockCalendar = jest.fn();
jest.mock("../CalendarHeader/CalendarHeader", () => {
  return function CalendarHeader() {
    return <div>CalendarHeader</div>;
  };
});

jest.mock("../Calendar/Calendar", () => {
  return function Calendar(props) {
    mockCalendar(props);
    return <div>Calendar</div>;
  };
});

const mockRegisterPane = jest.fn();
const mockUnregisterPane = jest.fn();

jest.mock("react-scroll-sync-hook", () => {
  return function useScrollSync() {
    return {
      registerPane: mockRegisterPane,
      unregisterPane: mockUnregisterPane,
    };
  };
});

describe("DrugChart", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<DrugChart drugChartData={drugChartData} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should call register pane when ref is on rightpane", () => {
    const { getByTestId } = render(<DrugChart drugChartData={drugChartData} />);
    const rightPanel = getByTestId("right-panel");
    expect(mockRegisterPane).toHaveBeenCalledWith(rightPanel);
  });

  it("should  unregisterPane when component is  unmounted", () => {
    const { unmount } = render(<DrugChart drugChartData={drugChartData} />);
    unmount();
    expect(mockUnregisterPane).toHaveBeenCalled();
  });

  it("should synchronize scroll position of the right panel and the left panel when scrolled to bottom", () => {
    const { getByTestId } = render(<DrugChart drugChartData={drugChartData} />);
    const leftPanel = getByTestId("left-panel");
    const rightPanel = getByTestId("right-panel");
    leftPanel.scrollBottom = 100;
    rightPanel.scrollBottom = 100;
    expect(leftPanel.scrollBottom).toEqual(rightPanel.scrollBottom);
  });
});
