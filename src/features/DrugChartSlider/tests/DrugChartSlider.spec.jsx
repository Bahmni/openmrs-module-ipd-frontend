import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DrugChartSlider from "../components/DrugChartSlider";
import {
  mockStartTimeDrugOrder,
  mockScheduleDrugOrder,
  mockScheduleFrequencies,
  mockStartTimeFrequencies,
  mockDrugOrderFrequencies,
  mockScheduleFrequenciesWithTimings,
  mockScheduleDrugOrderForEdit,
  mockScheduleDrugOrderAsNeeded,
  mockContinuousMedicationDrugOrder,
  mockUpdateMedicationData,
} from "../utils/DrugChartSliderTestUtils";
import "@testing-library/jest-dom";
import mockAdapter from "axios-mock-adapter";
import axios from "axios";
import { DRUG_ORDERS_CONFIG_URL } from "../../../constants";
import MockDate from "mockdate";
import { SliderContext } from "../../../context/SliderContext";
import { IPDContext } from "../../../context/IPDContext";
import { mockConfig } from "../../../utils/CommonUtils";
let mockAxios;

const mockSliderContext = {
  sliderContentModified: {
    treatments: false,
  },
  setSliderContentModified: jest.fn(),
};

const mockHandleAuditEvent = jest.fn();
const mockUpdateMedication = jest.fn();
const mockSaveMedication = jest.fn();

jest.mock('../utils/DrugChartSliderUtils',()=>{
    const originalModule = jest.requireActual("../utils/DrugChartSliderUtils");
    return {
        ...originalModule,
        updateMedication : (medication) => mockUpdateMedication(medication),
        saveMedication : (medication) => mockSaveMedication(medication),
    }
});

describe("DrugChartSlider", () => {
  beforeEach(() => {
    mockAxios = new mockAdapter(axios);
    const drugOrderFrequencies = mockDrugOrderFrequencies;
    mockAxios.onGet(DRUG_ORDERS_CONFIG_URL).reply(200, {
      results: drugOrderFrequencies,
    });
    mockUpdateMedication.mockResolvedValue({
      status: 200,
      data: mockUpdateMedicationData,
    })
    mockSaveMedication.mockResolvedValue({
      status: 200,
      data: mockUpdateMedicationData,
    })
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it("Component renders successfully", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              drugOrder: mockStartTimeDrugOrder,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("Add to Drug Chart")).toBeTruthy();
    });
  });

  it("should show drug name field to be disabled", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              drugOrder: mockScheduleDrugOrder,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const inputElement = screen.getByLabelText("Drug Name");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toHaveStyle("cursor: pointer");
    });
  });

  it("should show dose field to be disabled", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              drugOrder: mockScheduleDrugOrder,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const inputElement = screen.getByLabelText("Dose");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toHaveStyle("cursor: pointer");
    });
  });

  it("should show duration field to be disabled", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              drugOrder: mockScheduleDrugOrder,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const inputElement = screen.getByLabelText("Duration");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toHaveStyle("cursor: pointer");
    });
  });

  it("should show start date field to be disabled", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              drugOrder: mockScheduleDrugOrder,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const inputElement = screen.getByLabelText("Start Date");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toHaveStyle("cursor: pointer");
    });
  });

  it("should show notes field to be enabled", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              drugOrder: mockStartTimeDrugOrder,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const inputElement = screen.getByTestId("notes-section");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toBeDisabled();
    });
  });

  it("should enable schedule when frequency is present in scheduleFrequencies", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const inputElement = screen.getByText("Schedule(s) (24 hrs format)");
      expect(inputElement).toBeTruthy();
    });
  });

  it("should enable start time when frequency is present in scheduleFrequencies", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockStartTimeDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const inputElement = screen.getByText("Start Time (24 hrs format)");
      expect(inputElement).toBeTruthy();
    });
  });

  it("should show Please select Schedule(s) when save is clicked without entering schedule", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
    });
    expect(screen.getByText("Please enter Schedule(s)")).toBeInTheDocument();
  });

  it("should show Please select Start Time when save is clicked without entering start time", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockStartTimeDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
    });
    expect(screen.getByText("Please enter Start Time")).toBeInTheDocument();
  });

  it("Should show invalid time format error message when wrong time is entered in the field", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockStartTimeDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
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
    MockDate.set("2010-12-22T00:00:00+00:00");
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequenciesWithTimings,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      const startTimeInputs = document.querySelectorAll("#time-selector");
      expect(startTimeInputs).toBeDefined();
      expect(startTimeInputs[0].value).toBe("8:00");
      expect(startTimeInputs[1].value).toBe("16:00");
    });
    MockDate.reset();
  });

  it("Should show timing in the schedule fields as hh:mm if the schedule time provided from config is passed", async () => {
    MockDate.set("2010-12-22T00:00:00.000+0530");
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequenciesWithTimings,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      const startTimeInputs = document.querySelectorAll("#time-selector");
      expect(startTimeInputs).toBeDefined();
      expect(startTimeInputs[0].value).toBe("hh:mm");
      expect(startTimeInputs[0]).not.toHaveStyle("cursor: pointer");
      expect(startTimeInputs[1].value).toBe("18:30");
    });
    MockDate.reset();
  });

  it("Should render Drug Chart Slider for schedules with start, subsequent and remainder slots", async () => {
    MockDate.set("2010-12-22T11:08:00.000");
    const { container } = render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequenciesWithTimings,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Schedule time (start date, 24 hrs format)")
      ).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
    MockDate.reset();
  });

  it("Should render Drug Chart Slider for schedules with schedules fields", async () => {
    MockDate.set("2010-12-22T07:08:00.000");
    const { container } = render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequenciesWithTimings,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Schedule(s) (24 hrs format)")
      ).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
    MockDate.reset();
  });

  it("Should render Drug Chart Slider for As Needed medications with not time fields", async () => {
    MockDate.set("2010-12-22T07:08:00.000");
    const { getByText, queryByText } = render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig, handleAuditEvent: mockHandleAuditEvent }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequenciesWithTimings,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrderAsNeeded,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(getByText("Add to Drug Chart")).toBeInTheDocument();
        const saveButton = screen.getByRole("button", { name: "Save" });
        fireEvent.click(saveButton);
        expect(mockHandleAuditEvent).toHaveBeenCalledWith('CREATE_SCHEDULED_MEDICATION_TASK');
    });
    expect(queryByText("Schedule(s)")).toBeNull();
    expect(queryByText("Start Time")).toBeNull();
    MockDate.reset();
  });

  it("should render with previous time on click of edit drug chart link", async () => {
    MockDate.set("2010-12-22T07:08:00.000");
    const { container, getByText } = render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig, handleAuditEvent: mockHandleAuditEvent }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequenciesWithTimings,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrderForEdit,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(
        getByText("Schedule time (start date, 24 hrs format)")
      ).toBeTruthy();
        const saveButton = screen.getByRole("button", { name: "Save" });
        fireEvent.click(saveButton);
      expect(mockHandleAuditEvent).toHaveBeenCalledWith('EDIT_SCHEDULED_MEDICATION_TASK');
    });
    expect(container).toMatchSnapshot();
    MockDate.reset();
  });

  it("should enable start time when frequency and duration is not present for continuous medications", async () => {
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: true,
              scheduleFrequencies: mockScheduleFrequencies,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockContinuousMedicationDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      const inputElement = screen.getByText("Start Time (24 hrs format)");
      expect(inputElement).toBeTruthy();
    });
  });

  it("should enable schedule fields for the configurable time window and show system time for 12-hr format", async () => {
    MockDate.set("2010-12-22T09:00:00.000");
    render(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          <DrugChartSlider
            hostData={{
              enable24HourTimers: false,
              scheduleFrequencies: mockScheduleFrequenciesWithTimings,
              startTimeFrequencies: mockStartTimeFrequencies,
              drugOrder: mockScheduleDrugOrder,
            }}
            hostApi={{}}
          />
        </IPDContext.Provider>
      </SliderContext.Provider>
    );

    await waitFor(() => {
      const startTimeInputs = document.querySelectorAll("#time-selector");
      expect(startTimeInputs).toBeDefined();
      expect(startTimeInputs[0].value).toBe("09:00");
      expect(startTimeInputs[1].value).toBe("04:00");
    });
    MockDate.reset();
  });
});
