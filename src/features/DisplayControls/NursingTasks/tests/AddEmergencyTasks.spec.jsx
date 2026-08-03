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
import MockDate from "mockdate";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";
import { mockUserWithAllRequiredPrivileges } from "../../../../utils/mockUserData";
import { IntlProvider } from "react-intl";

const mockGetDrugOrdersConfig = jest.fn();
const mockFetchMedicationConfig = jest.fn();
const mockGetProviders = jest.fn();
const mockSearchDrug = jest.fn();
const mockUpdateEmergencyTasksSlider = jest.fn();
const mockSetShowNotification = jest.fn();
const mockSetNotificationMessage = jest.fn();
const mockSetNotificationStatus = jest.fn();
const mockSaveEmergencyMedication = jest.fn();
const mockSaveBulkNonMedicationTasks = jest.fn();
const mockGetEncounterUuid = jest.fn();
const mockGetEncounterType = jest.fn();
const mockHandleAuditEvent = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock crypto.randomUUID for tests
let uuidCounter = 0;
Object.defineProperty(global.crypto, 'randomUUID', {
  value: () => `test-uuid-${++uuidCounter}`,
  writable: true,
});

jest.mock("../utils/EmergencyTasksUtils", () => {
  return {
    getDrugOrdersConfig: () => mockGetDrugOrdersConfig(),
    fetchMedicationConfig: () => mockFetchMedicationConfig(),
    getProviders: () => mockGetProviders(),
    saveEmergencyMedication: () => mockSaveEmergencyMedication(),
    saveBulkNonMedicationTasks: (payload) =>
      mockSaveBulkNonMedicationTasks(payload),
    getEncounterUuid: (payload) => mockGetEncounterUuid(payload),
    getEncounterType: (type) => mockGetEncounterType(type),
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
  const originalModule = jest.requireActual("../../../../utils/CommonUtils");
  return {
    ...originalModule,
    searchDrugsByName: () => mockSearchDrug(),
    getCookies: () => ({
      "bahmni.user.location": JSON.stringify({ uuid: "__location_uuid__" }),
    }),
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
    jest.clearAllMocks();
    mockGetDrugOrdersConfig.mockResolvedValueOnce(DrugOrderConfigMockData);
    mockFetchMedicationConfig.mockResolvedValueOnce(MedicationConfigMockData);
    mockGetProviders.mockResolvedValueOnce(providersMockData);
    mockSearchDrug.mockReturnValue(searchDrugMockData);
    mockSaveEmergencyMedication.mockResolvedValueOnce({
      status: 200,
      data: { message: "Medication task(s) updated successfully" },
    });
    mockGetEncounterType.mockResolvedValue({ uuid: "__encounter_type_uuid__" });
    mockGetEncounterUuid.mockResolvedValue({
      encounterUuid: "__encounter_uuid__",
    });
    mockSaveBulkNonMedicationTasks.mockResolvedValue({ status: 200 });
  });

  beforeEach(() => {
    MockDate.set("2024-01-01");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("should render the component with loading state", () => {
    const { getAllByText, container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            updateEmergencyTasksSlider={jest.fn}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    expect(getAllByText("Loading...")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it("should render the component", async () => {
    const { queryByText, getByText, container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            updateEmergencyTasksSlider={jest.fn}
          />
        </IPDContext.Provider>
      </IntlProvider>
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
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            updateEmergencyTasksSlider={jest.fn}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    await selectDrug(container, getByText);
  });

  it("should set the dose units based on dosage form", async () => {
    const { container, getByText } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            updateEmergencyTasksSlider={jest.fn}
          />
        </IPDContext.Provider>
      </IntlProvider>
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
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            updateEmergencyTasksSlider={jest.fn}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    await selectDrug(container, getByText);
    await waitFor(() => {
      expect(container.querySelectorAll(".bx--text-input")[2].value).toEqual(
        "Oral"
      );
    });
  });

  it("should enable save when all fields are added", async () => {
    MockDate.set("2024-01-05 12:00");
    const { container, getByText } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            updateEmergencyTasksSlider={jest.fn}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    const saveButton = screen.getAllByText("Save")[1];
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
      target: { value: moment().format("m/d/Y") },
    });
    fireEvent.blur(datePickerInput);
    // Verify the date picker reflects a selected date in the format the
    // component renders (e.g. "05 Jan 2024") rather than just existing.
    expect(datePickerInput.value).toMatch(/^\d{2} [A-Za-z]{3} \d{4}$/);

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

  it("should call save by confirming popup when emergency task is saved", async () => {
    MockDate.set("2024-01-05 12:00");
    const { container, getByText } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    const saveButton = screen.getAllByText("Save")[1];
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
      target: { value: "01-01-2024" },
    });
    fireEvent.blur(datePickerInput);

    //Set Administration Time
    const startTimeSelector = container.querySelector(
      ".bx--time-picker__input-field"
    );
    fireEvent.change(startTimeSelector, { target: { value: "12:00" } });
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

    // Set Notes
    const notesInput = container.querySelector("textarea");
    fireEvent.change(notesInput, { target: { value: "Test Notes" } });

    expect(saveButton.disabled).toEqual(false);
    saveButton.click();

    expect(
      screen.getByText("Please confirm the emergency medication task")
    ).toBeTruthy();

    const popupSave = screen.getAllByText("Save")[0];
    popupSave.click();

    await waitFor(() => {
      expect(mockSetShowNotification).toHaveBeenCalledTimes(1);
      expect(mockSetNotificationMessage).toHaveBeenCalledTimes(1);
      expect(mockSetNotificationStatus).toHaveBeenCalledTimes(1);
      expect(mockUpdateEmergencyTasksSlider).toHaveBeenCalledTimes(1);
      expect(mockSaveEmergencyMedication).toHaveBeenCalledTimes(1);
    });
  });

  it("should render confirmation modal on click of cancel button when changes are made", async () => {
    const { container, getByText } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    // Select Drug
    await selectDrug(container, getByText);

    // Set Dosage
    const dosageIncrementor = container.querySelectorAll(".up-icon")[0];
    fireEvent.click(dosageIncrementor);
    const dosageInput = container.querySelector(
      'input[type="number"][id="Dropdown"]'
    );
    expect(dosageInput.value).toEqual("1");

    const cancelButton = screen.getAllByText("Cancel")[1];
    cancelButton.click();

    expect(
      screen.getByText(
        "You will lose the details entered. Do you want to continue?"
      )
    ).toBeTruthy();
  });

  it("should save button be disabled when fields are not filled", async () => {
    MockDate.set("2024-01-05 12:00");
    const { getAllByText } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(getAllByText("Add Nursing Task")).toBeTruthy();
    });

    const Role = screen.getByRole("tab", {
      name: /non - medication/i,
    });
    Role.click();
    await waitFor(() => {
      expect(getAllByText("Task Name")).toBeTruthy();
    });
    const saveButton = screen.getAllByText("Save")[1];
    expect(saveButton.disabled).toEqual(true);
  });

  it("should enable save when all fields are added for Non medication tasks", async () => {
    MockDate.set("2024-01-05 08:00");
    const { getAllByText, container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(getAllByText("Add Nursing Task")).toBeTruthy();
    });

    const Role = screen.getByRole("tab", {
      name: /non - medication/i,
    });
    Role.click();
    await waitFor(() => {
      expect(getAllByText("Task Name")).toBeTruthy();
    });
    const saveButton = screen.getAllByText("Save")[1];
    expect(saveButton.disabled).toEqual(true);

    const startTimeSelector = container.querySelectorAll(
      ".bx--time-picker__input-field"
    )[1];
    fireEvent.change(startTimeSelector, { target: { value: "9:30" } });
    fireEvent.blur(startTimeSelector);

    const tasksInput = container.querySelector(
      'textarea[placeholder="Enter a title for the task "]'
    );
    fireEvent.change(tasksInput, { target: { value: "Test Task" } });
    expect(tasksInput.value).toEqual("Test Task");

    await waitFor(() => {
      expect(saveButton.disabled).toEqual(false);
    });
    saveButton.click();

    await waitFor(() => {
      expect(mockSaveBulkNonMedicationTasks).toHaveBeenCalledTimes(1);
      expect(mockHandleAuditEvent).toHaveBeenCalledWith(
        "CREATE_NON_MEDICATION_TASK"
      );
    });
  });

  it("should hide Medication tab and show Non-Medication tab when hideMedicationTab is true", async () => {
    const { queryByRole, getByRole } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
            hideMedicationTab={true}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    await waitFor(() => {
      expect(
        queryByRole("tab", { name: /^medication$/i })
      ).not.toBeInTheDocument();
      expect(
        getByRole("tab", { name: /non - medication/i })
      ).toBeInTheDocument();
    });
  });

  it("should append a new non-medication task section after clicking Add Task", async () => {
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
            hideMedicationTab={true}
            instruction={"Neurovascular observations 2hrs only"}
            initialTaskName={
              "Instruction for the Ward-Neurovascular observations 2hrs only"
            }
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Add Task +")).toBeInTheDocument();
    });
    expect(screen.getAllByText("Task Name").length).toEqual(1);

    // Prepopulated from initialTaskName prop
    expect(document.querySelectorAll("textarea")[0].value).toEqual(
      "Instruction for the Ward-Neurovascular observations 2hrs only"
    );

    // Click Add Task
    fireEvent.click(screen.getByText("Add Task +"));

    await waitFor(() => {
      expect(screen.getAllByText("Task Name").length).toEqual(2);
      expect(screen.getByText("Remove")).toBeInTheDocument();
      // Replicated task should copy the first task's name
      expect(document.querySelectorAll("textarea")[1].value).toEqual(
        "Instruction for the Ward-Neurovascular observations 2hrs only"
      );
    });
  });

  it("should use current time (not previous task's time) when a new task is replicated", async () => {
    MockDate.set("2024-01-01 09:00");
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
            hideMedicationTab={true}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Add Task +")).toBeInTheDocument();
    });

    // Change the first task's time to 12:30
    const firstTimeInput = container.querySelector(
      ".bx--time-picker__input-field"
    );
    fireEvent.change(firstTimeInput, { target: { value: "12:30" } });
    fireEvent.blur(firstTimeInput);

    // Advance mock time to simulate user clicking "Add More" later
    MockDate.set("2024-01-01 10:15");

    // Click Add Task — new task should default to current time, not 12:30
    fireEvent.click(screen.getByText("Add Task +"));

    await waitFor(() => {
      expect(screen.getAllByText("Task Name").length).toEqual(2);
    });

    const allTimeInputs = container.querySelectorAll(
      ".bx--time-picker__input-field"
    );
    // First task retains 12:30
    expect(allTimeInputs[0].value).toBe("12:30");
    // Second (replicated) task should show current time 10:15, NOT 12:30
    expect(allTimeInputs[1].value).toBe("10:15");
  });

  it("should remove replicated non-medication task section", async () => {
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
            hideMedicationTab={true}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Add Task +")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Add Task +"));
    await waitFor(() =>
      expect(screen.getAllByText("Task Name").length).toEqual(2)
    );

    fireEvent.click(screen.getByText("Remove"));
    await waitFor(() => {
      expect(screen.getAllByText("Task Name").length).toEqual(1);
      expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    });
  });

  it("should default scheduled date to today for non-medication task", async () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AddEmergencyTasks
            patientId={"__patient_uuid__"}
            providerId={"__provider_uuid__"}
            updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
            hideMedicationTab={true}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Add Task +")).toBeInTheDocument();
    });

    const scheduledDateInput = container.querySelector(
      ".bx--date-picker__input"
    );
    const expectedDateFormat = moment().format("DD MMM YYYY");
    expect(scheduledDateInput.value).toMatch(expectedDateFormat);
  });

  describe("non-medication task payload", () => {
    const renderNonMedicationTab = async (
      extraProps = {},
      options = {},
      configOverrides = {}
    ) => {
      const config = {
        ...mockConfig,
        ...configOverrides,
        nursingTaskScheduling: {
          ...mockConfig.nursingTaskScheduling,
          ...(configOverrides.nursingTaskScheduling || {}),
        },
      };

      const utils = render(
        <IntlProvider locale="en">
          <IPDContext.Provider
            value={{
              config,
              handleAuditEvent: mockHandleAuditEvent,
              currentUser: mockUserWithAllRequiredPrivileges,
            }}
          >
            <AddEmergencyTasks
              patientId={"__patient_uuid__"}
              providerId={"__provider_uuid__"}
              updateEmergencyTasksSlider={mockUpdateEmergencyTasksSlider}
              setShowNotification={mockSetShowNotification}
              setNotificationMessage={mockSetNotificationMessage}
              setNotificationStatus={mockSetNotificationStatus}
              hideMedicationTab={true}
              {...extraProps}
            />
          </IPDContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("tab", { name: /non - medication/i })
        ).toBeInTheDocument();
      });

      const { container } = utils;
      if (options.scheduleDateInput) {
        const dateInput = container.querySelector(".bx--date-picker__input");
        fireEvent.change(dateInput, {
          target: { value: options.scheduleDateInput },
        });
        fireEvent.blur(dateInput);
      }
      const timeInput = container.querySelector(
        ".bx--time-picker__input-field"
      );
      fireEvent.change(timeInput, {
        target: { value: options.scheduleTimeInput || "9:00" },
      });
      fireEvent.blur(timeInput);

      const taskInput = container.querySelector("textarea");
      fireEvent.change(taskInput, { target: { value: "Test task" } });

      const saveButton = screen.getAllByText("Save")[1];
      await waitFor(() => expect(saveButton.disabled).toBe(false));
      fireEvent.click(saveButton);

      return utils;
    };

    beforeEach(() => {
      mockGetEncounterType.mockResolvedValue({
        uuid: "__encounter_type_uuid__",
      });
      mockGetEncounterUuid.mockResolvedValue({
        encounterUuid: "__encounter_uuid__",
      });
      mockSaveBulkNonMedicationTasks.mockResolvedValue({ status: 200 });
    });

    afterEach(() => {
      mockGetEncounterType.mockReset();
      mockGetEncounterUuid.mockReset();
      mockSaveBulkNonMedicationTasks.mockReset();
    });

    it("should include focus with FHIR-formatted Observation reference when observationUuid is provided", async () => {
      await renderNonMedicationTab({ observationUuid: "__obs_uuid__" });

      await waitFor(() => {
        expect(mockSaveBulkNonMedicationTasks).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              focus: {
                type: "Observation",
                reference: "Observation/__obs_uuid__",
              },
            }),
          ])
        );
      });
    });

    it("should include basedOn with FHIR-formatted ServiceRequest reference when orderUuid is provided", async () => {
      await renderNonMedicationTab({
        observationUuid: "__obs_uuid__",
        orderUuid: "__order_uuid__",
      });

      await waitFor(() => {
        expect(mockSaveBulkNonMedicationTasks).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              basedOn: {
                type: "ServiceRequest",
                reference: "ServiceRequest/__order_uuid__",
              },
            }),
          ])
        );
      });
    });

    it("should omit basedOn from payload when orderUuid is null", async () => {
      await renderNonMedicationTab({
        observationUuid: "__obs_uuid__",
        orderUuid: null,
      });

      await waitFor(() => {
        expect(mockSaveBulkNonMedicationTasks).toHaveBeenCalled();
        const payload = mockSaveBulkNonMedicationTasks.mock.calls[0][0][0];
        expect(payload).not.toHaveProperty("basedOn");
      });
    });

    it("should omit both focus and basedOn when neither observationUuid nor orderUuid is provided", async () => {
      await renderNonMedicationTab();

      await waitFor(() => {
        expect(mockSaveBulkNonMedicationTasks).toHaveBeenCalled();
        const payload = mockSaveBulkNonMedicationTasks.mock.calls[0][0][0];
        expect(payload).not.toHaveProperty("focus");
        expect(payload).not.toHaveProperty("basedOn");
      });
    });

    it("should include requestedStartTime and requestedEndTime in payload with correct date", async () => {
      await renderNonMedicationTab();

      await waitFor(() => {
        expect(mockSaveBulkNonMedicationTasks).toHaveBeenCalled();
        const payload = mockSaveBulkNonMedicationTasks.mock.calls[0][0][0];

        expect(payload).toHaveProperty("requestedStartTime");
        expect(payload).toHaveProperty("requestedEndTime");
        expect(typeof payload.requestedStartTime).toBe("number");
        expect(typeof payload.requestedEndTime).toBe("number");
      });
    });

    it("should persist the selected scheduled date in non-medication payload", async () => {
      await renderNonMedicationTab(
        {},
        { scheduleDateInput: "03 Jan 2024", scheduleTimeInput: "9:00" }
      );

      await waitFor(() => {
        expect(mockSaveBulkNonMedicationTasks).toHaveBeenCalled();
      });

      const payload = mockSaveBulkNonMedicationTasks.mock.calls[0][0][0];
      const expectedDateTime = moment("03 Jan 2024 9:00", "DD MMM YYYY H:mm");
      const expectedEpochMillis = expectedDateTime.unix() * 1000;

      expect(payload.requestedStartTime).toEqual(expectedEpochMillis);
      expect(payload.requestedEndTime).toEqual(expectedEpochMillis);
    });

    it("should show scheduled date picker when date selection is enabled", async () => {
      const { container } = await renderNonMedicationTab(
        {},
        { scheduleTimeInput: "9:00" },
        { nursingTaskScheduling: { enableDateSelection: true } }
      );

      expect(container.querySelector(".bx--date-picker__input")).toBeTruthy();
    });

    it("should hide scheduled date picker and use today's date when date selection is disabled", async () => {
      const { container } = await renderNonMedicationTab(
        {},
        { scheduleTimeInput: "9:00" },
        { nursingTaskScheduling: { enableDateSelection: false } }
      );

      expect(container.querySelector(".bx--date-picker__input")).toBeFalsy();

      await waitFor(() => {
        expect(mockSaveBulkNonMedicationTasks).toHaveBeenCalled();
      });

      const payload = mockSaveBulkNonMedicationTasks.mock.calls[0][0][0];
      const todayDate = moment().format("DD MMM YYYY");
      const expectedDateTime = moment(`${todayDate} 9:00`, "DD MMM YYYY H:mm");
      const expectedEpochMillis = expectedDateTime.unix() * 1000;

      expect(payload.requestedStartTime).toEqual(expectedEpochMillis);
      expect(payload.requestedEndTime).toEqual(expectedEpochMillis);
    });
  });
});
