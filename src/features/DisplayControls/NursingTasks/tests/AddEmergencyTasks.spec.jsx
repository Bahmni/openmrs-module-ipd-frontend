import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import moment from "moment";
import AddEmergencyTasks from "../components/AddEmergencyTasks";
import {
  DrugOrderConfigMockData,
  MedicationConfigMockData,
  providersMockData,
  searchDrugMockData,
} from "./AddEmergencyTasksMockData";

const mockGetDrugOrdersConfig = jest.fn();
const mockFetchMedicationConfig = jest.fn();
const mockGetProviders = jest.fn();
const mockSearchDrug = jest.fn();

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

jest.mock("../../../../utils/CommonUtils", () => {
  return {
    searchDrugsByName: () => mockSearchDrug(),
  };
});

const selectDrug = async (container, getByText) => {
  const drugNameSearch = container.querySelectorAll(".bx--text-input")[0];
  const targetDrug = "Paracetamol 250 mg Suppository";
  fireEvent.click(drugNameSearch);
  fireEvent.change(drugNameSearch, { target: { value: "Para" } });

  await waitFor(() => {
    expect(
      container.querySelector(".bx--list-box__menu-item__option")
    ).toBeTruthy();
  });
  expect(mockSearchDrug).toHaveBeenCalled();
  fireEvent.click(getByText(targetDrug));
};

describe("AddEmergencyTasks", () => {
  beforeEach(() => {
    mockGetDrugOrdersConfig.mockResolvedValueOnce(DrugOrderConfigMockData);
    mockFetchMedicationConfig.mockResolvedValueOnce(MedicationConfigMockData);
    mockGetProviders.mockResolvedValueOnce(providersMockData);
    mockSearchDrug.mockReturnValue(searchDrugMockData);
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

  it("should allow Drug search", async () => {
    const { container, getByText } = render(
      <AddEmergencyTasks
        patientId={"__patient_uuid__"}
        updateEmergencyTasksSlider={jest.fn}
      />
    );
    await selectDrug(container, getByText);
  });

  it("should set the dose units based on dosage form", async () => {
    const { container, getByText } = render(
      <AddEmergencyTasks
        patientId={"__patient_uuid__"}
        updateEmergencyTasksSlider={jest.fn}
      />
    );
    await selectDrug(container, getByText);
    await waitFor(() => {
      expect(container.querySelectorAll(".bx--text-input")[1].value).toEqual(
        "Tablet(s)"
      );
    });
  });

  it("should set the route based on dosage form", async () => {
    const { container, getByText } = render(
      <AddEmergencyTasks
        patientId={"__patient_uuid__"}
        updateEmergencyTasksSlider={jest.fn}
      />
    );
    await selectDrug(container, getByText);
    await waitFor(() => {
      expect(container.querySelectorAll(".bx--text-input")[2].value).toEqual(
        "Oral"
      );
    });
  });

  it("should enable save when all fields are added", async () => {
    const { container, getByText } = render(
      <AddEmergencyTasks
        patientId={"__patient_uuid__"}
        updateEmergencyTasksSlider={jest.fn}
      />
    );

    const saveButton = screen.getByText("Save");
    expect(saveButton.disabled).toEqual(true);

    // Select Drug
    await selectDrug(container, getByText);

    // Set Dosage
    const dosageIncrementor = container.querySelectorAll(".up-icon")[0];
    fireEvent.click(dosageIncrementor);
    const dosageInput = container.querySelector(
      'input[type="number"][id="Dropdown"]'
    );
    expect(dosageInput.value).toEqual("1");

    // Set Administration Date
    const datePickerInput = container.querySelector(".bx--date-picker__input");
    fireEvent.change(datePickerInput, {
      target: { value: moment().format("MM/DD/YYYY") },
    });
    fireEvent.blur(datePickerInput);
    const dateInputField = container.querySelector(".bx--date-picker__input");
    expect(dateInputField.value).toBe(moment().format("MM/DD/YYYY"));

    //Set Administration Time
    const startTimeSelector = container.querySelector(
      ".bx--time-picker__input-field"
    );
    fireEvent.change(startTimeSelector, { target: { value: "9:30" } });
    fireEvent.blur(startTimeSelector);

    // Set Provider
    const providerSelector = container.querySelectorAll(".bx--text-input")[4];
    fireEvent.change(providerSelector, { target: { value: "Dr." } });
    await waitFor(() => {
      expect(
        container.querySelector(".bx--list-box__menu-item__option")
      ).toBeTruthy();
    });
    fireEvent.click(getByText("Dr. Test"));
    expect(providerSelector.value).toEqual("Dr. Test");

    // Set Notes
    const notesInput = container.querySelector("textarea");
    fireEvent.change(notesInput, { target: { value: "Test Notes" } });
    expect(notesInput.value).toEqual("Test Notes");

    expect(saveButton.disabled).toEqual(false);
  });
});
