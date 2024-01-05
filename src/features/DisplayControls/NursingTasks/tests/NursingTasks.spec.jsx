import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import NursingTasks from "../components/NursingTasks";
import {
  mockNursingTasksResponse,
  mockShiftResponse,
} from "./NursingTasksUtilsMockData";
import MockDate from "mockdate";
import { SliderContext } from "../../../../context/SliderContext";

const mockFetchMedicationNursingTasks = jest.fn();

jest.mock("../utils/NursingTasksUtils", () => {
  const originalModule = jest.requireActual("../utils/NursingTasksUtils");
  return {
    ...originalModule,
    fetchMedicationNursingTasks: () => mockFetchMedicationNursingTasks(),
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
    MockDate.reset();
  });

  it("should show loading state", async () => {
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <NursingTasks patientId="patientid" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(getByText("Loading...")).toBeTruthy();
    });
  });

  it("should show no pending tasks message when nursing task reponse is empty", async () => {
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([]);

    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <NursingTasks patientId="patientid" />
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
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([]);
    const { getByText, container } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <NursingTasks patientId="patientid" />
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
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([]);
    const { getByText, container } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <NursingTasks patientId="patientid" />
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
        <NursingTasks patientId="patientid" />
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
    MockDate.set("2023-08-11");

    mockFetchMedicationNursingTasks.mockResolvedValueOnce(
      mockNursingTasksResponse
    );
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <NursingTasks patientId="patientid" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
    });
    expect(getByText("11/08/2023 - 11/08/2023")).toBeTruthy();
  });
  it.skip("should show Correct Nursing Tasks when clicked on previous button", async () => {
    MockDate.set("2024-01-05");
    mockFetchMedicationNursingTasks
      .mockResolvedValueOnce(mockNursingTasksResponse)
      .mockReturnValueOnce(
        mockFetchMedicationNursingTasks.mockResolvedValueOnce(mockShiftResponse)
      );
    const { getAllByText, debug, getByTestId } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <NursingTasks patientId="patientid" />
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
    debug();
    expect(
      getAllByText("Amoxicillin 250 mg/5 mL Powder for Oral Suspension")
    ).toBeTruthy();
  });
});
