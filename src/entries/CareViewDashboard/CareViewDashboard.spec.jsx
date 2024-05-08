import React from "react";
import {
  render,
  waitFor,
  screen,
  within,
  fireEvent,
} from "@testing-library/react";
import CareViewDashboard from "./CareViewDashboard";
import { CareViewContext } from "../../context/CareViewContext";
import { mockWardList } from "../../features/CareViewSummary/tests/CareViewSummaryMock";
import {
  mockWithBookMarkPatientList,
  mockWithMyPatientList,
} from "../../features/CareViewPatientsSummary/tests/CareViewPatientsSummaryMock";
import MockDate from "mockdate";
import { WARD_SUMMARY_HEADER } from "../../constants";

const mockConfig = jest.fn();
const mockGetWardDetails = jest.fn();
const mockFetchWardSummary = jest.fn();
const mockGetSliderPerView = jest.fn();
const mockFetchPatientsList = jest.fn();
const mockGetSlotsForPatients = jest.fn();
const mockGetTasksForPatients = jest.fn();
const mockCurrentShiftHoursArray = jest.fn();
const mockSetCurrentShiftTimes = jest.fn();
const mockGetPreviousShiftDetails = jest.fn();

jest.mock("../../features/CareViewSummary/utils/CareViewSummary", () => {
  return {
    getWardDetails: () => mockGetWardDetails(),
    fetchWardSummary: () => mockFetchWardSummary(),
    getSlidesPerView: () => mockGetSliderPerView(),
    getSlotsForPatients: () => mockGetSlotsForPatients(),
    getTasksForPatients: () => mockGetTasksForPatients(),
    getPreviousShiftDetails: ()=> mockGetPreviousShiftDetails()
  };
});
jest.mock("../../features//DisplayControls/DrugChart/utils/DrugChartUtils", () => {
  return {
    setCurrentShiftTimes: ()=> mockSetCurrentShiftTimes(),
    getPreviousShiftDetails: ()=> mockGetPreviousShiftDetails(),
    currentShiftHoursArray: ()=> mockCurrentShiftHoursArray()
  };
});

jest.mock("../../features/CareViewPatients/utils/CareViewPatientsUtils", () => {
  return {
    fetchPatientsList: () => mockFetchPatientsList(),
  };
});

const mockContext = {
  selectedWard: { label: "ward", uuid: "uuid" },
  setSelectedWard: jest.fn,
  wardSummary: {
    totalPatients: 5,
    totalProviderPatients: 2,
  },
  setWardSummary: jest.fn,
  headerSelected: WARD_SUMMARY_HEADER.TOTAL_PATIENTS,
  setHeaderSelected: jest.fn(),
  provider: { uuid: "provider-uuid" },
};

jest.mock("swiper/react", () => ({
  Swiper: ({ children }) => children,
  SwiperSlide: ({ children }) => children,
}));
jest.mock("swiper/modules", () => ({
  Pagination: (props) => [props],
}));
jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/pagination", () => jest.fn());
jest.mock("./CareViewDashboardUtils", () => {
  return {
    getConfigForCareViewDashboard: () => mockConfig(),
  };
});
describe("CareViewDashboard", () => {
  afterEach(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    mockConfig.mockReturnValue({
      pageSizeOptions: [10, 20, 30, 40, 50],
      defaultPageSize: 10,
      timeframeLimitInHours: 2,
    });
    MockDate.set("2023-01-01T12:00:00");
    mockFetchPatientsList.mockResolvedValueOnce({
      status: 200,
      data: mockWithBookMarkPatientList,
    });
    mockGetTasksForPatients.mockReturnValue([]);
    mockGetWardDetails.mockReturnValue(mockWardList);
    mockFetchWardSummary.mockReturnValue({
      status: 200,
      data: {
        totalPatients: 5,
        totalProviderPatients: 2,
      },
    });
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
    );
    mockGetPreviousShiftDetails.mockReturnValue({
      endDateTime: "1713234600000",
      previousShiftIndex: 1,
      startDateTime: "1713187800000"})
  });

  it("should match the snapshot", async () => {
    const { container, getByLabelText } = render(
      <CareViewDashboard
        hostData={{ provider: "c61c0d60-b483-4c6a-ad97-8cdec7d48b08" }}
        hostApi={{ onHome: jest.fn(), onLogOut: jest.fn(), handleAuditEvent: jest.fn() }}
      />
    );
    await waitFor(() => {
      expect(getByLabelText("home-button")).toBeTruthy();
    });
    expect(container).toMatchSnapshot();
  });

  it("should render the component", async () => {
    const { getByLabelText } = render(
      <CareViewDashboard
        hostData={{ provider: "c61c0d60-b483-4c6a-ad97-8cdec7d48b08" }}
        hostApi={{ onHome: jest.fn(), onLogOut: jest.fn(), handleAuditEvent: jest.fn()}}
      />
    );
    await waitFor(() => {
      expect(getByLabelText("home-button")).toBeTruthy();
    });
  });

  it("should render the total patients with the patient list", async () => {
    mockFetchPatientsList.mockResolvedValueOnce({
      status: 200,
      data: mockWithBookMarkPatientList,
    });
    const { container, getByLabelText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewDashboard
          hostData={{ provider: "c61c0d60-b483-4c6a-ad97-8cdec7d48b08" }}
          hostApi={{ onHome: jest.fn(), onLogOut: jest.fn(), handleAuditEvent: jest.fn() }}
        />
      </CareViewContext.Provider>
    );
    await waitFor(() => {
      expect(getByLabelText("home-button")).toBeTruthy();
    });

    const totalPatientsSummary = container.querySelector(
      ".bx--tile.summary-tile.selected-header"
    );
    expect(
      within(totalPatientsSummary).getByText(/Total patient/i)
    ).toBeTruthy();
    expect(within(totalPatientsSummary).getByText(/5/i)).toBeTruthy();

    await waitFor(() => {
      const patientRow = container.querySelectorAll(
        ".care-view-patient-details"
      );
      expect(patientRow).toHaveLength(5);
      expect(within(patientRow[0]).getByText(/PT55746/i)).toBeTruthy();
      expect(within(patientRow[1]).getByText(/PT51187/i)).toBeTruthy();
      expect(within(patientRow[3]).getByText(/PT49722/i)).toBeTruthy();
    });
  });

  it("should render the my patients with the my patient list", async () => {
    mockFetchPatientsList
      .mockResolvedValueOnce({
        status: 200,
        data: mockWithBookMarkPatientList,
      })
      .mockResolvedValue({
        status: 200,
        data: mockWithMyPatientList,
      });
    const { container, getByLabelText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewDashboard
          hostData={{ provider: "c61c0d60-b483-4c6a-ad97-8cdec7d48b08" }}
          hostApi={{ onHome: jest.fn(), onLogOut: jest.fn(), handleAuditEvent: jest.fn() }}
        />
      </CareViewContext.Provider>
    );
    await waitFor(() => {
      expect(getByLabelText("home-button")).toBeTruthy();
    });

    fireEvent.click(screen.getByText(/My patient/i));

    const myPatientsSummary = container.querySelector(
      ".bx--tile.summary-tile.selected-header"
    );
    expect(within(myPatientsSummary).getByText(/My patient/i)).toBeTruthy();
    expect(within(myPatientsSummary).getByText(/2/i)).toBeTruthy();

    await waitFor(() => {
      const patientRow = container.querySelectorAll(
        ".care-view-patient-details"
      );
      expect(patientRow).toHaveLength(2);
      expect(within(patientRow[0]).getByText(/PT55746/i)).toBeTruthy();
      expect(within(patientRow[1]).getByText(/PT51187/i)).toBeTruthy();
    });
  });
});
