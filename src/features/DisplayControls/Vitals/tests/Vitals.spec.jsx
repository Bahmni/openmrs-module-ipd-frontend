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

jest.mock("../utils/VitalsUtils", () => {
  const originalModule = jest.requireActual("../utils/VitalsUtils");
  return {
    ...originalModule,
    getPatientVitals: jest.fn(),
    getPatientVitalsHistory: jest.fn(),
  };
});

describe("Vitals", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays vital and biometrics history after data is fetched", async () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    getPatientVitalsHistory.mockResolvedValueOnce(mockVitalsHistoryData);
    const { container } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
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
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
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
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
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
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
    );
  });

  it("calls getPatientVitals on mount", () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
    );
    expect(getPatientVitals).toHaveBeenCalledWith(
      "123",
      mockConfig.vitalsConfig.latestVitalsConceptValues
    );
  });

  it("displays loading skeleton while fetching data", () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <Vitals patientId="123" />
      </IPDContext.Provider>
    );
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });
});
