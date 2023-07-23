import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DrugChartModal from "./DrugChartModal";
import {
  mockStartTimeDrugOrder,
  mockScheduleDrugOrder,
  mockScheduleFrequencies,
  mockStartTimeFrequencies,
} from "../../test-utils/DrugChartModal/utils";
import "@testing-library/jest-dom";

describe("DrugChartModal", () => {
  it("Component renders successfully", async () => {
    render(
      <DrugChartModal
        hostData={{
          drugOrder: mockStartTimeDrugOrder,
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      expect(screen.getByText("Add to Drug Chart")).toBeTruthy();
    });
  });

  it("should show drug name field to be disabled", async () => {
    render(
      <DrugChartModal
        hostData={{
          drugOrder: mockScheduleDrugOrder,
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      const inputElement = screen.getByLabelText("Drug Name");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toHaveStyle("cursor: pointer");
    });
  });

  it("should show notes field to be enabled", async () => {
    render(
      <DrugChartModal
        hostData={{
          drugOrder: mockStartTimeDrugOrder,
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      const inputElement = screen.getByTestId("notes-section");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toBeDisabled();
    });
  });

  it("should trigger onModalClose event on click of close button", async () => {
    const mockFunction = jest.fn();
    render(
      <DrugChartModal
        hostData={{
          drugOrder: mockStartTimeDrugOrder,
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
        }}
        hostApi={{ onModalClose: mockFunction }}
      />
    );
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText("Close"));
      expect(mockFunction).toHaveBeenCalledWith("drug-chart-modal-close-event");
    });
  });

  it("should enable schedule dropdown when frequency is present in scheduleFrequencies", async () => {
    render(
      <DrugChartModal
        hostData={{
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
          drugOrder: mockScheduleDrugOrder,
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      const inputElement = screen.getByText("Schedule");
      expect(inputElement).toBeTruthy();
    });
  });

  it("should enable start time when frequency is present in scheduleFrequencies", async () => {
    render(
      <DrugChartModal
        hostData={{
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
          drugOrder: mockStartTimeDrugOrder,
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      const inputElement = screen.getByText("Start Time");
      expect(inputElement).toBeTruthy();
    });
  });
});
