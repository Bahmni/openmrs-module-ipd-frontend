import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { PatientHeader } from "../components/PatientHeader";
import { fetchPatientInfo } from "../utils/PatientHeaderUtils";

jest.mock("../utils/PatientHeaderUtils");

describe("PatientHeader", () => {
  beforeEach(() => {
    fetchPatientInfo.mockResolvedValue({
      person: {
        preferredName: {
          display: "John Doe",
        },
        age: 30,
        birthdate: "1991-01-01",
        gender: "M",
      },
      identifiers: [
        {
          identifier: "12345",
        },
      ],
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders without crashing", () => {
    render(<PatientHeader patientId="123" />);
  });

  it("calls fetchPatientInfo on mount", () => {
    render(<PatientHeader patientId="123" />);
    expect(fetchPatientInfo).toHaveBeenCalledWith("123");
  });

  it("displays loading skeleton while fetching data", () => {
    render(<PatientHeader patientId="123" />);
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });

  it("displays patient details after data is fetched", async () => {
    render(<PatientHeader patientId="123" />);
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    expect(screen.getByText(/30 Years/i)).toBeTruthy();
    expect(screen.getByText("01/01/1991")).toBeTruthy();
    expect(screen.getByText(/12345/i)).toBeTruthy();
  });
});
