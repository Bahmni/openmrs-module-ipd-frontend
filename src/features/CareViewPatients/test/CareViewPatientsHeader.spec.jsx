import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CareViewPatientsHeader } from "../components/CareViewPatientsHeader";
import { mockPatientsList } from "../../CareViewPatientsSummary/tests/CareViewPatientsSummaryMock";

const mockHandleKeyPress = jest.fn();
const mockHandleClear = jest.fn();
const mockSearchValue = jest.fn();
const mockUpdateSearchValue = jest.fn();
const mockNavHourEpoch = jest.fn();
const mockNavButtonsDisabled = jest.fn();
const mockHandleNow = jest.fn();
const mockHandleNext = jest.fn();
const mockHandlePrevious = jest.fn();

const mockNavigationHourEpoch = {
  startHourEpoch: 1704110400, //12
  endHourEpoch: 1704117600, //14
};

describe("CareViewPatientsHeader", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should have now, navigation buttons and time frame", async () => {
    render(
      <CareViewPatientsHeader
        patientsSummary={mockPatientsList.admittedPatients}
        handleKeyPress={mockHandleKeyPress}
        handleClear={mockHandleClear}
        searchValue={mockSearchValue}
        updateSearchValue={mockUpdateSearchValue}
        navHourEpoch={mockNavHourEpoch}
        navButtonsDisabled={mockNavButtonsDisabled}
        handleNow={mockHandleNow}
        handleNext={mockHandleNext}
        handlePrevious={mockHandlePrevious}
      />
    );

    expect(screen.getByTestId("now-button")).toBeTruthy();
    expect(screen.getByTestId("previous-button")).toBeTruthy();
    expect(screen.getByTestId("next-button")).toBeTruthy();
    expect(screen.getByTestId("navigation-time")).toBeTruthy();

    screen.debug();
  });
  it("should have called handle now callback on click of Now Button", async () => {
    render(
      <CareViewPatientsHeader
        patientsSummary={mockPatientsList.admittedPatients}
        handleKeyPress={mockHandleKeyPress}
        handleClear={mockHandleClear}
        searchValue={mockSearchValue}
        updateSearchValue={mockUpdateSearchValue}
        navHourEpoch={mockNavigationHourEpoch}
        navButtonsDisabled={mockNavButtonsDisabled}
        handleNow={mockHandleNow}
        handleNext={mockHandleNext}
        handlePrevious={mockHandlePrevious}
      />
    );
    expect(mockHandleNow).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Current Shift")).toBeTruthy();
    fireEvent.click(screen.getByText("Current Shift"));
    expect(mockHandleNow).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/12:00/i)).toBeTruthy();
    expect(screen.getByText(/13:59/i)).toBeTruthy();
    expect(screen.getByText(/01 Jan 2024/i)).toBeTruthy();
  });

  it("should have called handle previous callback on click of left arrow button", async () => {
    render( 
      <CareViewPatientsHeader
        patientsSummary={mockPatientsList.admittedPatients}
        handleKeyPress={mockHandleKeyPress}
        handleClear={mockHandleClear}
        searchValue={mockSearchValue}
        updateSearchValue={mockUpdateSearchValue}
        navHourEpoch={mockNavigationHourEpoch}
        navButtonsDisabled={mockNavButtonsDisabled}
        handleNow={mockHandleNow}
        handleNext={mockHandleNext}
        handlePrevious={mockHandlePrevious}
      />
    );
    expect(mockHandlePrevious).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByTestId("previous-button"));
    expect(mockHandlePrevious).toHaveBeenCalledTimes(1);
  });

  it("should have called handle next callback on click of right arrow button", async () => {
    render(
      <CareViewPatientsHeader
        patientsSummary={mockPatientsList.admittedPatients}
        handleKeyPress={mockHandleKeyPress}
        handleClear={mockHandleClear}
        searchValue={mockSearchValue}
        updateSearchValue={mockUpdateSearchValue}
        navHourEpoch={mockNavigationHourEpoch}
        navButtonsDisabled={mockNavButtonsDisabled}
        handleNow={mockHandleNow}
        handleNext={mockHandleNext}
        handlePrevious={mockHandlePrevious}
      />
    );
    expect(mockHandleNext).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByTestId("next-button"));
    expect(mockHandleNext).toHaveBeenCalledTimes(1);
  });
});
