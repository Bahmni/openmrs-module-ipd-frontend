import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DrugChartView from "../components/DrugChartView";
import {
  drugChartData,
  mockDrugOrders,
  mockEmptyDrugOrders,
  drugChartDataForPRN,
  allMedicationData,
  mockDeepLinkParams,
  mockPrivilegesWithAcknowledgement,
  mockPrivilegesWithoutAcknowledgement,
  mockMedicationDataWithAmendedNotes,
  mockDrugOrdersForDeepLink,
} from "./DrugChartViewMockData";
import { IPDContext } from "../../../../context/IPDContext";
import { AllMedicationsContext } from "../../../../context/AllMedications";
import { SliderContext } from "../../../../context/SliderContext";
import MockDate from "mockdate";
import { mockConfig } from "../../../../utils/CommonUtils";

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

jest.mock("../../../../components/Notification/Notification", () => {
  return jest.fn(({ message, kind }) => (
    <div className={`notification ${kind}`}>{message}</div>
  ));
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

const mockSliderContext = {
  isSliderOpen: {
    drugChartNoteAmendment: false,
    drugChartNoteAcknowledgement: false,
  },
  updateSliderOpen: jest.fn(),
  sliderContentModified: {
    drugChartNoteAmendment: false,
    drugChartNoteAcknowledgement: false,
  },
  setSliderContentModified: jest.fn(),
};

const renderDrugChartView = (mockOrders) => {
  return render(
    <SliderContext.Provider value={mockSliderContext}>
      <AllMedicationsContext.Provider
        value={{ data: mockOrders, getAllDrugOrders: jest.fn() }}
      >
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartView patientId="testid" visitId={"visit-id"} />
        </IPDContext.Provider>
      </AllMedicationsContext.Provider>
    </SliderContext.Provider>
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
      expect(
        container.querySelector("[data-testid='left-icon']")
      ).toBeInTheDocument();
      expect(
        container.querySelector("[data-testid='right-icon']")
      ).toBeInTheDocument();
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
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider
          value={{
            config: mockConfig,
            isReadMode: true,
            visitSummary: { stopDateTime: new Date() },
          }}
        >
          <DrugChartView patientId="test-id" />
        </IPDContext.Provider>
      </SliderContext.Provider>
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
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartView patientId="test-id" />
        </IPDContext.Provider>
      </SliderContext.Provider>
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
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartView patientId="test-id" />
        </IPDContext.Provider>
      </SliderContext.Provider>
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
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <AllMedicationsContext.Provider value={allMedicationData}>
            <DrugChartView patientId="test-id" />
          </AllMedicationsContext.Provider>
        </IPDContext.Provider>
      </SliderContext.Provider>
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

describe("DrugChartWrapper - handleDeepLink for acknowledgement flow", () => {
  let mockSliderContext;

  beforeEach(() => {
    jest.clearAllMocks();
    delete window.__processedDeepLink;
    mockGetTimeInSeconds.mockReturnValue(172800);

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

    mockSliderContext = {
      isSliderOpen: {
        drugChartNoteAmendment: false,
        drugChartNoteAcknowledgement: false,
      },
      updateSliderOpen: jest.fn(),
      sliderContentModified: {
        drugChartNoteAmendment: false,
        drugChartNoteAcknowledgement: false,
      },
      setSliderContentModified: jest.fn(),
    };
  });

  afterEach(() => {
    MockDate.reset();
    delete window.__processedDeepLink;
  });

  it("should call handleDeepLink useEffect and process deep link params correctly", async () => {
    MockDate.set("2024-01-05 10:00");
    delete window.__processedDeepLink;

    mockFetchMedications.mockResolvedValue({
      data: mockMedicationDataWithAmendedNotes,
    });

    const scrollToSectionMock = jest.fn();

    render(
      <SliderContext.Provider value={mockSliderContext}>
        <AllMedicationsContext.Provider
          value={{ data: mockDrugOrdersForDeepLink }}
        >
          <IPDContext.Provider
            value={{
              config: mockConfig,
              deepLinkParams: mockDeepLinkParams,
              privileges: mockPrivilegesWithAcknowledgement,
              visit: {},
              scrollToSection: scrollToSectionMock,
            }}
          >
            <DrugChartView
              patientId="test-patient-id"
              visitId="test-visit-id"
            />
          </IPDContext.Provider>
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(mockFetchMedications).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(scrollToSectionMock).toHaveBeenCalled();
    });

    expect(window.__processedDeepLink).toBeDefined();
  });

  it("should open acknowledge amend note slider when deep link is triggered with valid params", async () => {
    MockDate.set("2024-01-05 10:00");
    delete window.__processedDeepLink;

    mockFetchMedications.mockResolvedValue({
      data: mockMedicationDataWithAmendedNotes,
    });

    render(
      <SliderContext.Provider value={mockSliderContext}>
        <AllMedicationsContext.Provider
          value={{ data: mockDrugOrdersForDeepLink }}
        >
          <IPDContext.Provider
            value={{
              config: mockConfig,
              deepLinkParams: mockDeepLinkParams,
              privileges: mockPrivilegesWithAcknowledgement,
              visit: {},
              scrollToSection: jest.fn(),
            }}
          >
            <DrugChartView
              patientId="test-patient-id"
              visitId="test-visit-id"
            />
          </IPDContext.Provider>
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(mockSliderContext.updateSliderOpen).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockSliderContext.updateSliderOpen).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    const updateCall = mockSliderContext.updateSliderOpen.mock.calls[0][0];
    const result = updateCall({ drugChartNoteAcknowledgement: false });
    expect(result.drugChartNoteAcknowledgement).toBe(true);
  });

  it("should NOT open acknowledgement slider when openAcknowledge is false", async () => {
    MockDate.set("2024-01-05 10:00");

    const invalidDeepLinkParams = {
      openAcknowledge: false,
      medicationAdministrationNoteUUID: "test-note-uuid-123",
      medicationAdministrationEpoch: 1704441600000,
    };

    mockFetchMedications.mockResolvedValue({
      data: mockMedicationDataWithAmendedNotes,
    });

    render(
      <SliderContext.Provider value={mockSliderContext}>
        <AllMedicationsContext.Provider
          value={{ data: mockDrugOrdersForDeepLink }}
        >
          <IPDContext.Provider
            value={{
              config: mockConfig,
              deepLinkParams: invalidDeepLinkParams,
              privileges: mockPrivilegesWithAcknowledgement,
              visit: {},
            }}
          >
            <DrugChartView
              patientId="test-patient-id"
              visitId="test-visit-id"
            />
          </IPDContext.Provider>
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("currentShift")).toBeInTheDocument();
    });

    expect(window.__processedDeepLink).toBeUndefined();
  });

  it("should NOT open acknowledgement slider when medicationAdministrationNoteUUID is missing", async () => {
    MockDate.set("2024-01-05 10:00");

    const invalidDeepLinkParams = {
      openAcknowledge: true,
      medicationAdministrationEpoch: 1704441600000,
    };

    mockFetchMedications.mockResolvedValue({
      data: mockMedicationDataWithAmendedNotes,
    });

    render(
      <SliderContext.Provider value={mockSliderContext}>
        <AllMedicationsContext.Provider
          value={{ data: mockDrugOrdersForDeepLink }}
        >
          <IPDContext.Provider
            value={{
              config: mockConfig,
              deepLinkParams: invalidDeepLinkParams,
              privileges: mockPrivilegesWithAcknowledgement,
              visit: {},
            }}
          >
            <DrugChartView
              patientId="test-patient-id"
              visitId="test-visit-id"
            />
          </IPDContext.Provider>
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("currentShift")).toBeInTheDocument();
    });

    expect(window.__processedDeepLink).toBeUndefined();
  });

  it("should NOT open acknowledgement slider when medicationAdministrationEpoch is missing", async () => {
    MockDate.set("2024-01-05 10:00");

    const invalidDeepLinkParams = {
      openAcknowledge: true,
      medicationAdministrationNoteUUID: "test-note-uuid-123",
    };

    mockFetchMedications.mockResolvedValue({
      data: mockMedicationDataWithAmendedNotes,
    });

    render(
      <SliderContext.Provider value={mockSliderContext}>
        <AllMedicationsContext.Provider
          value={{ data: mockDrugOrdersForDeepLink }}
        >
          <IPDContext.Provider
            value={{
              config: mockConfig,
              deepLinkParams: invalidDeepLinkParams,
              privileges: mockPrivilegesWithAcknowledgement,
              visit: {},
            }}
          >
            <DrugChartView
              patientId="test-patient-id"
              visitId="test-visit-id"
            />
          </IPDContext.Provider>
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("currentShift")).toBeInTheDocument();
    });

    expect(window.__processedDeepLink).toBeUndefined();
  });

  it("should not open acknowledgement slider due to lack of privileges", async () => {
    MockDate.set("2024-01-05 10:00");
    delete window.__processedDeepLink;

    mockFetchMedications.mockResolvedValue({
      data: mockMedicationDataWithAmendedNotes,
    });

    render(
      <SliderContext.Provider value={mockSliderContext}>
        <AllMedicationsContext.Provider
          value={{ data: mockDrugOrdersForDeepLink }}
        >
          <IPDContext.Provider
            value={{
              config: mockConfig,
              deepLinkParams: mockDeepLinkParams,
              privileges: mockPrivilegesWithoutAcknowledgement,
              visit: {},
            }}
          >
            <DrugChartView
              patientId="test-patient-id"
              visitId="test-visit-id"
            />
          </IPDContext.Provider>
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(mockFetchMedications).toHaveBeenCalled();
    });

    expect(mockSliderContext.updateSliderOpen).not.toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it("should call clearDeepLinkParams when deep link is processed successfully", async () => {
    MockDate.set("2024-01-05 10:00");
    delete window.__processedDeepLink;

    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    mockFetchMedications.mockResolvedValue({
      data: mockMedicationDataWithAmendedNotes,
    });

    render(
      <SliderContext.Provider value={mockSliderContext}>
        <AllMedicationsContext.Provider
          value={{ data: mockDrugOrdersForDeepLink }}
        >
          <IPDContext.Provider
            value={{
              config: mockConfig,
              deepLinkParams: mockDeepLinkParams,
              privileges: mockPrivilegesWithAcknowledgement,
              visit: {},
              scrollToSection: jest.fn(),
            }}
          >
            <DrugChartView
              patientId="test-patient-id"
              visitId="test-visit-id"
            />
          </IPDContext.Provider>
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    );

    // Verify acknowledgement slider was opened (deep link processed successfully)
    await waitFor(() => {
      expect(mockSliderContext.updateSliderOpen).toHaveBeenCalled();
    });

    // Verify URL params were cleared
    await waitFor(() => {
      expect(replaceStateSpy).toHaveBeenCalled();
    });

    // Verify deep link was marked as processed
    expect(window.__processedDeepLink).toBeDefined();

    replaceStateSpy.mockRestore();
  });

  it("should call clearDeepLinkParams when user lacks privileges", async () => {
    MockDate.set("2024-01-05 10:00");
    delete window.__processedDeepLink;

    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    mockFetchMedications.mockResolvedValue({
      data: mockMedicationDataWithAmendedNotes,
    });

    render(
      <SliderContext.Provider value={mockSliderContext}>
        <AllMedicationsContext.Provider
          value={{ data: mockDrugOrdersForDeepLink }}
        >
          <IPDContext.Provider
            value={{
              config: mockConfig,
              deepLinkParams: mockDeepLinkParams,
              privileges: mockPrivilegesWithoutAcknowledgement,
              visit: {},
            }}
          >
            <DrugChartView
              patientId="test-patient-id"
              visitId="test-visit-id"
            />
          </IPDContext.Provider>
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    );

    // Wait for the medication fetch to complete
    await waitFor(() => {
      expect(mockFetchMedications).toHaveBeenCalled();
    });

    // Verify clearDeepLinkParams was called (URL params cleared)
    await waitFor(
      () => {
        expect(replaceStateSpy).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    replaceStateSpy.mockRestore();
  });
});
