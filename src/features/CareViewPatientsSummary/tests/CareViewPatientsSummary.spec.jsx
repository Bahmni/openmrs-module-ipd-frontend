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

const mockContext = {
  careViewConfig: { timeframeLimitInHours: 2 },
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
    currentShiftHoursArray: () =>mockCurrentShiftHoursArray(),
    setCurrentShiftTimes: ()=>mockSetCurrentShiftTimes(),
    getPreviousShiftDetails: ()=>mockGetPreviousShiftDetails()

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
       "1713274200000"]
    )
    mockGetPreviousShiftDetails.mockReturnValue({
      endDateTime: "1713234600000",
      previousShiftIndex: 1,
      startDateTime: "1713187800000"})
  });

  it("should match snapshot", () => {
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
          navHourEpoch={mockNavHourEpoch}
          filterValue={mockFilterValue}
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
          filterValue={mockFilterValue}
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
          filterValue={mockFilterValue}
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
          filterValue={mockFilterValue}
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
          filterValue={mockFilterValue}
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
          filterValue={mockFilterValue}
        />
      </CareViewContext.Provider>
    );
    const careViewPatientDetails = screen.getAllByText(/New treatment/i);
    expect(careViewPatientDetails.length).toBe(1);
  });
});
