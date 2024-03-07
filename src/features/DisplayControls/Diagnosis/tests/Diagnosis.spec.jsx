import { render, waitFor, screen } from "@testing-library/react";
import React from "react";
import Diagnosis from "../components/Diagnosis";
import { getPatientDiagnosis } from "../utils/DiagnosisUtils";
import { IPDContext } from "../../../../context/IPDContext";
import { mockVisitSummaryData } from "../../Allergies/components/AllergiesTestUtils";
import {
  mockDiagnosisDataOne,
  mockDiagnosisDataTwo,
} from "./DiagnosisMockData";

const headers = [
  {
    id: "1",
    header: "Diagnosis",
    key: "diagnosis",
    isSortable: false,
  },
  {
    id: "4",
    header: "Status",
    key: "status",
    isSortable: true,
  },
  {
    id: "6",
    header: "Diagnosis Date ",
    key: "diagnosisDate",
    isSortable: true,
  },
];

jest.mock("../utils/DiagnosisUtils", () => ({
  getPatientDiagnosis: jest.fn(),
  diagnosisHeaders: headers,
}));

describe("Diagnosis", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should show no Diagnosis message if no diagnosis are captured for that patient", async () => {
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve([]);
    });
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Diagnosis patientId="__test_patient_uuid__" />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No Diagnosis found for this patient")
      ).toBeTruthy();
    });
  });

  it("should show table skeleton on loading", async () => {
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve(mockDiagnosisDataOne);
    });
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Diagnosis patientId="__test_patient_uuid__" />
      </IPDContext.Provider>
    );

    expect(screen.getByTestId("diagnosis-datatable-skeleton")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByTestId("expandable-datatable")).toBeTruthy();
    });

    expect(screen.queryByTestId("diagnosis-datatable-skeleton")).toBeFalsy();
  });

  it("should show diagnosis data in the table", async () => {
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve(mockDiagnosisDataTwo);
    });
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Diagnosis patientId="__test_patient_uuid__" />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("expandable-datatable")).toBeTruthy();
    });
    expect(screen.getByText("Arthropathy")).toBeTruthy();
    expect(screen.getByText("Inactive")).toBeTruthy();
    expect(screen.getByText("26 Oct 2023")).toBeTruthy();
    expect(screen.getByText("27 Oct 2023")).toBeTruthy();
  });

  it("should show diagnosis data exclusively for current and previous dates if it pertains to an inactive inpatient visit", async () => {
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve(mockDiagnosisDataOne);
    });
    render(
      <IPDContext.Provider
        value={{
          visitSummary: {
            ...mockVisitSummaryData,
            stopDateTime: 1698316200000,
          },
        }}
      >
        <Diagnosis patientId="__test_patient_uuid__" />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("expandable-datatable")).toBeTruthy();
    });
    expect(screen.queryByText("Arthropathy")).toBeTruthy();
    expect(screen.queryByText("Inactive")).toBeTruthy();
    expect(screen.queryByText("26 Oct 2023")).toBeTruthy();
    expect(screen.queryByText("Reactive arthropathy")).toBeFalsy();
    expect(screen.queryByText("27 Oct 2023")).toBeFalsy();
  });
});
