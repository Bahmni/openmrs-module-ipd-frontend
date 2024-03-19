import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CareViewPatientsSummary } from "../components/CareViewPatientsSummary";
import { mockPatientsList } from "./CareViewPatientsSummaryMock";
import { CareViewContext } from "../../../context/CareViewContext";
import MockDate from "mockdate";
import { mockConfig } from "../../../utils/CommonUtils";
import {
  mockColumnData,
  mockSlotsData,
} from "../../CareViewSummary/tests/CareViewSummaryMock";
import "@testing-library/jest-dom/extend-expect";

const mockContext = {
  careViewConfig: { timeframeLimitInHours: 2 },
  ipdConfig: mockConfig,
};
const mockNavHourEpoch = {
  startHourEpoch: 1704110400,
  endHourEpoch: 1704117600,
};

const mockGetSlotsForPatients = jest.fn();
const mockGetColumnData = jest.fn();
jest.mock("../../CareViewSummary/utils/CareViewSummary", () => {
  return {
    getSlotsForPatients: () => mockGetSlotsForPatients(),
    getColumnData: () => mockGetColumnData(),
  };
});

describe("CareViewPatientsSummary", function () {
  afterEach(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    MockDate.set("2023-01-01T12:00:00");
    mockGetSlotsForPatients.mockReturnValue(mockSlotsData);
    mockGetColumnData.mockReturnValue(mockColumnData);
  });

  it("should match snapshot", () => {
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
        />
      </CareViewContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should fetch slot details on initial render", () => {
    render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
        />
      </CareViewContext.Provider>
    );

    expect(mockGetSlotsForPatients).toHaveBeenCalled();
  });

  it("renders table headers correctly", async () => {
    const { queryByTestId } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(queryByTestId("slot-details-header-0")).toBeTruthy();
      expect(queryByTestId("time-frame-0")).toHaveTextContent("12:00");
      expect(queryByTestId("time-frame-1")).toHaveTextContent("13:00");
      expect(queryByTestId("time-frame-2")).toBeNull();
    });
  });

  it("renders patient details correctly", async () => {
    const { queryByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(queryByText("PT51140")).toBeTruthy();
      expect(
        queryByText("AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu")
      ).toBeTruthy();
      expect(queryByText("A-6")).toBeTruthy();
      expect(queryByText("14")).toBeTruthy();
    });
  });

  it("renders slot details correctly", async () => {
    const { queryAllByText, queryAllByTestId } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(
        queryAllByText("Amoxicillin/Clavulanic Acid 1000 mg Tablet")
      ).toBeTruthy();
      expect(queryAllByTestId("drug-details")[0]).toHaveTextContent(
        "2Tablet(s) | Oral"
      );
    });
  });

  it("should new treatments notification be present under patient details", async () => {
    render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
        />
      </CareViewContext.Provider>
    );
    const careViewPatientDetails = screen.getAllByText(/New treatment/i);
    expect(careViewPatientDetails.length).toBe(1);
  });

  it("should open a targeted tab on click of patient identifier", async () => {
    window.open = jest.fn();
    render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
        />
      </CareViewContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/pt51140/i)).toBeTruthy();
    });
    const targetedTabLink = screen.getByText(/pt51140/i);
    fireEvent.click(targetedTabLink);

    await waitFor(() => {
      screen.debug();
      expect(window.open).toBeTruthy();
      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        "/bahmni/clinical/#/default/patient/17fd50c7-8f9e-48da-b9ed-88c1bd358798/dashboard/visit/ipd/626b822d-741e-4a86-95ff-626eea753c4c/",
        "From Ward to IPD Dashboard"
      );
    });
  });

  it("should open a targeted tab on click of schedule treatments", async () => {
    window.open = jest.fn();
    render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
        />
      </CareViewContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/schedule treatments/i)).toBeTruthy();
    });
    const targetedTabLink = screen.getByText(/schedule treatments/i);
    fireEvent.click(targetedTabLink);

    await waitFor(() => {
      expect(window.open).toBeTruthy();
      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        "/bahmni/clinical/#/default/patient/7278eb93-8c1d-4ef4-bcbf-4c6ee91365f7/dashboard/visit/ipd/626b822d-741e-4a86-95ff-636eea753c2c/",
        "From Ward to IPD Dashboard"
      );
    });
  });
});
