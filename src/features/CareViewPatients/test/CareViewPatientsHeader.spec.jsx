import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CareViewPatientsHeader } from "../components/CareViewPatientsHeader";
import { mockPatientsList } from "../../CareViewPatientsSummary/tests/CareViewPatientsSummaryMock";
import { items } from "../utils/constants";

const mockHandleKeyPress = jest.fn();
const mockHandleClear = jest.fn();
const mockSearchValue = jest.fn();
const mockUpdateSearchValue = jest.fn();
const mockNavHourEpoch = jest.fn();
const mockNavButtonsDisabled = jest.fn();
const mockHandleNow = jest.fn();
const mockHandleNext = jest.fn();
const mockHandlePrevious = jest.fn();
const mockSetFilterValue = jest.fn();

const mockNavigationHourEpoch = {
  startHourEpoch: 1712138451, //10
  endHourEpoch: 1712145651, //12
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
        navHourEpoch={mockNavigationHourEpoch}
        navButtonsDisabled={mockNavButtonsDisabled}
        handleNow={mockHandleNow}
        handleNext={mockHandleNext}
        handlePrevious={mockHandlePrevious}
        enable24HourTime={false}
      />
    );

    expect(screen.getByTestId("now-button")).toBeTruthy();
    expect(screen.getByTestId("previous-button")).toBeTruthy();
    expect(screen.getByTestId("next-button")).toBeTruthy();
    expect(screen.getByTestId("navigation-time")).toBeTruthy();

    screen.debug();
  });
  it("should have called handle now callback on click of Now Button in 12 houre format", async () => {
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
        enable24HourTime={false}
      />
    );
    expect(mockHandleNow).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Current Period")).toBeTruthy();
    fireEvent.click(screen.getByText("Current Period"));
    expect(mockHandleNow).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/10:00 AM/i)).toBeTruthy();
    expect(screen.getByText(/12:00 PM/i)).toBeTruthy();
    expect(screen.getByText(/03 Apr 2024/i)).toBeTruthy();
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
        enable24HourTime={true}
      />
    );
    expect(mockHandleNow).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Current Period")).toBeTruthy();
    fireEvent.click(screen.getByText("Current Period"));
    expect(mockHandleNow).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/10:00/i)).toBeTruthy();
    expect(screen.getByText(/12:00/i)).toBeTruthy();
    expect(screen.getByText(/03 Apr 2024/i)).toBeTruthy();
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

  it("should have All Tasks as the default dropdown", async () => {
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
        filterValue={items[0]}
        setFilterValue={mockSetFilterValue}
      />
    );
    expect(screen.getByText("All Tasks")).toBeTruthy();
  });

  it("should have other options in the dropdown", async () => {
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
        filterValue={items[0]}
        setFilterValue={items}
      />
    );

    fireEvent.click(screen.getByText("All Tasks"));
    const withoutDefaultDropDown = items.filter(
      (item) => item.text !== "All Tasks"
    );
    withoutDefaultDropDown.forEach((item) => {
      expect(screen.getByText(item.text)).toBeTruthy();
    });
  });
});
