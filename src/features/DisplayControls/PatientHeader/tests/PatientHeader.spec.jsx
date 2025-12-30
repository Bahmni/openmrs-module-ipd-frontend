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
import { IntlProvider } from "react-intl";
import { mockUserWithAllRequiredPrivileges, mockUserWithoutADTPrivilege } from "../../../../utils/mockUserData";
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
jest.mock("../../../../utils/DateTimeUtils", () => ({
  getAgeInYearsMonthsDays: (birthDate) => {
    if (birthDate === "1991-01-01") {
      return "34 Years, 4 Months, 18 Days";
    }
    return "";
  },
  formatDate: (date) => {
    if (date === "1991-01-01") {
      return "01 Jan 1991";
    }
    return date;
  },
}));

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
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
        >
          <PatientHeader patientId="123" />
        </IPDContext.Provider>
      </IntlProvider>
    );
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });

  it("should call fetchPatientInfo on mount", () => {
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
        >
          <PatientHeader patientId="123" />
        </IPDContext.Provider>
      </IntlProvider>
    );
    expect(mockFetchPatientProfile).toHaveBeenCalledWith("123");
  });

  it("should display loading skeleton while fetching data", () => {
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
        >
          <PatientHeader patientId="123" />
        </IPDContext.Provider>
      </IntlProvider>
    );
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });

  it("should display patient details after data is fetched", async () => {
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
        >
          <PatientHeader patientId="123" />
        </IPDContext.Provider>
      </IntlProvider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    expect(screen.getByText(/34 Years, 4 Months, 18 Days/i)).toBeTruthy();
    expect(screen.getByText("01 Jan 1991")).toBeTruthy();
    expect(screen.getByText(/12345/i)).toBeTruthy();
  });

  it("should display all details of the patient", async () => {
    const { container } = render(
      <IntlProvider locale="en">
      <IPDContext.Provider
        value={{
          isReadMode: false,
          visitSummary: { uuid: "123" },
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
          <PatientHeader patientId="123" setPatientDetailsOpen={jest.fn} />
        </IPDContext.Provider>
      </IntlProvider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    const showDetailsButton = screen.getByText("Show Details");
    fireEvent.click(showDetailsButton);

    await waitFor(() => {
      const addressSpans = container.querySelectorAll('.details-value');
      const found = Array.from(addressSpans).some(span =>
        /country/i.test(span.textContent) && /ethiopia/i.test(span.textContent)
      );
      expect(found).toBe(true);
      expect(container).toMatchSnapshot();
    });
  });

  it("should display patient movement item on click of overflow menu icon", async () => {
    const { container } = render(
  <IntlProvider locale="en">   
      <IPDContext.Provider
        value={{
          isReadMode: false,
          visitSummary: { uuid: "123" },
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
      </IntlProvider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    screen.getByTestId("overflow-menu").click();
    expect(screen.getByText("Patient Movement")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it("should not display patient movement when adt privilege is not assigned to patient", async () => {
    const { container } = render(
      <IPDContext.Provider
        value={{
          isReadMode: false,
          visitSummary: { uuid: "123" },
          currentUser: mockUserWithoutADTPrivilege,
        }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    expect(screen.queryByTestId("overflow-menu")).toBeFalsy();
  });

  it("should display patient movement overflow menu item as disabled", async () => {
    const { container } = render(
      <IntlProvider locale="en">
      <IPDContext.Provider
        value={{
          isReadMode: true,
          visitSummary: { uuid: "123" },
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <PatientHeader patientId="123" />
      </IPDContext.Provider>
      </IntlProvider> 
    );
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    screen.getByTestId("overflow-menu").click();
    const patientMovementButton = screen.getByTestId("overflow-menu-item1");
    expect(patientMovementButton.disabled).toEqual(true);
    expect(container).toMatchSnapshot();
  });

  it("should display bed and ward information in patient header", async () => {
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{ isReadMode: false, visitSummary: { uuid: "123" } }}
        >
          <PatientHeader patientId="123" />
        </IPDContext.Provider>
      </IntlProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeTruthy();
    });
    expect(screen.getByText("General Ward -ICU ICU1")).toBeTruthy();
  });
});
