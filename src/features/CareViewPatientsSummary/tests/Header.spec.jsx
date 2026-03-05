import { Header } from "../components/Header";
import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { CareViewContext } from "../../../context/CareViewContext";
import { TASK_FILTER_HEADER } from "../../../constants";
import { IntlProvider } from "react-intl";

const mockSetTaskFilterType = jest.fn();

const makeContext = (overrides = {}) => ({
  ipdConfig: { enable24HourTime: true },
  taskFilterType: TASK_FILTER_HEADER.ALL,
  setTaskFilterType: mockSetTaskFilterType,
  ...overrides,
});

const defaultNavHourEpoch = {
  startHourEpoch: 1710504000,
  endHourEpoch: 1710511200,
};

describe("Header", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render header component", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={makeContext()}>
          <Header
            timeframeLimitInHours={2}
            navHourEpoch={defaultNavHourEpoch}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render header details correctly", () => {
    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={makeContext()}>
          <Header
            timeframeLimitInHours={2}
            navHourEpoch={defaultNavHourEpoch}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    expect(queryByTestId("slot-details-header-0")).toBeTruthy();
    expect(queryByTestId("time-frame-0")).toHaveTextContent("12:00");
    expect(queryByTestId("time-frame-1")).toHaveTextContent("13:00");
    expect(queryByTestId("time-frame-2")).toBeNull();
  });

  it("should render header details correctly for 12 hour format", () => {
    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={makeContext({ ipdConfig: { enable24HourTime: false } })}
        >
          <Header
            timeframeLimitInHours={2}
            navHourEpoch={defaultNavHourEpoch}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    expect(queryByTestId("slot-details-header-0")).toBeTruthy();
    expect(queryByTestId("time-frame-0")).toHaveTextContent("12:00 PM");
    expect(queryByTestId("time-frame-1")).toHaveTextContent("01:00 PM");
    expect(queryByTestId("time-frame-2")).toBeNull();
  });

  it("should render All, New and Pending filter tabs in patient-details-header", () => {
    render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={makeContext()}>
          <Header
            timeframeLimitInHours={2}
            navHourEpoch={defaultNavHourEpoch}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    expect(screen.getByTestId("patient-details-header")).toBeTruthy();
    expect(screen.getByTestId("task-filter-switcher")).toBeTruthy();
    expect(screen.getByText("All")).toBeTruthy();
    expect(screen.getByText("New")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("should call setTaskFilterType with ALL when All tab is clicked", () => {
    render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={makeContext({ taskFilterType: TASK_FILTER_HEADER.NEW })}
        >
          <Header
            timeframeLimitInHours={2}
            navHourEpoch={defaultNavHourEpoch}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    fireEvent.click(screen.getByText("All"));
    expect(mockSetTaskFilterType).toHaveBeenCalledWith(TASK_FILTER_HEADER.ALL);
  });

  it("should call setTaskFilterType with NEW when New tab is clicked", () => {
    render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={makeContext()}>
          <Header
            timeframeLimitInHours={2}
            navHourEpoch={defaultNavHourEpoch}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    fireEvent.click(screen.getByText("New"));
    expect(mockSetTaskFilterType).toHaveBeenCalledWith(TASK_FILTER_HEADER.NEW);
  });

  it("should call setTaskFilterType with PENDING when Pending tab is clicked", () => {
    render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={makeContext()}>
          <Header
            timeframeLimitInHours={2}
            navHourEpoch={defaultNavHourEpoch}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    fireEvent.click(screen.getByText("Pending"));
    expect(mockSetTaskFilterType).toHaveBeenCalledWith(
      TASK_FILTER_HEADER.PENDING
    );
  });
});
