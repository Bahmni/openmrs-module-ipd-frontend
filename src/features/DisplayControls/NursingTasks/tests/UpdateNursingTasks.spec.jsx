import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import UpdateNursingTasks from "../components/UpdateNursingTasks";
import {
  mockMedicationTasks,
  mockPRNMedicationTasks,
  mockNonMedicationTileData,
  mockSystemGeneratedTaskWithMapping,
  mockSystemGeneratedTaskWithoutMapping,
  mockGroupSlotsByOrderId,
  mockUpdateResponse,
} from "./NursingTasksUtilsMockData";
import { IPDContext } from "../../../../context/IPDContext";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import {
  mockConfig,
  mockConfigFor12HourFormat,
} from "../../../../utils/CommonUtils";
import MockDate from "mockdate";
import { IntlProvider } from "react-intl";
import {
  mockUserWithAllRequiredPrivileges,
  mockUserWithoutAnyPrivilege,
} from "../../../../utils/mockUserData";

const mockSetShowNotification = jest.fn();
const mockSetNotificationMessage = jest.fn();
const mockSetNotificationStatus = jest.fn();
const mockSetShowSuccessNotification = jest.fn();
const mockSetSuccessMessage = jest.fn();
const mockUpdateEmergencyTasksSlider = jest.fn();
const mockUpdateNonMedicationTask = jest.fn();
const mockHandleAuditLogEvent = jest.fn();
const mockRefreshDisplayControl = jest.fn();

jest.mock("../utils/NursingTasksUtils", () => {
  const originalModule = jest.requireActual("../utils/NursingTasksUtils");
  return {
    ...originalModule,
    updateNonMedicationTask: () => mockUpdateNonMedicationTask(),
  };
});
describe("UpdateNursingTasksSlider", function () {
  afterEach(() => {
    MockDate.reset();
  });

  it("should render UpdateNursingTasksSlider", function () {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should enable save Button when atleast one task is selected", function () {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const saveButton = screen.getAllByText("Save")[1];
    expect(saveButton.disabled).toEqual(true);
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);
    expect(saveButton.disabled).toEqual(false);
  });

  it("should show notes and time when toggle switch is On", function () {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = container.querySelectorAll(
      ".bx--time-picker__input-field"
    )[0];
    expect(timePicker).toBeTruthy();
    const notes = container.querySelectorAll(".bx--text-area")[0];
    expect(notes).toBeTruthy();
  });

  it("should show time when toggle switch is On for Non medication tasks", function () {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockNonMedicationTileData}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = container.querySelectorAll(".bx--time-picker")[0];
    expect(timePicker).toBeTruthy();
  });

  it("should save when toggle switch is and Time is entered for Non medication tasks", async () => {
    mockUpdateNonMedicationTask.mockResolvedValue(mockUpdateResponse);
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <RefreshDisplayControl.Provider value={mockRefreshDisplayControl}>
            <UpdateNursingTasks
              medicationTasks={mockNonMedicationTileData}
              groupSlotsByOrderId={mockGroupSlotsByOrderId}
              updateNursingTasksSlider={mockUpdateEmergencyTasksSlider}
              patientId="test_patient_uuid"
              providerId="test_provider_uuid"
              setShowSuccessNotification={mockSetShowSuccessNotification}
              setSuccessMessage={mockSetSuccessMessage}
              setShowNotification={mockSetShowNotification}
              setNotificationMessage={mockSetNotificationMessage}
              setNotificationStatus={mockSetNotificationStatus}
            />
          </RefreshDisplayControl.Provider>
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = container.querySelectorAll(".bx--time-picker")[0];
    expect(timePicker).toBeTruthy();

    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSetShowNotification).toHaveBeenCalledTimes(1);
      expect(mockSetNotificationMessage).toHaveBeenCalledTimes(1);
      expect(mockSetNotificationStatus).toHaveBeenCalledTimes(1);
      expect(mockUpdateEmergencyTasksSlider).toHaveBeenCalledTimes(1);
    });
  });

  it("should show warning for empty notes when time is updated", function () {
    MockDate.set("2024-01-01 01:00 PM");
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00" } });
    fireEvent.blur(timePicker);
    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);
    expect(screen.getByText("Please enter notes")).toBeTruthy();
  });

  it("should show warning for empty notes when time in 12 hour format is updated", function () {
    MockDate.set("2024-01-01 01:00 PM");
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfigFor12HourFormat,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00 PM" } });
    fireEvent.blur(timePicker);
    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);
    expect(screen.getByText("Please enter notes")).toBeTruthy();
  });

  it("should render confirmation modal on click of save button", function () {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00" } });
    fireEvent.blur(timePicker);

    const notes = screen.getAllByRole("textbox")[1];
    fireEvent.change(notes, { target: { value: "test notes" } });
    fireEvent.blur(notes);

    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);

    expect(screen.getByText("Please confirm your nursing tasks")).toBeTruthy();
  });

  it("should render confirmation modal on click of save button when time is in 12 hour format", function () {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfigFor12HourFormat,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00 PM" } });
    fireEvent.blur(timePicker);

    const notes = screen.getAllByRole("textbox")[1];
    fireEvent.change(notes, { target: { value: "test notes" } });
    fireEvent.blur(notes);

    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);

    expect(screen.getByText("Please confirm your nursing tasks")).toBeTruthy();
  });

  it("should close the slider on click of cancel button when no changes are made", function () {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const cancelButton = screen.getAllByText("Cancel")[1];
    fireEvent.click(cancelButton);
    expect(container).toMatchSnapshot();
  });

  it("should render confirmation modal on click of cancel button when changes are made", function () {
    MockDate.set("2024-01-01 13:00");
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00" } });
    fireEvent.blur(timePicker);

    const notes = screen.getAllByRole("textbox")[1];
    fireEvent.change(notes, { target: { value: "test notes" } });
    fireEvent.blur(notes);

    const cancelButton = screen.getAllByText("Cancel")[1];
    fireEvent.click(cancelButton);
    expect(
      screen.getByText(
        "You will lose the details entered. Do you want to continue?"
      )
    ).toBeTruthy();
  });

  it("should render confirmation modal on click of cancel button when changes are made when time is in 12 hour format", function () {
    MockDate.set("2024-01-01 01:00 PM");
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfigFor12HourFormat,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00 PM" } });
    fireEvent.blur(timePicker);

    const notes = screen.getAllByRole("textbox")[1];
    fireEvent.change(notes, { target: { value: "test notes" } });
    fireEvent.blur(notes);

    const cancelButton = screen.getAllByText("Cancel")[1];
    fireEvent.click(cancelButton);
    expect(
      screen.getByText(
        "You will lose the details entered. Do you want to continue?"
      )
    ).toBeTruthy();
  });

  it("should show notes error when time is greater than administered time window", function () {
    MockDate.set("2024-01-01 13:00");
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowSuccessNotification={jest.fn()}
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00" } });
    fireEvent.blur(timePicker);

    const notes = screen.getAllByRole("textbox")[1];
    fireEvent.change(notes, { target: { value: "test notes" } });
    fireEvent.blur(notes);

    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);

    expect("Please enter notes").toBeTruthy();
  });

  it("should show notes error when time in 12 hour format is greater than administered time window", function () {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfigFor12HourFormat,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00 PM" } });
    fireEvent.blur(timePicker);

    const notes = screen.getAllByRole("textbox")[1];
    fireEvent.change(notes, { target: { value: "test notes" } });
    fireEvent.blur(notes);

    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);

    expect("Please enter notes").toBeTruthy();
  });

  it("should show OverflowMenu for a task", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    expect(container.querySelectorAll(".bx--overflow-menu")).toBeTruthy();
  });

  it("should show Skip Drug option on click of Overflow menu button", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Skip Drug")).toBeTruthy();
  });

  it("should hide the Administer Done toggle button on click of Skip Drug button", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={[mockMedicationTasks[0]]}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    const skipDrugButton = screen.getByText("Skip Drug");
    fireEvent.click(skipDrugButton);
    expect(container.querySelectorAll(".bx--toggle__switch")).toHaveLength(0);
  });

  it("should show notes as mandatory when Skip Drug button is clicked", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={[mockMedicationTasks[0]]}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    const skipDrugButton = screen.getByText("Skip Drug");
    fireEvent.click(skipDrugButton);
    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);
    expect(screen.getByText("Please enter notes")).toBeTruthy();
  });

  it("should disable Done toggle if the task is not relevant", () => {
    MockDate.set("2023-11-21 6:00");
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockPRNMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    expect(screen.getByTestId("done-toggle").disabled).toBe(true);
  });

  it("should not show overflow menu for scheduled for text for PRN Nursing Task", async () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockPRNMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const scheduledFor = screen.queryByText("Scheduled for");
    expect(scheduledFor).toBeNull();
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    expect(overflowMenuButton).not.toBeTruthy();
  });

  it("should show PRN confirm message while saving PRN task", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockPRNMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00" } });
    fireEvent.blur(timePicker);

    const notes = screen.getAllByRole("textbox")[1];
    fireEvent.change(notes, { target: { value: "test notes" } });
    fireEvent.blur(notes);

    const saveButton = screen.getAllByText("Save")[1];
    fireEvent.click(saveButton);

    expect(screen.getByText("Please confirm your PRN task")).toBeTruthy();
  });

  it("should show toggle disabled when privileges are not preset", function () {
    const { queryAllByTestId, container } = render(
      <IntlProvider locale="en" messages={{}}>
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithoutAnyPrivilege,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockMedicationTasks}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const toggleButton = queryAllByTestId("done-toggle")[0];
    expect(toggleButton.disabled).toBeTruthy();
    expect(container.querySelectorAll(".bx--overflow-menu")).toHaveLength(0);
  });

  it("should render system-generated non-medication task name as a form link when mapping and form uuid exist", () => {
    const systemTask = [
      {
        drugName: "Complete Nursing Initial Assessment Form",
        uuid: "system-task-uuid",
        startTimeInEpochSeconds: 1703601000,
        startTime: "16:38",
        isDisabled: false,
        taskType: { display: "nursing_activity_system" },
        isANonMedicationTask: true,
      },
    ];

    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: {
              ...mockConfig,
              taskToFormMapping: {
                "Complete Nursing Initial Assessment Form":
                  "Nursing Initial Assessment",
              },
            },
            allFormsSummary: [
              {
                name: "Nursing Initial Assessment",
                version: "1",
                uuid: "form-uuid-1",
              },
            ],
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={systemTask}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    const link = screen.getByRole("link", {
      name: "Complete Nursing Initial Assessment Form",
    });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toContain("/form/form-uuid-1");
  });

  it("should render non-system non-medication task name as plain text and not as a link", () => {
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            allFormsSummary: [
              {
                name: "Nursing Initial Assessment",
                version: "1",
                uuid: "form-uuid-1",
              },
            ],
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockNonMedicationTileData}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    expect(screen.getByText("Non-Medication task")).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: "Non-Medication task" })
    ).toBeNull();
  });

  it("should render system-generated task name with form mapping as a hyperlink", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: {
              ...mockConfig,
              taskToFormMapping: {
                "Complete Nursing Initial Assessment Form":
                  "Nursing Initial Assessment",
              },
            },
            allFormsSummary: [
              {
                name: "Nursing Initial Assessment",
                version: "1",
                uuid: "form-uuid-123",
              },
            ],
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockSystemGeneratedTaskWithMapping}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="patient-uuid-123"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    const link = screen.getByRole("link", {
      name: "Complete Nursing Initial Assessment Form",
    });
    expect(link).toBeTruthy();
    expect(container.querySelector("a.task-form-link")).toHaveAttribute(
      "href",
      "/bahmni/clinical/index.html#/default/patient/patient-uuid-123/dashboard/concept-set-group/observations/form/form-uuid-123"
    );
  });

  it("should render system-generated task name without form mapping as plain text", () => {
    render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: {
              ...mockConfig,
              taskToFormMapping: {},
            },
            allFormsSummary: [
              {
                name: "Nursing Initial Assessment",
                version: "1",
                uuid: "form-uuid-123",
              },
            ],
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockSystemGeneratedTaskWithoutMapping}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="patient-uuid-123"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );

    expect(screen.getByText("Unknown System Task")).toBeTruthy();
    expect(
      screen.queryByRole("link", { name: "Unknown System Task" })
    ).toBeNull();
  });

  it("should show Stop Task option on click of Overflow menu button for non-medication tasks", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={mockNonMedicationTileData}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Stop Task")).toBeTruthy();
  });

  it("should hide the Administer Done toggle button on click of Stop Task button", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={[mockNonMedicationTileData[0]]}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    const stopTaskButton = screen.getByText("Stop Task");
    fireEvent.click(stopTaskButton);
    expect(container.querySelectorAll(".bx--toggle__switch")).toHaveLength(0);
  });

  it("should enable save button when Stop Task is clicked", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={[mockNonMedicationTileData[0]]}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const saveButton = screen.getAllByText("Save")[1];
    expect(saveButton.disabled).toBe(true);

    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    const stopTaskButton = screen.getByText("Stop Task");
    fireEvent.click(stopTaskButton);

    expect(saveButton.disabled).toBe(false);
  });

  it("should show Unstop Task option when task is already stopped", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={[mockNonMedicationTileData[0]]}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    const stopTaskButton = screen.getByText("Stop Task");
    fireEvent.click(stopTaskButton);

    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Unstop Task")).toBeTruthy();
    expect(screen.queryByText("Stop Task")).toBeNull();
  });

  it("should not show Stop Task option for medication tasks", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={[mockMedicationTasks[0]]}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    expect(screen.queryByText("Stop Task")).toBeNull();
  });

  it("should hide the Done toggle when Stop Task is clicked", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <UpdateNursingTasks
            medicationTasks={[mockNonMedicationTileData[0]]}
            groupSlotsByOrderId={mockGroupSlotsByOrderId}
            updateNursingTasksSlider={jest.fn}
            patientId="test_patient_uuid"
            providerId="test_provider_uuid"
            setShowNotification={mockSetShowNotification}
            setNotificationMessage={mockSetNotificationMessage}
            setNotificationStatus={mockSetNotificationStatus}
          />
        </IPDContext.Provider>
      </IntlProvider>
    );
    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];
    fireEvent.click(overflowMenuButton);
    const stopTaskButton = screen.getByText("Stop Task");
    fireEvent.click(stopTaskButton);

    expect(container.querySelectorAll(".bx--toggle__switch")).toHaveLength(0);
  });

  it("should deactivate Stop when Skip is activated (mutual exclusivity)", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <RefreshDisplayControl.Provider value={mockRefreshDisplayControl}>
            <UpdateNursingTasks
              medicationTasks={[mockNonMedicationTileData[0]]}
              groupSlotsByOrderId={mockGroupSlotsByOrderId}
              updateNursingTasksSlider={jest.fn}
              patientId="test_patient_uuid"
              providerId="test_provider_uuid"
              setShowNotification={mockSetShowNotification}
              setNotificationMessage={mockSetNotificationMessage}
              setNotificationStatus={mockSetNotificationStatus}
            />
          </RefreshDisplayControl.Provider>
        </IPDContext.Provider>
      </IntlProvider>
    );

    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];

    fireEvent.click(overflowMenuButton);
    let stopTaskButton = screen.getByText("Stop Task");
    fireEvent.click(stopTaskButton);

    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Unstop Task")).toBeTruthy();
    expect(screen.queryByText("Stop Task")).toBeNull();

    let skipDrugButton = screen.getByText("Skip Task");
    fireEvent.click(skipDrugButton);

    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Un-Skip Task")).toBeTruthy();
    expect(screen.queryByText("Skip Task")).toBeNull();
    expect(screen.getByText("Stop Task")).toBeTruthy(); // Stop Task should reappear
    expect(screen.queryByText("Unstop Task")).toBeNull(); // Unstop should disappear
  });

  it("should deactivate Skip when Stop is activated (mutual exclusivity)", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <RefreshDisplayControl.Provider value={mockRefreshDisplayControl}>
            <UpdateNursingTasks
              medicationTasks={[mockNonMedicationTileData[0]]}
              groupSlotsByOrderId={mockGroupSlotsByOrderId}
              updateNursingTasksSlider={jest.fn}
              patientId="test_patient_uuid"
              providerId="test_provider_uuid"
              setShowNotification={mockSetShowNotification}
              setNotificationMessage={mockSetNotificationMessage}
              setNotificationStatus={mockSetNotificationStatus}
            />
          </RefreshDisplayControl.Provider>
        </IPDContext.Provider>
      </IntlProvider>
    );

    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];

    fireEvent.click(overflowMenuButton);
    let skipTaskButton = screen.getByText("Skip Task");
    fireEvent.click(skipTaskButton);

    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Un-Skip Task")).toBeTruthy();
    expect(screen.queryByText("Skip Task")).toBeNull();

    let stopTaskButton = screen.getByText("Stop Task");
    fireEvent.click(stopTaskButton);

    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Unstop Task")).toBeTruthy();
    expect(screen.queryByText("Stop Task")).toBeNull();
    expect(screen.getByText("Skip Task")).toBeTruthy(); // Skip Task should reappear
    expect(screen.queryByText("Un-Skip Task")).toBeNull(); // Un-Skip should disappear
  });

  it("should not allow both Skip and Stop to be active simultaneously", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <IPDContext.Provider
          value={{
            config: mockConfig,
            handleAuditEvent: mockHandleAuditLogEvent,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <RefreshDisplayControl.Provider value={mockRefreshDisplayControl}>
            <UpdateNursingTasks
              medicationTasks={[mockNonMedicationTileData[0]]}
              groupSlotsByOrderId={mockGroupSlotsByOrderId}
              updateNursingTasksSlider={jest.fn}
              patientId="test_patient_uuid"
              providerId="test_provider_uuid"
              setShowNotification={mockSetShowNotification}
              setNotificationMessage={mockSetNotificationMessage}
              setNotificationStatus={mockSetNotificationStatus}
            />
          </RefreshDisplayControl.Provider>
        </IPDContext.Provider>
      </IntlProvider>
    );

    const overflowMenuButton =
      container.querySelectorAll(".bx--overflow-menu")[0];

    fireEvent.click(overflowMenuButton);
    let skipTaskButton = screen.getByText("Skip Task");
    fireEvent.click(skipTaskButton);

    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Un-Skip Task")).toBeTruthy();
    expect(screen.queryByText("Skip Task")).toBeNull();
    expect(screen.getByText("Stop Task")).toBeTruthy();
    expect(screen.queryByText("Unstop Task")).toBeNull();

    fireEvent.click(screen.getByText("Stop Task"));

    fireEvent.click(overflowMenuButton);
    expect(screen.getByText("Unstop Task")).toBeTruthy();
    expect(screen.queryByText("Stop Task")).toBeNull();
    expect(screen.getByText("Skip Task")).toBeTruthy();
    expect(screen.queryByText("Un-Skip Task")).toBeNull();
  });
});
