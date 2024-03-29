import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { CareViewPatients } from "../components/CareViewPatients";
import {
  mockPatientsList,
  mockSearchPatientsList,
  mockSearchEmptyPatientsList,
} from "../../CareViewPatientsSummary/tests/CareViewPatientsSummaryMock";
import { CareViewContext } from "../../../context/CareViewContext";

const mockContext = {
  selectedWard: { label: "ward", value: "uuid" },
  setSelectedWard: jest.fn,
  wardSummary: {
    totalPatients: 27,
  },
  careViewConfig: {
    defaultPageSize: 13,
    pageSizeOptions: [10, 20, 30, 40, 50],
    timeframeLimitInHours: 2,
  },
  ipdConfig: {
    shiftDetails: {
      1: { shiftStartTime: "08:00", shiftEndTime: "19:00" },
      2: { shiftStartTime: "19:00", shiftEndTime: "08:00" },
    },
  },
  setWardSummary: jest.fn,
  refreshPatientList: false,
  headerSelected: "TOTAL_PATIENTS",
  setHeaderSelected: jest.fn,
  provider: { uuid: "provider-uuid" },
};
const mockFetchPatientsList = jest.fn();
const mockFetchPatientsListBySearch = jest.fn();
const mockGetSlotsForPatients = jest.fn();
const mockGetTasksForPatients = jest.fn();

//These are being called in the CareViewPatientSummary child component inside use effect
jest.mock("../../CareViewSummary/utils/CareViewSummary", () => {
  return {
    getSlotsForPatients: () => mockGetSlotsForPatients(),
    getTasksForPatients: () => mockGetTasksForPatients(),
  };
});

jest.mock("../utils/CareViewPatientsUtils", () => {
  const originalModule = jest.requireActual("../utils/CareViewPatientsUtils");
  return {
    ...originalModule,
    fetchPatientsList: () => mockFetchPatientsList(),
    fetchPatientsListBySearch: () => mockFetchPatientsListBySearch(),
  };
});

describe("CareViewPatients", () => {
  beforeEach(() => {
    mockFetchPatientsList.mockResolvedValue({
      status: 200,
      data: mockPatientsList,
    });
    mockGetSlotsForPatients.mockReturnValue([]);
    mockGetTasksForPatients.mockReturnValue([]);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should show search box", async () => {
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });
    expect(screen.getByRole("searchbox")).toBeTruthy();
    expect(
      screen.getByPlaceholderText(
        "Type a minimum of 3 characters to search patient by name, bed number or patient ID"
      )
    ).toBeTruthy();
  });

  it("should not call backend search api when the search value is less than 3", async () => {
    const { container, getByRole } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });

    const searchBox = getByRole("searchbox");
    expect(searchBox).toBeTruthy();
    fireEvent.click(searchBox);
    fireEvent.change(searchBox, { target: { value: "G-" } });
    expect(searchBox.value).toEqual("G-");
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter", charCode: 13 });
    expect(mockFetchPatientsListBySearch).toHaveBeenCalledTimes(0);
  });

  it("should call backend search api when the search value is more than equal to 3", async () => {
    mockFetchPatientsListBySearch.mockResolvedValue({
      status: 200,
      data: mockSearchPatientsList,
    });
    const { container, getByRole, getByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });

    const searchBox = getByRole("searchbox");
    expect(searchBox).toBeTruthy();
    fireEvent.click(searchBox);
    fireEvent.change(searchBox, { target: { value: "G-3" } });
    expect(searchBox.value).toEqual("G-3");
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter", charCode: 13 });
    expect(mockFetchPatientsListBySearch).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(getByText("G-3")).toBeTruthy();
    });
  });

  it("should show inital ward patient info on click of clear search input button", async () => {
    mockFetchPatientsList.mockResolvedValue({
      status: 200,
      data: mockPatientsList,
    });
    const { container, getByRole, getByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });
    const searchBox = getByRole("searchbox");
    fireEvent.click(searchBox);
    fireEvent.change(searchBox, { target: { value: "ETTT" } });
    expect(searchBox.value).toEqual("ETTT");

    const closeButton = getByRole("button", { name: /clear search input/i });
    expect(closeButton).toBeTruthy();
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });

    const updatedSearchBox = getByRole("searchbox");
    await waitFor(() => {
      expect(updatedSearchBox.value).toEqual("");
    });
    expect(getByText("PT51140")).toBeTruthy();
  });

  it("should show No search result message when searched value is not found", async () => {
    mockFetchPatientsListBySearch.mockResolvedValue({
      status: 200,
      data: mockSearchEmptyPatientsList,
    });
    const { container, getByRole, getByText, queryByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });

    const searchBox = getByRole("searchbox");
    expect(searchBox).toBeTruthy();
    fireEvent.click(searchBox);
    fireEvent.change(searchBox, { target: { value: "PT6" } });
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter", charCode: 13 });
    await waitFor(() => {
      expect(
        getByText("Patient not found, please update your search criteria")
      ).toBeTruthy();
    });
    expect(queryByText("PT6")).not.toBeTruthy();
  });

  it("should be searched by bed number", async () => {
    mockFetchPatientsListBySearch.mockResolvedValue({
      status: 200,
      data: mockSearchPatientsList,
    });
    const { container, getByRole, getByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });

    const searchBox = getByRole("searchbox");
    expect(searchBox).toBeTruthy();
    fireEvent.click(searchBox);
    fireEvent.change(searchBox, { target: { value: "D-1" } });
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter", charCode: 13 });
    await waitFor(() => {
      expect(getByText("PT50298")).toBeTruthy();
      expect(
        getByText("AnnonFN-Clxgoajwgo AnnonMN-Borspwocvv AnnonLN-Sdjnncsmhw")
      ).toBeTruthy();
    });
  });

  it("should be searched by patient identifier", async () => {
    mockFetchPatientsListBySearch.mockResolvedValue({
      status: 200,
      data: mockSearchPatientsList,
    });
    const { container, getByRole, getByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });

    const searchBox = getByRole("searchbox");
    expect(searchBox).toBeTruthy();
    fireEvent.click(searchBox);
    fireEvent.change(searchBox, { target: { value: "PT51190" } });
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter", charCode: 13 });
    await waitFor(() => {
      expect(getByText("E-6")).toBeTruthy();
      expect(
        getByText("AnnonFN-Ndddhzfxcp AnnonMN-Sxhubwhrqb AnnonLN-Lxkdndeknk")
      ).toBeTruthy();
    });
  });

  it("should be searched by patient name", async () => {
    mockFetchPatientsListBySearch.mockResolvedValue({
      status: 200,
      data: mockSearchPatientsList,
    });
    const { container, getByRole, getByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container.querySelectorAll(".task-type")).toBeTruthy();
    });

    const searchBox = getByRole("searchbox");
    expect(searchBox).toBeTruthy();
    fireEvent.click(searchBox);
    fireEvent.change(searchBox, { target: { value: "AnnonLN-Gkksnhzbeu" } });
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter", charCode: 13 });
    await waitFor(() => {
      expect(getByText("A-6")).toBeTruthy();
      expect(getByText("PT51140")).toBeTruthy();
    });
  });

  it("should update patient list when refresh patient list value is changed", async () => {
    const { rerender } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(mockFetchPatientsList).toHaveBeenCalledTimes(2);
    });

    rerender(
      <CareViewContext.Provider
        value={{ ...mockContext, refreshPatientList: true }}
      >
        <CareViewPatients callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(mockFetchPatientsList).toHaveBeenCalledTimes(3);
    });
  });
});
