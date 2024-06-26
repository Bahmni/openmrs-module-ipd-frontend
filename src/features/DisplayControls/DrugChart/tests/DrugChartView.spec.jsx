import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DrugChartView from "../components/DrugChartView";
import {
  drugChartData,
  mockDrugOrders,
  mockEmptyDrugOrders,
  drugChartDataForPRN,
  allMedicationData,
} from "./DrugChartViewMockData";
import { IPDContext } from "../../../../context/IPDContext";
import { AllMedicationsContext } from "../../../../context/AllMedications";
import MockDate from "mockdate";
import { mockConfig } from "../../../../utils/CommonUtils";
import { after } from "lodash";

const mockFetchMedications = jest.fn();
const MockTooltipCarbon = jest.fn();
const mockGetTimeInSeconds = jest.fn();
const mockCurrentShiftHoursArray = jest.fn();

jest.mock("bahmni-carbon-ui", () => {
  return {
    TooltipCarbon: (props) => {
      MockTooltipCarbon(props);
      return <div>TooltipCarbon</div>;
    },
  };
});

jest.mock("../utils/DrugChartUtils", () => {
  const originalModule = jest.requireActual("../utils/DrugChartUtils");
  return {
    ...originalModule,
    fetchMedications: () => mockFetchMedications(),
    currentShiftHoursArray: () => mockCurrentShiftHoursArray(),
    getTimeInSeconds: () => mockGetTimeInSeconds(),
  };
});
jest.mock("../../../../utils/DateTimeUtils", () => {
  const originalModule = jest.requireActual("../../../../utils/DateTimeUtils");
  return {
    ...originalModule,
    convertDaystoSeconds: () => mockGetTimeInSeconds(),
  };
});

const renderDrugChartView = (mockOrders) => {
  return render(
    <AllMedicationsContext.Provider
      value={{ data: mockOrders, getAllDrugOrders: jest.fn() }}
    >
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugChartView patientId="testid" visitId={"visit-id"} />
      </IPDContext.Provider>
    </AllMedicationsContext.Provider>
  );
};
describe("DrugChartWrapper", () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    MockDate.reset();
  });

  // mocked current Date i.e new Date() to 5th Jan 2024
  MockDate.set("2024-01-05 10:00");

  it("matches snapshot", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    const { container } = renderDrugChartView(mockDrugOrders);
    await waitFor(() => {
      expect(screen.getAllByText(/Paracetamol/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  it("should render loading state when isLoading is true", async () => {
    MockDate.set("2024-01-05 10:00");
    const { container } = renderDrugChartView(mockEmptyDrugOrders);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it("should render no medication message when drugChartData is empty", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: [],
    });
    renderDrugChartView(mockEmptyDrugOrders);
    await waitFor(() => {
      expect(
        screen.getByText("No Medication has been scheduled in this shift")
      ).toBeTruthy();
    });
  });

  it("should show previous shift on previous button click", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    renderDrugChartView(mockDrugOrders);
    const previousButton = screen.getByTestId("previousButton");
    fireEvent.click(previousButton);
    await waitFor(() => {
      expect(screen.getByText(/04 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/18:00/)).toBeTruthy();
      expect(screen.getByText(/05 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/05:59/)).toBeTruthy();
    });
  });

  it("should show next shift on next button click", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    renderDrugChartView(mockDrugOrders);
    const nextButton = screen.getByTestId("nextButton");
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText(/05 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/18:00/)).toBeTruthy();
      expect(screen.getByText(/06 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/05:59/)).toBeTruthy();
    });
  });

  it("should show current shift on current button click", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    renderDrugChartView(mockDrugOrders);
    const currentShiftButton = screen.getByTestId("currentShift");
    fireEvent.click(currentShiftButton);
    await waitFor(() => {
      expect(screen.getByText(/05 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/06:00/)).toBeTruthy();
      expect(screen.getByText(/17:59/)).toBeTruthy();
    });
  });

  it("should restrict previous shift navigation if it reaches administered time", async () => {
    MockDate.set("2024-01-05 07:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    renderDrugChartView(mockDrugOrders);
    await waitFor(() => {
      expect(screen.getAllByText(/Paracetamol/i)).toBeTruthy();
    });
    expect(screen.getByTestId("previousButton").disabled).toEqual(true);
  });
  it("should restrict next shift navigation if it reaches 2 days forth from the current shift", async () => {
    MockDate.set("2024-01-05 07:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    mockGetTimeInSeconds.mockReturnValue(0);
    renderDrugChartView(mockDrugOrders);
    await waitFor(() => {
      expect(screen.getAllByText(/Paracetamol/i)).toBeTruthy();
    });
    expect(screen.getByTestId("nextButton").disabled).toEqual(true);
  });

  it("should show current shift and next-shift button as disabled for read mode", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: true,
          visitSummary: { stopDateTime: new Date() },
        }}
      >
        <DrugChartView patientId="test-id" />
      </IPDContext.Provider>
    );
    const currentShiftButton = screen.getByTestId("currentShift");
    expect(currentShiftButton.className).toContain("bx--btn--disabled");
    expect(screen.getByTestId("nextButton").disabled).toEqual(true);
  });

  it("should display not in current shift message when next shift button is clicked", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    const { getByTestId, getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugChartView patientId="test-id" />
      </IPDContext.Provider>
    );
    getByTestId("nextButton").click();
    await waitFor(() => {
      expect(getByText("You're not viewing the current shift")).toBeTruthy();
    });
  });
  it("should display not in current shift message when previous shift button is clicked", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    const { getByTestId, getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugChartView patientId="test-id" />
      </IPDContext.Provider>
    );
    getByTestId("previousButton").click();
    await waitFor(() => {
      expect(getByText("You're not viewing the current shift")).toBeTruthy();
    });
  });

  it("should show PRN administered medication", async () => {
    MockDate.set("2024-02-08 07:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartDataForPRN,
    });
    render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <AllMedicationsContext.Provider value={allMedicationData}>
          <DrugChartView patientId="test-id" />
        </AllMedicationsContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(screen.queryAllByText(/Zinc Oxide 20 mg Tablet/i)).toHaveLength(2);
    });
  });
});

describe("DrugChartWrapper with half hour shift time start", () => {
  beforeEach(() => {
    mockCurrentShiftHoursArray.mockReturnValue({
      currentShiftHoursArray: [
        "06:30",
        "07:30",
        "08:30",
        "09:30",
        "10:30",
        "11:30",
        "12:30",
        "13:30",
        "14:30",
        "15:30",
        "16:30",
        "17:30",
      ],
      rangeArray: ["06:30-18:00", "18:00-06:30"],
      shiftIndex: 0,
    });
  });

  afterEach(() => {
    MockDate.reset();
  });

  // mocked current Date i.e new Date() to 5th Jan 2024
  MockDate.set("2024-01-05 10:00");

  it("should show previous shift on previous button click", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    renderDrugChartView(mockDrugOrders);
    const previousButton = screen.getByTestId("previousButton");
    fireEvent.click(previousButton);
    await waitFor(() => {
      expect(screen.getByText(/04 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/18:00/)).toBeTruthy();
      expect(screen.getByText(/05 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/06:29/)).toBeTruthy();
    });
  });

  it("should show next shift on next button click", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    renderDrugChartView(mockDrugOrders);
    const nextButton = screen.getByTestId("nextButton");
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText(/05 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/18:00/)).toBeTruthy();
      expect(screen.getByText(/06 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/06:29/)).toBeTruthy();
    });
  });

  it("should show current shift on current button click", async () => {
    MockDate.set("2024-01-05 10:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    renderDrugChartView(mockDrugOrders);
    const currentShiftButton = screen.getByTestId("currentShift");
    fireEvent.click(currentShiftButton);
    await waitFor(() => {
      expect(screen.getByText(/05 Jan 2024/)).toBeTruthy();
      expect(screen.getByText(/06:30/)).toBeTruthy();
      expect(screen.getByText(/17:59/)).toBeTruthy();
    });
  });
});
