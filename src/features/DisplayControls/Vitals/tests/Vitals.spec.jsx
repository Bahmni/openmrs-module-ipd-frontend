import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import React from "react";
import { IPDContext } from "../../../../context/IPDContext";
import Vitals from "../components/Vitals";
import {
  getPatientVitals,
  getPatientVitalsHistory,
} from "../utils/VitalsUtils";
import {
  mockNoVitalsData,
  mockVitalsData,
  mockVitalsHistoryData,
} from "./VitalsMockData";
import { mockConfig } from "../../../../utils/CommonUtils";
import { IntlProvider } from "react-intl";

jest.mock("../utils/VitalsUtils", () => {
  const originalModule = jest.requireActual("../utils/VitalsUtils");
  return {
    ...originalModule,
    getPatientVitals: jest.fn(),
    getPatientVitalsHistory: jest.fn(),
  };
});

describe("Vitals", () => {
  beforeEach(() => {
    localStorage.clear();
    
    // You can mock methods if needed
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'removeItem');
    localStorage.setItem("NG_TRANSLATE_LANG_KEY", "en");

  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays vital and biometrics history after data is fetched", async () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    getPatientVitalsHistory.mockResolvedValueOnce(mockVitalsHistoryData);
    const { container } = render(
      <IntlProvider locale="en">
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Vitals History/i)).toBeTruthy();
    });
    const vitalsHistory = screen.getByText(/Vitals History/i);
    act(() => {
      fireEvent.click(vitalsHistory);
    });
    await waitFor(() => {
      expect(screen.getByText("Pulse (beats/min)")).toBeTruthy();
      expect(screen.getByText(/Nutritional Values/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  it("should display vital details after data is fetched", async () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    getPatientVitalsHistory.mockResolvedValueOnce(mockVitalsHistoryData);
    const { container } = render(
      <IntlProvider locale="en">
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
      </IntlProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Temp/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  it("should display text when vitals is not present", async () => {
    getPatientVitalsHistory.mockResolvedValueOnce(mockVitalsHistoryData);
    getPatientVitals.mockResolvedValueOnce(mockNoVitalsData);
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider value={{ config: mockConfig }}>
          <Vitals patientId="123" />
        </IPDContext.Provider>
      </IntlProvider>
    );
    await waitFor(() =>
      expect(
        screen.getByText("No Vitals available for this patient")
      ).toBeTruthy()
    );
  });

  it("renders without crashing", () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    render(
      <IntlProvider locale="en">
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
      </IntlProvider>
    );
  });

  it("calls getPatientVitals on mount", () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    render(
      <IntlProvider locale="en">
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
      </IntlProvider>
    );
    expect(getPatientVitals).toHaveBeenCalledWith(
      "123",
      mockConfig.vitalsConfig.latestVitalsConceptValues["en"]
    );
  });

  it("displays loading skeleton while fetching data", () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    render(
      <IntlProvider locale="en">
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
      </IntlProvider>
    );
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });
});
