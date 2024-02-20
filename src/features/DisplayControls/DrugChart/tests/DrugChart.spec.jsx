import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import DrugChart from "../components/DrugChart";
import { drugChartData, mockDrugChartDataLarge } from "./DrugChartMockData";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";

const mockCalendar = jest.fn();
jest.mock("../components/CalendarHeader", () => {
  return function CalendarHeader() {
    return <div>CalendarHeader</div>;
  };
});

jest.mock("../components/DrugList", () => {
  return function DrugList() {
    return (
      <div>
        <table style={{ overflow: "hidden" }}>
          <tbody>
            {mockDrugChartDataLarge.map((drugDetail, index) => {
              return (
                <tr key={index}>
                  <div>mockDrugList</div>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
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

const renderDrugChart = () => {
  return render(
    <IPDContext.Provider value={{ config: mockConfig }}>
      <DrugChart drugChartData={drugChartData} />
    </IPDContext.Provider>
  );
};

describe("DrugChart", () => {
  it("should match snapshot", () => {
    const { asFragment } = renderDrugChart();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should call register pane when ref is on rightpane", () => {
    const { getByTestId } = renderDrugChart();
    const rightPanel = getByTestId("right-panel");
    expect(mockRegisterPane).toHaveBeenCalledWith(rightPanel);
  });

  it("should  unregisterPane when component is  unmounted", () => {
    const { unmount } = renderDrugChart();
    unmount();
    expect(mockUnregisterPane).toHaveBeenCalled();
  });

  it("should synchronize scroll position of the right panel and the left panel when scrolled to bottom", () => {
    const { getByTestId } = renderDrugChart();
    const leftPanel = getByTestId("left-panel");
    const rightPanel = getByTestId("right-panel");
    leftPanel.scrollBottom = 100;
    rightPanel.scrollBottom = 100;
    expect(leftPanel.scrollBottom).toEqual(rightPanel.scrollBottom);
  });
  describe("Drug chart left pannel", () => {
    it("should have the up arrow button initially disabled and down arrow button enabled if the list has more than ten items", () => {
      const { getByTestId } = render(
        <DrugChart drugChartData={mockDrugChartDataLarge} />
      );
      const upArrowButton = getByTestId("up-arrow");
      const downArrowButton = getByTestId("down-arrow");

      expect(upArrowButton).toHaveAttribute("disabled");
      expect(downArrowButton).not.toHaveAttribute("disabled");
    });

    it("should disable both buttons when list has less than 10 items", () => {
      const { getByTestId } = render(
        <DrugChart drugChartData={drugChartData} />
      );
      const upArrowButton = getByTestId("up-arrow");
      const downArrowButton = getByTestId("down-arrow");

      expect(upArrowButton).toHaveAttribute("disabled");
      expect(downArrowButton).toHaveAttribute("disabled");
    });

    it("should enable the up arrow button when scrolling down", async () => {
      const { getByTestId } = render(
        <DrugChart drugChartData={mockDrugChartDataLarge} />
      );
      const leftPanelElement = getByTestId("left-panel");

      fireEvent.scroll(leftPanelElement, { target: { scrollTop: 200 } });

      await waitFor(() => {
        const upArrowButton = getByTestId("up-arrow");
        expect(upArrowButton).not.toHaveAttribute("disabled");
      });
    });

    it("should disable the down arrow button when reaching the end of scrolling", async () => {
      const { getByTestId } = render(
        <DrugChart drugChartData={mockDrugChartDataLarge} />
      );
      const leftPanelElement = getByTestId("left-panel");

      leftPanelElement.scrollTop =
        leftPanelElement.scrollHeight - leftPanelElement.clientHeight;

      fireEvent.scroll(leftPanelElement);

      await waitFor(() => {
        const downArrowButton = getByTestId("down-arrow");
        expect(downArrowButton).toHaveAttribute("disabled");
      });
    });

    it("should scroll down smoothly when clicking the down arrow button", async () => {
      const { getByTestId } = render(
        <DrugChart drugChartData={mockDrugChartDataLarge} />
      );
      const leftPanelElement = getByTestId("left-panel");
      const downArrowButton = getByTestId("down-arrow");

      fireEvent.scroll(leftPanelElement, { target: { scrollTop: 1 } });
      fireEvent.click(downArrowButton);

      await waitFor(() => {
        expect(leftPanelElement.scrollTop).toBeGreaterThan(0);
      });
    });

    it("should scroll up when clicking on the up arrow button", async () => {
      const { getByTestId } = render(
        <DrugChart drugChartData={mockDrugChartDataLarge} />
      );
      const leftPanelElement = getByTestId("left-panel");
      const upArrowButton = getByTestId("up-arrow");

      fireEvent.scroll(leftPanelElement, { target: { scrollTop: 66 } });
      fireEvent.click(upArrowButton);

      await waitFor(() => {
        expect(leftPanelElement.scrollTop).toBeLessThan(66);
      });
    });
  });
});
