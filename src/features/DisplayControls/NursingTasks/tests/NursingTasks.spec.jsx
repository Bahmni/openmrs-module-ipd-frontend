import React from "react";
import { render, waitFor } from "@testing-library/react";
import NursingTasks from "../components/NursingTasks";
import { mockNursingTasksResponse } from "./NursingTasksUtilsMockData";
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

  it("should show no nursing tasks message when nursing task reponse is empty", async () => {
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([]);
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <NursingTasks patientId="patientid" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
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
    const { getAllByText, asFragment } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <NursingTasks patientId="patientid" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getAllByText("Paracetamol 120 mg/5 mL Suspension (Liquid)")
      ).toBeTruthy();
      expect(asFragment()).toMatchSnapshot();
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
      expect(getByText("11/08/2023")).toBeTruthy();
    });
  });
});
