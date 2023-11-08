import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DrugChartSlider from "./DrugChartSlider";
import {
  mockStartTimeDrugOrder,
  mockScheduleDrugOrder,
  mockScheduleFrequencies,
  mockStartTimeFrequencies,
  mockDrugOrderFrequencies,
  mockScheduleFrequenciesWithTimings,
} from "./DrugChartSliderTestUtils";
import "@testing-library/jest-dom";
import mockAdapter from "axios-mock-adapter";
import axios from "axios";
import { DRUG_ORDERS_CONFIG_URL } from "../../constants";

let mockAxios;

describe("DrugChartSlider", () => {
  beforeEach(() => {
    mockAxios = new mockAdapter(axios);
    const drugOrderFrequencies = mockDrugOrderFrequencies;
    mockAxios.onGet(DRUG_ORDERS_CONFIG_URL).reply(200, {
      results: drugOrderFrequencies,
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it("Component renders successfully", async () => {
    render(
      <DrugChartSlider
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
      <DrugChartSlider
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
      <DrugChartSlider
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

  it("should enable schedule dropdown when frequency is present in scheduleFrequencies", async () => {
    render(
      <DrugChartSlider
        hostData={{
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
          drugOrder: mockScheduleDrugOrder,
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      const inputElement = screen.getByText("Schedule(s)");
      expect(inputElement).toBeTruthy();
    });
  });

  it("should enable start time when frequency is present in scheduleFrequencies", async () => {
    render(
      <DrugChartSlider
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

  it("should show Please select Schedule(s) when save is clicked without entering schedule", async () => {
    render(
      <DrugChartSlider
        hostData={{
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
          drugOrder: mockScheduleDrugOrder,
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
    });
    expect(screen.getByText("Please enter Schedule(s)")).toBeInTheDocument();
  });

  it("should show Please select Start Time when save is clicked without entering start time", async () => {
    render(
      <DrugChartSlider
        hostData={{
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
          drugOrder: mockStartTimeDrugOrder,
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
    });
    expect(screen.getByText("Please enter Start Time")).toBeInTheDocument();
  });

  it("Should show invalid time format error message when wrong time is entered in the field", async () => {
    render(
      <DrugChartSlider
        hostData={{
          enable24HourTimers: true,
          scheduleFrequencies: mockScheduleFrequencies,
          startTimeFrequencies: mockStartTimeFrequencies,
          drugOrder: mockStartTimeDrugOrder,
        }}
        hostApi={{}}
      />
    );

    await waitFor(() => {
      const startTimeInput = document.getElementById("time-selector");
      const timeValue = "41:22";
      fireEvent.change(startTimeInput, { target: { value: timeValue } });
    });

    fireEvent.blur(document.getElementById("time-selector"));
    expect(
      screen.getByText("Please enter in 24-hr format")
    ).toBeInTheDocument();
  });

  it("Should show pre-filled timing in the schedule fields if the schedule time is provided from config", async () => {
    render(
      <DrugChartSlider
        hostData={{
          enable24HourTimers: true,
          scheduleFrequencies: mockScheduleFrequenciesWithTimings,
          startTimeFrequencies: mockStartTimeFrequencies,
          drugOrder: mockScheduleDrugOrder,
        }}
        hostApi={{}}
      />
    );

    await waitFor(() => {
      const startTimeInputs = document.querySelectorAll("#time-selector");
      expect(startTimeInputs).toBeDefined();
      expect(startTimeInputs[0].value).toBe("8:00");
      expect(startTimeInputs[1].value).toBe("16:00");
    });
  });
});
