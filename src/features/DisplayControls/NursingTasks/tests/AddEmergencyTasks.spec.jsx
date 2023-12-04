import React from "react";
import { render, waitFor } from "@testing-library/react";
import AddEmergencyTasks from "../components/AddEmergencyTasks";
import {
  DrugOrderConfigMockData,
  MedicationConfigMockData,
  providersMockData,
} from "./AddEmergencyTasksMockData";

const mockGetDrugOrdersConfig = jest.fn();
const mockFetchMedicationConfig = jest.fn();
const mockGetProviders = jest.fn();

jest.mock("../utils/EmergencyTasksUtils", () => {
  return {
    getDrugOrdersConfig: () => mockGetDrugOrdersConfig(),
    fetchMedicationConfig: () => mockFetchMedicationConfig(),
    getProviders: () => mockGetProviders(),
  };
});

jest.mock("carbon-components-react", () => {
  const originalModule = jest.requireActual("carbon-components-react");
  return {
    ...originalModule,
    Loading: jest.fn(() => <div>Loading...</div>),
  };
});
describe("AddEmergencyTasks", () => {
  beforeEach(() => {
    mockGetDrugOrdersConfig.mockResolvedValueOnce(DrugOrderConfigMockData);
    mockFetchMedicationConfig.mockResolvedValueOnce(MedicationConfigMockData);
    mockGetProviders.mockResolvedValueOnce(providersMockData);
  });

  it("should render the component with loading state", () => {
    const { getByText, container } = render(
      <AddEmergencyTasks
        patientId={"__patient_uuid__"}
        updateEmergencyTasksSlider={jest.fn}
      />
    );
    expect(getByText("Loading...")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it("should render the component", async () => {
    const { queryByText, getByText, container } = render(
      <AddEmergencyTasks
        patientId={"__patient_uuid__"}
        updateEmergencyTasksSlider={jest.fn}
      />
    );
    expect(getByText("Add Nursing Task")).toBeTruthy();
    await waitFor(() => {
      expect(queryByText("Loading...")).toBeFalsy();
      expect(container).toMatchSnapshot();
    });
    expect(mockGetDrugOrdersConfig).toHaveBeenCalled();
    expect(mockFetchMedicationConfig).toHaveBeenCalled();
    expect(mockGetProviders).toHaveBeenCalled();
  });
});
