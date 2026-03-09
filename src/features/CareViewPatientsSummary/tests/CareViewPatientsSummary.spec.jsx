import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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
import { IntlProvider } from "react-intl";

const mockContext = {
  careViewConfig: {
    timeframeLimitInHours: 2,
    enableNurseAcknowledgement: true,
  },
  ipdConfig: mockConfig,
};
const mockNavHourEpoch = {
  startHourEpoch: 1704110400,
  endHourEpoch: 1704117600,
};

const mockFilterValue = {
  id: "allTasks",
};
const mockGetSlotsForPatients = jest.fn();
const mockGetTasksForPatients = jest.fn();
const mockGetColumnData = jest.fn();
const mockCurrentShiftHoursArray = jest.fn();
const mockSetCurrentShiftTimes = jest.fn();
const mockGetPreviousShiftDetails = jest.fn();
jest.mock("../../CareViewSummary/utils/CareViewSummary", () => {
  return {
    getSlotsForPatients: () => mockGetSlotsForPatients(),
    getTasksForPatients: () => mockGetTasksForPatients(),
    getColumnData: () => mockGetColumnData(),
    currentShiftHoursArray: () => mockCurrentShiftHoursArray(),
    setCurrentShiftTimes: () => mockSetCurrentShiftTimes(),
    getPreviousShiftDetails: () => mockGetPreviousShiftDetails(),
  };
});

describe("CareViewPatientsSummary", () => {
  afterEach(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    MockDate.set("2023-01-01T12:00:00");
    mockGetSlotsForPatients.mockReturnValue(mockSlotsData);
    mockGetTasksForPatients.mockReturnValue([]);
    mockGetColumnData.mockReturnValue(mockColumnData);
    mockCurrentShiftHoursArray.mockReturnValue({
      currentShiftHoursArray: [
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ],
      rangeArray: ["06:00-18:00", "18:00-06:00"],
      shiftIndex: 0,
    });
    mockSetCurrentShiftTimes.mockReturnValue([
      "1713234600000",
      "1713274200000",
    ]);
    mockGetPreviousShiftDetails.mockReturnValue({
      endDateTime: "1713234600000",
      previousShiftIndex: 1,
      startDateTime: "1713187800000",
    });
  });

  it("should match snapshot", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should fetch slot details on initial render", () => {
    render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    expect(mockGetSlotsForPatients).toHaveBeenCalled();
  });

  it("renders table headers correctly", async () => {
    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
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
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(queryByText("PT51140")).toBeTruthy();
      expect(
        queryByText("AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu")
      ).toBeTruthy();
      expect(queryByText("A-6")).toBeTruthy();
      expect(queryByText("13 Years, 6 Months, 19 Days")).toBeTruthy();
    });
  });

  it("renders slot details correctly", async () => {
    const { queryAllByText, queryAllByTestId } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
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

  it("should new medications notification be present under patient details", async () => {
    render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    const careViewPatientDetails = screen.getAllByText(/New Medication/i);
    expect(careViewPatientDetails.length).toBe(1);
  });

  it("should filter patients when NEW filter is selected", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={{ ...mockContext, taskFilterType: "NEW" }}
        >
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      // PT49722 has newTreatments: 1 — should be visible
      expect(queryByText("C-1")).toBeTruthy();
      // PT51140 has newTreatments: 0 — should be hidden
      expect(queryByText("A-6")).toBeFalsy();
    });
  });

  it("should show all patients when ALL filter is selected", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={{ ...mockContext, taskFilterType: "ALL" }}
        >
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(queryByText("A-6")).toBeTruthy();
      expect(queryByText("C-1")).toBeTruthy();
    });
  });

  it("should filter patients when PENDING filter is selected", async () => {
    // First getTasksForPatients call is fetchPreviousShiftTasks — PT51140 (A-6) has a pending task
    // Second call is fetchTasks (current shift) — returns empty
    mockGetTasksForPatients
      .mockReturnValueOnce([
        {
          patientUuid: "17fd50c7-8f9e-48da-b9ed-88c1bd358798", // PT51140, bed A-6
          tasks: [
            {
              taskType: { display: "nursing_activity_system" },
              status: "REQUESTED",
              name: "Blood Pressure",
              uuid: "task-uuid-pending-1",
            },
          ],
        },
        {
          patientUuid: "7278eb93-8c1d-4ef4-bcbf-4c6ee91365f7", // PT49722, bed C-1
          tasks: [],
        },
      ])
      .mockReturnValueOnce([]);

    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={{ ...mockContext, taskFilterType: "PENDING" }}
        >
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      // PT51140 has a pending nursing task — should be visible
      expect(queryByText("A-6")).toBeTruthy();
      // PT49722 has no pending tasks — should be hidden
      expect(queryByText("C-1")).toBeFalsy();
    });
  });

  it("should show all patients when enableNurseAcknowledgement is false regardless of filter", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={{
            ...mockContext,
            careViewConfig: {
              timeframeLimitInHours: 2,
              enableNurseAcknowledgement: false,
            },
            taskFilterType: "NEW",
          }}
        >
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(queryByText("A-6")).toBeTruthy();
      expect(queryByText("C-1")).toBeTruthy();
    });
  });
});
