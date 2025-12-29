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
import { I18nProvider } from "../../../../features/i18n/I18nProvider";

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
    getPatientVitals.mockResolvedValue(mockVitalsData);
    getPatientVitalsHistory.mockResolvedValue(mockVitalsHistoryData);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays vital and biometrics history after data is fetched", async () => {
    let container;
    await act(async () => {
      container = render(
        <I18nProvider>
          <IPDContext.Provider value={{ config: mockConfig }}>
            <Vitals patientId="123" />
          </IPDContext.Provider>
        </I18nProvider>
      ).container;
    });

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
    let container;
    await act(async () => {
      container = render(
        <I18nProvider>
          <IPDContext.Provider value={{ config: mockConfig }}>
            <Vitals patientId="123" />
          </IPDContext.Provider>
        </I18nProvider>
      ).container;
    });
    await waitFor(() => {
      expect(screen.getByText(/Temp/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  it("should display text when vitals is not present", async () => {
    getPatientVitals.mockResolvedValueOnce(mockNoVitalsData);
    getPatientVitalsHistory.mockResolvedValueOnce(mockVitalsHistoryData);
    await act(async () => {
      render(
        <I18nProvider>
          <IPDContext.Provider value={{ config: mockConfig }}>
            <Vitals patientId="123" />
          </IPDContext.Provider>
        </I18nProvider>
      );
    });
    await waitFor(() =>
      expect(
        screen.getByText("No Vitals available for this patient")
      ).toBeTruthy()
    );
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <I18nProvider>
          <IPDContext.Provider value={{ config: mockConfig }}>
            <Vitals patientId="123" />
          </IPDContext.Provider>
        </I18nProvider>
      );
    });
  });

  it("calls getPatientVitals on mount", async () => {
    await act(async () => {
      render(
        <I18nProvider>
          <IPDContext.Provider value={{ config: mockConfig }}>
            <Vitals patientId="123" />
          </IPDContext.Provider>
        </I18nProvider>
      );
    });
    expect(getPatientVitals).toHaveBeenCalledWith(
      "123",
      mockConfig.vitalsConfig.latestVitalsConceptValues
    );
  });

  it("displays loading skeleton while fetching data", async () => {
    // Mock with a promise that never resolves to keep component in loading state
    getPatientVitals.mockImplementationOnce(
      () => new Promise(() => {})
    );
    getPatientVitalsHistory.mockImplementationOnce(
      () => new Promise(() => {})
    );
    await act(async () => {
      render(
        <I18nProvider>
          <IPDContext.Provider value={{ config: mockConfig }}>
            <Vitals patientId="123" />
          </IPDContext.Provider>
        </I18nProvider>
      );
    });
    expect(screen.queryByTestId("header-loading")).toBeTruthy();
  });
});
