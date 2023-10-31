import { render, waitFor, screen } from "@testing-library/react";
import React from "react";
import Diagnosis from "./Diagnosis";
import { getPatientDiagnosis } from "../utils/DiagnosisUtils";

jest.mock("../utils/DiagnosisUtils", () => ({
  getPatientDiagnosis: jest.fn(),
}));

describe("Diagnosis", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should show no Diagnosis message if no diagnosis are captured for that patient", async () => {
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve([]);
    });
    render(<Diagnosis patientId="__test_patient_uuid__" />);
    await waitFor(() => {
      expect(
        screen.getByText("No Diagnosis found for this patient")
      ).toBeTruthy();
    });
  });

  it("should show table skeleton on loading", async () => {
    getPatientDiagnosis.mockImplementation(() => {
      return Promise.resolve([
        {
          order: "PRIMARY",
          certainty: "CONFIRMED",
          codedAnswer: {
            name: "Reactive arthropathy",
          },
          diagnosisDateTime: 1698319572000,
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
    render(<Diagnosis patientId={"__test_patient_uuid__"} />);

    expect(screen.getByTestId("diagnosis-datatable-skeleton")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByTestId("diagnosis-datatable")).toBeTruthy();
    });

    expect(screen.queryByTestId("diagnosis-datatable-skeleton")).toBeFalsy();
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
    render(<Diagnosis patientId={"__test_patient_uuid__"} />);

    await waitFor(() => {
      expect(screen.getByTestId("diagnosis-datatable")).toBeTruthy();
    });
    expect(screen.getByText("Arthropathy")).toBeTruthy();
    expect(screen.getByText("Inactive")).toBeTruthy();
    expect(screen.getByText("10/26/2023")).toBeTruthy();
    expect(screen.getByText("10/27/2023")).toBeTruthy();
  });
});
