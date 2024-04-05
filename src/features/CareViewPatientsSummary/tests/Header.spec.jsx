import { Header } from "../components/Header";
import { render } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { CareViewContext } from "../../../context/CareViewContext";

describe("Header", () => {
  it("should render header component", () => {
    const { container } = render(
      <CareViewContext.Provider value={{ipdConfig : {enable24HourTime : true}}}>  <Header
        timeframeLimitInHours={2}
        navHourEpoch={{
          startHourEpoch: 1710504000,
          endHourEpoch: 1710511200,
        }}
      /></CareViewContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render header details correctly", () => {
    const { queryByTestId } = render(
      <CareViewContext.Provider value={{ipdConfig : {enable24HourTime : true}}}><Header
        timeframeLimitInHours={2}
        navHourEpoch={{
          startHourEpoch: 1710504000,
          endHourEpoch: 1710511200,
        }}
      /></CareViewContext.Provider>
    );
    expect(queryByTestId("slot-details-header-0")).toBeTruthy();
    expect(queryByTestId("time-frame-0")).toHaveTextContent("12:00");
    expect(queryByTestId("time-frame-1")).toHaveTextContent("13:00");
    expect(queryByTestId("time-frame-2")).toBeNull();
  });

  it("should render header details correctly for 12 hour format", () => {
    const { queryByTestId } = render(
      <CareViewContext.Provider value={{ipdConfig : {enable24HourTime : false}}}><Header
        timeframeLimitInHours={2}
        navHourEpoch={{
          startHourEpoch: 1710504000,
          endHourEpoch: 1710511200,
        }}
      /></CareViewContext.Provider>
    );
    expect(queryByTestId("slot-details-header-0")).toBeTruthy();
    expect(queryByTestId("time-frame-0")).toHaveTextContent("12:00 PM");
    expect(queryByTestId("time-frame-1")).toHaveTextContent("01:00 PM");
    expect(queryByTestId("time-frame-2")).toBeNull();
  });
});
