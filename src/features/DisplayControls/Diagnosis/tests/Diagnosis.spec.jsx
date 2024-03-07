import { render, waitFor, screen } from "@testing-library/react";
import React from "react";
import Diagnosis from "../components/Diagnosis";
import { getPatientDiagnosis } from "../utils/DiagnosisUtils";
import { IPDContext } from "../../../../context/IPDContext";
import { mockVisitSummaryData } from "../../Allergies/components/AllergiesTestUtils";

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

const mockDiagnosisDataOne = {
  order: "PRIMARY",
  certainty: "CONFIRMED",
  codedAnswer: {
    uuid: "diagnosis-one",
    name: "Reactive arthropathy",
  },
  diagnosisDateTime: 1698412200000,
  providers: [
    {
      name: "Provider Two",
    },
  ],
  diagnosisStatusConcept: null,
};

const mockDiagnosisDataTwo = {
  order: "PRIMARY",
  certainty: "PRESUMED",
  codedAnswer: {
    uuid: "diagnosis-two",
    name: "Arthropathy",
  },
  diagnosisDateTime: 1698308917000,
  providers: [
    {
      name: "Provider One",
    },
  ],
  diagnosisStatusConcept: {
    name: "Ruled Out Diagnosis",
  },
};

const mockFetchVisitSummary = jest.fn();
jest.mock("../../PatientHeader/utils/PatientMovementModalUtils", () => ({
  fetchVisitSummary: () => mockFetchVisitSummary(),
}));

describe("Diagnosis", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    mockFetchVisitSummary.mockReturnValue(mockVisitSummaryData);
  });

  it("should show no Diagnosis message if no diagnosis are captured for that patient", async () => {
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve([]);
    });
    render(
      <IPDContext.Provider
        value={{
          visit: "44832301-a09e-4bbb-b521-47144ed302cb",
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
      return Promise.resolve([mockDiagnosisDataOne, mockDiagnosisDataTwo]);
    });
    const { getByTestId, queryByTestId } = render(
      <IPDContext.Provider
        value={{
          visit: "44832301-a09e-4bbb-b521-47144ed302cb",
        }}
      >
        <Diagnosis patientId="__test_patient_uuid__" />
      </IPDContext.Provider>
    );

    expect(getByTestId("diagnosis-datatable-skeleton")).toBeTruthy();

    await waitFor(() => {
      expect(getByTestId("expandable-datatable")).toBeTruthy();
    });

    expect(queryByTestId("diagnosis-datatable-skeleton")).toBeFalsy();
  });

  it("should show diagnosis data in the table", async () => {
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve([
        {
          order: "PRIMARY",
          certainty: "CONFIRMED",
          codedAnswer: {
            uuid: "diagnosis-one",
            name: "Reactive arthropathy",
          },
          diagnosisDateTime: 1698412200000,
          providers: [
            {
              name: "Provider Two",
            },
          ],
          diagnosisStatusConcept: null,
        },
        {
          order: "PRIMARY",
          certainty: "PRESUMED",
          codedAnswer: {
            uuid: "diagnosis-two",
            name: "Arthropathy",
          },
          diagnosisDateTime: 1698308917000,
          providers: [
            {
              name: "Provider One",
            },
          ],
          diagnosisStatusConcept: {
            name: "Ruled Out Diagnosis",
          },
        },
      ]);
    });
    render(
      <IPDContext.Provider
        value={{
          visit: "44832301-a09e-4bbb-b521-47144ed302cb",
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
    mockFetchVisitSummary.mockReturnValue({
      ...mockVisitSummaryData,
      data: { ...mockVisitSummaryData.data, stopDateTime: 1698316200000 },
    });
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve([mockDiagnosisDataOne, mockDiagnosisDataTwo]);
    });
    const { queryByText } = render(
      <IPDContext.Provider
        value={{
          visit: "44832301-a09e-4bbb-b521-47144ed302cb",
        }}
      >
        <Diagnosis patientId="__test_patient_uuid__" />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("expandable-datatable")).toBeTruthy();
    });
    expect(queryByText("Arthropathy")).toBeTruthy();
    expect(queryByText("Inactive")).toBeTruthy();
    expect(queryByText("26 Oct 2023")).toBeTruthy();
    expect(queryByText("Reactive arthropathy")).toBeFalsy();
    expect(queryByText("27 Oct 2023")).toBeFalsy();
  });
});
