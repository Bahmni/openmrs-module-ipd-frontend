import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DrugChartView from "../components/DrugChartView";
import { drugChartData } from "./DrugChartViewMockData";
import MockDate from "mockdate";

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
    currentShiftHoursArray: () => [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
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

describe("DrugChartWrapper", () => {
  // mocked current Date i.e new Date() to 5th Jan 2024
  MockDate.set("2024-01-05");

  it("matches snapshot", async () => {
    MockDate.set("2024-01-05");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    const { container } = render(<DrugChartView patientId="testid" />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it("should render loading state when isLoading is true", async () => {
    MockDate.set("2024-01-05");
    const { container } = render(<DrugChartView patientId="test-id" />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it("should render no medication message when drugChartData is empty", async () => {
    MockDate.set("2024-01-05");
    mockFetchMedications.mockResolvedValue({
      data: [{ slots: [] }],
    });
    render(<DrugChartView patientId="test-id" />);
    await waitFor(() => {
      expect(
        screen.getByText("No Medication has been scheduled in this shift")
      ).toBeTruthy();
    });
  });

  it("should show previous shift on previous button click", async () => {
    MockDate.set("2024-01-05");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    render(<DrugChartView patientId="test-id" />);
    const previousButton = screen.getByTestId("previousButton");
    fireEvent.click(previousButton);
    await waitFor(() => {
      expect(
        screen.getByText("04 Jan 2024 | 18:00 - 05 Jan 2024 | 06:00")
      ).toBeTruthy();
    });
  });

  it("should show next shift on next button click", async () => {
    MockDate.set("2024-01-05");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    render(<DrugChartView patientId="test-id" />);
    const nextButton = screen.getByTestId("nextButton");
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(
        screen.getByText("05 Jan 2024 | 18:00 - 06 Jan 2024 | 06:00")
      ).toBeTruthy();
    });
  });

  it("should show current shift on current button click", async () => {
    MockDate.set("2024-01-05");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    render(<DrugChartView patientId="test-id" />);
    const currentShiftButton = screen.getByTestId("currentShift");
    fireEvent.click(currentShiftButton);
    await waitFor(() => {
      expect(
        screen.getByText("05 Jan 2024 | 06:00 - 05 Jan 2024 | 18:00")
      ).toBeTruthy();
    });
  });

  it("should restrict previous shift navigation if it reaches administered time", async () => {
    MockDate.set("2024-01-05 07:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    render(<DrugChartView patientId="test-id" />);
    await waitFor(() => {
      expect(screen.getByText(/Paracetamol/i)).toBeTruthy();
    });
    expect(screen.getByTestId("previousButton").disabled).toEqual(true);
  });
  it("should restrict next shift navigation if it reaches 2 days forth from the current shift", async () => {
    MockDate.set("2024-01-05 07:00");
    mockFetchMedications.mockResolvedValue({
      data: drugChartData,
    });
    mockGetTimeInSeconds.mockReturnValue(0);
    render(<DrugChartView patientId="test-id" />);
    await waitFor(() => {
      expect(screen.getByText(/Paracetamol/i)).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByText(/Paracetamol/i)).toBeTruthy();
    });
    expect(screen.getByTestId("nextButton").disabled).toEqual(true);
  });
});
