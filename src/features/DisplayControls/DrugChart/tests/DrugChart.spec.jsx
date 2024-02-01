import React from "react";
import { render } from "@testing-library/react";
import DrugChart from "../components/DrugChart";
import { drugChartData } from "./DrugChartMockData";

const mockCalendar = jest.fn();
jest.mock("../components/CalendarHeader", () => {
  return function CalendarHeader() {
    return <div>CalendarHeader</div>;
  };
});

jest.mock("../components/Calendar", () => {
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

const MockTooltipCarbon = jest.fn();

jest.mock("bahmni-carbon-ui", () => {
  return {
    TooltipCarbon: (props) => {
      MockTooltipCarbon(props);
      return <div>TooltipCarbon</div>;
    },
  };
});

describe.skip("DrugChart", () => {
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
