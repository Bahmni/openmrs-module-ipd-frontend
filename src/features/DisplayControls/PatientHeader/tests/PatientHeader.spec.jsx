import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { PatientHeader } from "../components/PatientHeader";
import {
  contactConfigMockData,
  addressMappingMockData,
  patientProfileMockData,
} from "./PatientHeaderMockData";

const mockFetchPatientProfile = jest.fn();
const mockContactDetailsConfig = jest.fn();
const mockFetchAddressMapping = jest.fn();

jest.mock("../utils/PatientHeaderUtils", () => {
  const originalModule = jest.requireActual("../utils/PatientHeaderUtils");
  return {
    ...originalModule,
    fetchPatientProfile: () => mockFetchPatientProfile("123"),
    getConfigsForPatientContactDetails: () => mockContactDetailsConfig(),
    fetchAddressMapping: () => mockFetchAddressMapping(),
  };
});

describe("PatientHeader", () => {
  beforeEach(() => {
    mockContactDetailsConfig.mockResolvedValue(contactConfigMockData);
    mockFetchPatientProfile.mockResolvedValue(patientProfileMockData);
    mockFetchAddressMapping.mockResolvedValue(addressMappingMockData);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render without crashing", () => {
    render(<PatientHeader patientId="123" />);
  });

  it("should call fetchPatientInfo on mount", () => {
    render(<PatientHeader patientId="123" />);
    expect(mockFetchPatientProfile).toHaveBeenCalledWith("123");
  });

  it("should display loading skeleton while fetching data", () => {
    render(<PatientHeader patientId="123" />);
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });

  it("should display patient details after data is fetched", async () => {
    render(<PatientHeader patientId="123" />);
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    expect(screen.getByText(/30 Years/i)).toBeTruthy();
    expect(screen.getByText("01 Jan 1991")).toBeTruthy();
    expect(screen.getByText(/12345/i)).toBeTruthy();
  });

  it("should display all details of the patient", async () => {
    const { container } = render(<PatientHeader patientId="123" />);
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    const showDetailsButton = screen.getByText("Show Details");
    fireEvent.click(showDetailsButton);

    await waitFor(() => {
      expect(screen.getByText(/Country : Ethiopia/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
});
