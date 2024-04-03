import React from "react";
import { render } from "@testing-library/react";
import CalendarHeader from "../components/CalendarHeader";
import { currentShiftHoursArray } from "../utils/DrugChartUtils";
import MockDate from "mockdate";
import { IPDContext } from "../../../../context/IPDContext";
import {
  mockConfig,
  mockConfigFor12HourFormat,
} from "../../../../utils/CommonUtils";

describe("CalendarHeader", () => {
  it("should match snapshot", () => {
    MockDate.set("2023-12-22T00:00:00.000+0530");
    const currentShiftArray = [
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];
    const { container } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <CalendarHeader currentShiftArray={currentShiftArray} />
      </IPDContext.Provider>
    );
    expect(container).toMatchSnapshot();
    MockDate.reset();
  });
  it("should render shiftHours hours", () => {
    MockDate.set("2024-01-05 10:00");
    const currentShiftArray = [
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];
    const shiftDetails = {
      1: { shiftStartTime: "06:00", shiftEndTime: "18:00" },
      2: { shiftStartTime: "18:00", shiftEndTime: "06:00" },
    };
    const { getAllByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <CalendarHeader currentShiftArray={currentShiftArray} />
      </IPDContext.Provider>
    );
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(
      currentShiftHoursArray(new Date(), shiftDetails).currentShiftHoursArray
        .length
    );
    MockDate.reset();
  });

  it("should render shiftHours hours when time in 12 hour format - half hour shift time scenario", () => {
    MockDate.set("2024-01-05 10:00");
    const currentShiftArray = [
      "06:30",
      "07:30",
      "08:30",
      "09:30",
      "10:30",
      "11:30",
      "12:30",
      "13:30",
      "14:30",
      "15:30",
      "16:30",
      "17:30",
    ];
    const shiftDetails = {
      1: { shiftStartTime: "06:30", shiftEndTime: "18:00" },
      2: { shiftStartTime: "18:00", shiftEndTime: "06:30" },
    };
    const { getAllByTestId, getByText } = render(
      <IPDContext.Provider value={{ config: mockConfigFor12HourFormat }}>
        <CalendarHeader currentShiftArray={currentShiftArray} />
      </IPDContext.Provider>
    );
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(
      currentShiftHoursArray(new Date(), shiftDetails).currentShiftHoursArray
        .length
    );
    expect(getByText(/02:30 PM/)).toBeTruthy();
    MockDate.reset();
  });
});
