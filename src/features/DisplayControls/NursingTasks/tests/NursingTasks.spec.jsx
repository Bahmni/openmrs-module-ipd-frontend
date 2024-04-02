import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import NursingTasks from "../components/NursingTasks";
import { IPDContext } from "../../../../context/IPDContext";

import {
  mockNursingTasksResponse,
  mockShiftResponse,
} from "./NursingTasksUtilsMockData";
import MockDate from "mockdate";
import { SliderContext } from "../../../../context/SliderContext";
import {
  mockConfig,
  mockConfigFor12HourFormat,
} from "../../../../utils/CommonUtils";

const mockFetchMedicationNursingTasks = jest.fn();
const mockGetTimeInSeconds = jest.fn();
const mockFetchhNonMedicationTasks = jest.fn();

jest.mock("../utils/NursingTasksUtils", () => {
  const originalModule = jest.requireActual("../utils/NursingTasksUtils");
  return {
    ...originalModule,
    fetchMedicationNursingTasks: () => mockFetchMedicationNursingTasks(),
    fetchNonMedicationTasks: () => mockFetchhNonMedicationTasks(),
  };
});
jest.mock("../../../../utils/DateTimeUtils", () => {
  const originalModule = jest.requireActual("../../../../utils/DateTimeUtils");
  return {
    ...originalModule,
    convertDaystoSeconds: () => mockGetTimeInSeconds(),
  };
});

jest.mock("../../DrugChart/utils/DrugChartUtils", () => {
  const originalModule = jest.requireActual(
    "../../DrugChart/utils/DrugChartUtils"
  );
  return {
    ...originalModule,
    currentShiftHoursArray: () => ({
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
    }),
  };
});

const mockProviderValue = {
  isSliderOpen: {
    treatments: false,
  },
  updateSliderOpen: jest.fn(),
};

describe("NursingTasks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should show loading state", async () => {
    const { getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(getByTestId("loading-icon")).toBeTruthy();
    });
  });

  it("should show no pending tasks message when nursing task reponse is empty", async () => {
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks.mockResolvedValue([
      {
        slots: [],
      },
    ]);

    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchhNonMedicationTasks).toHaveBeenCalledTimes(1);
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getByText("No Pending Task is available for the patient")
      ).toBeTruthy();
    });
  });

  it("should show no completed tasks message when nursing task reponse is empty", async () => {
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([
      {
        slots: [],
      },
    ]);
    const { getByText, container } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      const filterDropdown = container.querySelector(".bx--list-box__field");
      fireEvent.click(filterDropdown);
      const complete = getByText("Completed");
      fireEvent.click(complete);
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getByText("No Completed Task is available for the patient")
      ).toBeTruthy();
    });
  });

  it("should show no nursing tasks message when nursing task reponse is empty for all tasks", async () => {
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([
      {
        slots: [],
      },
    ]);
    const { getByText, container } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      const filterDropdown = container.querySelector(".bx--list-box__field");
      fireEvent.click(filterDropdown);
      const complete = getByText("All Tasks");
      fireEvent.click(complete);
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getByText("No Nursing Task is scheduled for the patient")
      ).toBeTruthy();
    });
  });

  it("should show nursing tasks when nursing task reponse is not empty", async () => {
    MockDate.set("2023-08-11");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks.mockResolvedValueOnce(
      mockNursingTasksResponse
    );
    const { getAllByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getAllByText("Paracetamol 120 mg/5 mL Suspension (Liquid)")
      ).toBeTruthy();
      // expect(asFragment()).toMatchSnapshot();
    });
  });

  it("should show current date", async () => {
    MockDate.set("2023-08-11 07:00");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks.mockResolvedValueOnce(
      mockNursingTasksResponse
    );
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(getByText(/11 Aug 2023/)).toBeTruthy();
    expect(getByText(/06:00/)).toBeTruthy();
    expect(getByText(/17:59/)).toBeTruthy();
  });

  it("should show current date when in 12 hour format", async () => {
    MockDate.set("2023-08-11 07:00 PM");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks.mockResolvedValueOnce(
      mockNursingTasksResponse
    );
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider
          value={{ config: mockConfigFor12HourFormat, isReadMode: false }}
        >
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(getByText(/11 Aug 2023/)).toBeTruthy();
    expect(getByText(/06:00 AM/)).toBeTruthy();
    expect(getByText(/05:59 PM/)).toBeTruthy();
  });

  it("should show Correct Nursing Tasks when clicked on previous button", async () => {
    MockDate.set("2024-01-05");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValue(mockShiftResponse);
    const { getAllByText, getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(
      getAllByText("Paracetamol 120 mg/5 mL Suspension (Liquid)")
    ).toBeTruthy();
    getByTestId("previous-shift").click();
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(2);
    });
    expect(
      getAllByText("Amoxicillin 250 mg/5 mL Powder for Oral Suspension")
    ).toBeTruthy();
  });
  it("should show Correct Nursing Tasks when clicked on next button", async () => {
    MockDate.set("2024-01-05");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValue(mockShiftResponse);
    mockGetTimeInSeconds.mockReturnValue(259200);
    const { getAllByText, getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(
      getAllByText("Paracetamol 120 mg/5 mL Suspension (Liquid)")
    ).toBeTruthy();
    getByTestId("next-shift").click();
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(2);
    });
    expect(
      getAllByText("Amoxicillin 250 mg/5 mL Powder for Oral Suspension")
    ).toBeTruthy();
  });
  it("should show current shift when clicked on current shift button", async () => {
    MockDate.set("2024-01-05");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValueOnce(mockShiftResponse)
      .mockReturnValue(mockNursingTasksResponse);
    const { getAllByText, getByTestId, queryByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(
      getAllByText("Paracetamol 120 mg/5 mL Suspension (Liquid)")
    ).toBeTruthy();

    getByTestId("next-shift").click();
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(2);
    });
    expect(
      getAllByText("Amoxicillin 250 mg/5 mL Powder for Oral Suspension")
    ).toBeTruthy();

    getByTestId("current-shift").click();
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(3);
    });
    expect(
      queryByText("Amoxicillin 250 mg/5 mL Powder for Oral Suspension")
    ).not.toBeTruthy();
    expect(
      getAllByText("Paracetamol 120 mg/5 mL Suspension (Liquid)")
    ).toBeTruthy();
  });
  it("should restrict previous shift navigation if it reaches administered time", async () => {
    MockDate.set("2024-01-05");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks.mockReturnValueOnce(mockShiftResponse);
    const { getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(getByTestId("previous-shift").disabled).toEqual(true);
  });
  it("should restrict next shift navigation if it reaches 2 days forth from the current shift", async () => {
    MockDate.set("2024-01-03 07:00");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockShiftResponse)
      .mockReturnValueOnce(mockShiftResponse);
    mockGetTimeInSeconds.mockReturnValue(0);
    const { getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(getByTestId("next-shift").disabled).toEqual(true);
  });
  it("should show Current Shift and Add Task button as disabled", async () => {
    MockDate.set("2024-01-05");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValueOnce(mockShiftResponse)
      .mockReturnValue(mockNursingTasksResponse);
    const { getByTestId, getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider
          value={{
            config: mockConfig,
            isReadMode: true,
            visitSummary: { stopDateTime: new Date() },
          }}
        >
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    const currentShiftButton = getByTestId("current-shift");
    const AddTaskButton = getByText("Add Task");

    expect(currentShiftButton.className).toContain("bx--btn--disabled");
    expect(AddTaskButton.className).toContain("bx--btn--disabled");
  });
  it("should show next button disabled for ipd inactive visit", async () => {
    MockDate.set("2024-01-05");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValueOnce(mockShiftResponse)
      .mockReturnValue(mockNursingTasksResponse);
    const { getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider
          value={{
            config: mockConfig,
            isReadMode: true,
            visitSummary: { stopDateTime: new Date() },
          }}
        >
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    expect(getByTestId("next-shift").disabled).toEqual(true);
  });
  it("should display not in current shift message when next shift button is clicked", async () => {
    MockDate.set("2024-01-05");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValue(mockShiftResponse);
    mockGetTimeInSeconds.mockReturnValue(259200);
    const { getByText, getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    getByTestId("next-shift").click();
    await waitFor(() => {
      expect(getByText("You're not viewing the current shift")).toBeTruthy();
    });
  });
  it("should display not in current shift message when previous shift button is clicked", async () => {
    MockDate.set("2024-01-05");
    mockFetchhNonMedicationTasks.mockResolvedValue([]);
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValue(mockShiftResponse);
    mockGetTimeInSeconds.mockReturnValue(259200);
    const { getByText, getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    getByTestId("previous-shift").click();
    await waitFor(() => {
      expect(getByText("You're not viewing the current shift")).toBeTruthy();
    });
  });
  it("should display non medication tasks when non medicaion response is not empty", async () => {
    MockDate.set("2023-08-11");
    mockFetchhNonMedicationTasks.mockResolvedValueOnce([
      {
        uuid: "becf9b98-295c-4e50-87e6-67b7793eb65d",
        name: "Test Task",
        patientUuid: "5507a3a0-553e-4352-b92b-dd5a9cee94b4",
        requestedStartTime: 1939452389000,
        requestedEndTime: 1939452389000,
        partOf: null,
        taskType: { display: "nursing_activity" },
        creator: {
          uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
          display: "bailly.rurangirwa",
        },
        status: "REQUESTED",
        intent: "ORDER",
      },
    ]);
    mockFetchMedicationNursingTasks.mockResolvedValueOnce(
      mockNursingTasksResponse
    );
    const { getAllByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchhNonMedicationTasks).toHaveBeenCalledTimes(1);
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getAllByText("Paracetamol 120 mg/5 mL Suspension (Liquid)")
      ).toBeTruthy();
      expect(getAllByText("Test Task")).toBeTruthy();
    });
  });
});
