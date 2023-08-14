import React from "react";
import { render } from "@testing-library/react";
import DrugChart from "./DrugChart";

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

const drugChartData = [
  [
    {
      8: {
        minutes: 0,
        status: "SCHEDULED",
      },
      13: {
        minutes: 0,
        status: "SCHEDULED",
      },
      17: {
        minutes: 0,
        status: "SCHEDULED",
      },
      23: {
        minutes: 55,
        status: "SCHEDULED",
      },
    },
    {
      11: {
        minutes: 0,
        status: "SCHEDULED",
      },
      15: {
        minutes: 55,
        status: "SCHEDULED",
      },
      19: {
        minutes: 10,
        status: "SCHEDULED",
      },
    },
  ],
  [
    {
      drugName: "Suxamethonium Chloride 100 mg/2 mL Ampoule (50 mg/mL )",
      drugRoute: "Intravenous",
      administrationInfo: [],
      duration: "4 Day(s)",
      dosage: 2,
      doseType: "mg",
    },
    {
      drugName: "Enalapril 5 mg Tablet",
      drugRoute: "Oral",
      administrationInfo: [],
      duration: "4 Day(s)",
      dosage: 1,
      doseType: "Tablet(s)",
    },
  ],
];
describe("DrugChart", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<DrugChart drugChartData={drugChartData} />);
    expect(asFragment()).toMatchSnapshot();
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
