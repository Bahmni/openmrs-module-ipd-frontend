import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { PatientHeader } from "../components/PatientHeader";
import {
  contactConfigMockData,
  addressMappingMockData,
  patientProfileMockData,
  bedInformation,
} from "./PatientHeaderMockData";
import { IPDContext } from "../../../../context/IPDContext";
const mockFetchPatientProfile = jest.fn();
const mockContactDetailsConfig = jest.fn();
const mockFetchAddressMapping = jest.fn();
const mockBedInformation = jest.fn();

jest.mock("../utils/PatientHeaderUtils", () => {
  const originalModule = jest.requireActual("../utils/PatientHeaderUtils");
  return {
    ...originalModule,
    fetchPatientProfile: () => mockFetchPatientProfile("123"),
    getConfigsForPatientContactDetails: () => mockContactDetailsConfig(),
    fetchAddressMapping: () => mockFetchAddressMapping(),
    getBedInformation: () => mockBedInformation("123", "123"),
  };
});

describe("PatientHeader", () => {
  beforeEach(() => {
    mockContactDetailsConfig.mockResolvedValue(contactConfigMockData);
    mockFetchPatientProfile.mockResolvedValue(patientProfileMockData);
    mockFetchAddressMapping.mockResolvedValue(addressMappingMockData);
    mockBedInformation.mockResolvedValue(bedInformation);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render without crashing", () => {
    render(
      <IPDContext.Provider
        value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
    );
  });

  it("should call fetchPatientInfo on mount", () => {
    render(
      <IPDContext.Provider
        value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
    );
    expect(mockFetchPatientProfile).toHaveBeenCalledWith("123");
  });

  it("should display loading skeleton while fetching data", () => {
    render(
      <IPDContext.Provider
        value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
    );
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });

  it("should display patient details after data is fetched", async () => {
    render(
      <IPDContext.Provider
        value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    expect(screen.getByText(/30 Years/i)).toBeTruthy();
    expect(screen.getByText("01 Jan 1991")).toBeTruthy();
    expect(screen.getByText(/12345/i)).toBeTruthy();
  });

  it("should display all details of the patient", async () => {
    const { container } = render(
      <IPDContext.Provider
        value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
      >
        <PatientHeader patientId="123" setPatientDetailsOpen={jest.fn} />
      </IPDContext.Provider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    const showDetailsButton = screen.getByText("Show Details");
    fireEvent.click(showDetailsButton);

    await waitFor(() => {
      expect(screen.getByText(/Country : Ethiopia/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  it("should display patient movement item on click of overflow menu icon", async () => {
    const { container } = render(
      <IPDContext.Provider
        value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    screen.getByTestId("overflow-menu").click();
    expect(screen.getByText("Patient Movement")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it("should display patient movement overflow menu item as disabled", async () => {
    const { container } = render(
      <IPDContext.Provider
        value={{ isReadMode: true, visitSummary: { uuid: "123" } }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    screen.getByTestId("overflow-menu").click();
    const patientMovementButton = screen.getByTestId("overflow-menu-item1");
    expect(patientMovementButton.disabled).toEqual(true);
    expect(container).toMatchSnapshot();
  });

  it("should display bed and ward information in patient header", async () => {
    render(
      <IPDContext.Provider
        value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    expect(screen.getByText("General Ward -ICU ICU1")).toBeTruthy();
  });
});
