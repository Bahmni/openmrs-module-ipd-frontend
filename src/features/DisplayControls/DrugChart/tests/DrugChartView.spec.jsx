import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DrugChartView from "../components/DrugChartView";
import {
  drugChartData,
  mockDrugOrders,
  mockEmptyDrugOrders,
} from "./DrugChartViewMockData";
import { IPDContext } from "../../../../context/IPDContext";
import { AllMedicationsContext } from "../../../../context/AllMedications";
import MockDate from "mockdate";
import { mockConfig } from "../../../../utils/CommonUtils";

const mockFetchMedications = jest.fn();
const MockTooltipCarbon = jest.fn();
const mockGetTimeInSeconds = jest.fn();

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
    currentShiftHoursArray: () => ({
      currentShiftHoursArray: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      rangeArray: ["06:00-18:00", "18:00-06:00"],
      shiftIndex: 0,
    }),
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

afterEach(() => {
  MockDate.reset();
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
});
