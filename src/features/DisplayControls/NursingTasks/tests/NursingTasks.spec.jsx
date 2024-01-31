import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import NursingTasks from "../components/NursingTasks";
import {
  mockNursingTasksResponse,
  mockShiftResponse,
} from "./NursingTasksUtilsMockData";
import MockDate from "mockdate";
import { SliderContext } from "../../../../context/SliderContext";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";

const mockFetchMedicationNursingTasks = jest.fn();
const mockGetTimeInSeconds = jest.fn();

jest.mock("../utils/NursingTasksUtils", () => {
  const originalModule = jest.requireActual("../utils/NursingTasksUtils");
  return {
    ...originalModule,
    fetchMedicationNursingTasks: () => mockFetchMedicationNursingTasks(),
  };
});
jest.mock("../../../../utils/DateTimeUtils", () => {
  const originalModule = jest.requireActual("../../../../utils/DateTimeUtils");
  return {
    ...originalModule,
    convertDaystoSeconds: () => mockGetTimeInSeconds(),
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
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(getByText("Loading...")).toBeTruthy();
    });
  });

  it("should show no pending tasks message when nursing task reponse is empty", async () => {
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([
      {
        slots: [],
      },
    ]);

    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getByText("No Pending Task is available for the patient")
      ).toBeTruthy();
    });
  });

  it("should show no completed tasks message when nursing task reponse is empty", async () => {
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([
      {
        slots: [],
      },
    ]);
    const { getByText, container } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
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
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([
      {
        slots: [],
      },
    ]);
    const { getByText, container } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
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
    mockFetchMedicationNursingTasks.mockResolvedValueOnce(
      mockNursingTasksResponse
    );
    const { getAllByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
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

    mockFetchMedicationNursingTasks.mockResolvedValueOnce(
      mockNursingTasksResponse
    );
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(getByText("11 Aug 2023 | 06:00 - 11 Aug 2023 | 18:00")).toBeTruthy();
  });
  it("should show Correct Nursing Tasks when clicked on previous button", async () => {
    MockDate.set("2024-01-05");
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValue(mockShiftResponse);
    const { getAllByText, getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
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
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValue(mockShiftResponse);
    mockGetTimeInSeconds.mockReturnValue(259200);
    const { getAllByText, getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
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
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockNursingTasksResponse)
      .mockReturnValueOnce(mockShiftResponse)
      .mockReturnValue(mockNursingTasksResponse);
    const { getAllByText, getByTestId, queryByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
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
    mockFetchMedicationNursingTasks.mockReturnValueOnce(mockShiftResponse);
    const { getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
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
    mockFetchMedicationNursingTasks
      .mockReturnValueOnce(mockShiftResponse)
      .mockReturnValueOnce(mockShiftResponse);
    mockGetTimeInSeconds.mockReturnValue(0);
    const { getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <NursingTasks patientId="patientid" />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(getByTestId("next-shift").disabled).toEqual(true);
  });
});
