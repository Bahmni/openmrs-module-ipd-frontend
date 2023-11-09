import React from "react";
import { render, waitFor } from "@testing-library/react";
import NursingTasks from "../Components/NursingTasks";
import { mockNursingTasksResponse } from "./NursingTasksUtilsMockData";

const mockFetchMedicationNursingTasks = jest.fn();

jest.mock("../utils/NursingTasksUtils", () => {
  const originalModule = jest.requireActual("../utils/NursingTasksUtils");
  return {
    ...originalModule,
    fetchMedicationNursingTasks: () => mockFetchMedicationNursingTasks(),
  };
});

describe("NursingTasks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should show loading state", async () => {
    const { getByText } = render(<NursingTasks patientId="patientid" />);

    await waitFor(() => {
      expect(getByText("Loading...")).toBeTruthy();
    });
  });

  it("should show no nursing tasks message when nursing task reponse is empty", async () => {
    mockFetchMedicationNursingTasks.mockResolvedValueOnce([]);
    const { getByText } = render(<NursingTasks patientId="patientid" />);

    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getByText("No nursing task is scheduled for the patient")
      ).toBeTruthy();
    });
  });

  it("should show nursing tasks when nursing task reponse is not empty", async () => {
    mockFetchMedicationNursingTasks.mockResolvedValueOnce(
      mockNursingTasksResponse
    );
    const { getByText } = render(<NursingTasks patientId="patientid" />);
    await waitFor(() => {
      expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
      expect(
        getByText("Paracetamol 120 mg/5 mL Suspension (Liquid)")
      ).toBeTruthy();
      //   expect(asFragment()).toMatchSnapshot();
    });
  });

  //   it("should show current date", async () => {

  //     mockFetchMedicationNursingTasks.mockResolvedValueOnce(
  //       mockNursingTasksResponse
  //     );
  //     const { getByText } = render(
  //       <NursingTasks patientId="patientid" />
  //     );
  //     await waitFor(() => {
  //       expect(mockFetchMedicationNursingTasks).toHaveBeenCalledTimes(1);
  //       expect(getByText("10/12/2021")).toBeTruthy();
  //     });
  //   });
});
