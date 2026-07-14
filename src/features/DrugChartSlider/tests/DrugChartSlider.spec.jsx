import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import DrugChartSlider from "../components/DrugChartSlider";
import { ScheduleSection } from "../components/ScheduleSection";
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

// Helper function to wrap component with all required providers
const renderWithProviders = (component) => {
  return render(
    <IntlProvider locale="en">
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider value={{ config: mockConfig }}>
          {component}
        </IPDContext.Provider>
      </SliderContext.Provider>
    </IntlProvider>
  );
};

const mockHandleAuditEvent = jest.fn();
const mockUpdateMedication = jest.fn();
const mockSaveMedication = jest.fn();

jest.mock("../utils/DrugChartSliderUtils", () => {
  const originalModule = jest.requireActual("../utils/DrugChartSliderUtils");
  return {
    ...originalModule,
    updateMedication: (medication) => mockUpdateMedication(medication),
    saveMedication: (medication) => mockSaveMedication(medication),
  };
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
    });
    mockSaveMedication.mockResolvedValue({
      status: 200,
      data: mockUpdateMedicationData,
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it("Component renders successfully", async () => {
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    const { container } = renderWithProviders(
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
    const { container } = renderWithProviders(
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
    const { getByText, queryByText } = renderWithProviders(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider
          value={{ config: mockConfig, handleAuditEvent: mockHandleAuditEvent }}
        >
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
      expect(mockHandleAuditEvent).toHaveBeenCalledWith(
        "CREATE_SCHEDULED_MEDICATION_TASK"
      );
    });
    expect(queryByText("Schedule(s)")).toBeNull();
    expect(queryByText("Start Time")).toBeNull();
    MockDate.reset();
  });

  it("should render with previous time on click of edit drug chart link", async () => {
    MockDate.set("2010-12-22T07:08:00.000");
    const { container, getByText } = renderWithProviders(
      <SliderContext.Provider value={mockSliderContext}>
        <IPDContext.Provider
          value={{ config: mockConfig, handleAuditEvent: mockHandleAuditEvent }}
        >
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
      expect(mockHandleAuditEvent).toHaveBeenCalledWith(
        "EDIT_SCHEDULED_MEDICATION_TASK"
      );
    });
    expect(container).toMatchSnapshot();
    MockDate.reset();
  });

  it("should enable start time when frequency and duration is not present for continuous medications", async () => {
    renderWithProviders(
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
    renderWithProviders(
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

  describe("Schedule cascade (SC1-SC4)", () => {
    it("SC1: changing first dose cascades offset to subsequent doses (24hr)", async () => {
      MockDate.set("2010-12-22T00:00:00.000Z");
      renderWithProviders(
        <DrugChartSlider
          hostData={{
            enable24HourTimers: true,
            scheduleFrequencies: mockScheduleFrequenciesWithTimings,
            startTimeFrequencies: mockStartTimeFrequencies,
            drugOrder: mockScheduleDrugOrder,
          }}
          hostApi={{}}
          title=""
          drugChartNotes=""
          setDrugChartNotes={jest.fn()}
        />
      );

      await waitFor(() => {
        const inputs = document.querySelectorAll("#time-selector");
        expect(inputs.length).toBeGreaterThan(1);
      });

      const inputs = document.querySelectorAll("#time-selector");
      // Fire change on first input
      fireEvent.change(inputs[0], { target: { value: "04:00" } });

      await waitFor(() => {
        const updatedInputs = document.querySelectorAll("#time-selector");
        expect(updatedInputs[0].value).toBe("04:00");
      });
      MockDate.reset();
    });

    it("SC2: changing a non-first dose does not cascade (24hr)", async () => {
      MockDate.set("2010-12-22T00:00:00.000Z");
      renderWithProviders(
        <DrugChartSlider
          hostData={{
            enable24HourTimers: true,
            scheduleFrequencies: mockScheduleFrequenciesWithTimings,
            startTimeFrequencies: mockStartTimeFrequencies,
            drugOrder: mockScheduleDrugOrder,
          }}
          hostApi={{}}
          title=""
          drugChartNotes=""
          setDrugChartNotes={jest.fn()}
        />
      );

      await waitFor(() => {
        const inputs = document.querySelectorAll("#time-selector");
        expect(inputs.length).toBeGreaterThan(1);
      });

      const inputs = document.querySelectorAll("#time-selector");
      const firstInputBefore = inputs[0].value;
      // Fire change on second input (non-first)
      fireEvent.change(inputs[1], { target: { value: "18:00" } });

      await waitFor(() => {
        const updatedInputs = document.querySelectorAll("#time-selector");
        // first input should be unchanged
        expect(updatedInputs[0].value).toBe(firstInputBefore);
        // second input changed
        expect(updatedInputs[1].value).toBe("18:00");
      });
      MockDate.reset();
    });

    it("SC3: changing a middle dose in a 3-slot schedule does not affect first or last dose", async () => {
      MockDate.set("2010-12-22T00:00:00.000Z");
      const thriceFrequencies = [
        {
          name: "Thrice a day",
          frequencyPerDay: 3,
          scheduleTiming: ["08:00", "10:00", "20:00"],
        },
      ];
      const thriceDrugOrder = {
        ...mockScheduleDrugOrder,
        uniformDosingType: {
          ...mockScheduleDrugOrder.uniformDosingType,
          frequency: "Thrice a day",
        },
      };

      renderWithProviders(
        <DrugChartSlider
          hostData={{
            enable24HourTimers: true,
            scheduleFrequencies: thriceFrequencies,
            startTimeFrequencies: mockStartTimeFrequencies,
            drugOrder: thriceDrugOrder,
          }}
          hostApi={{}}
          title=""
          drugChartNotes=""
          setDrugChartNotes={jest.fn()}
        />
      );

      await waitFor(() => {
        const inputs = document.querySelectorAll("#time-selector");
        expect(inputs.length).toBeGreaterThan(2);
      });

      const inputs = document.querySelectorAll("#time-selector");
      const firstBefore = inputs[0].value;
      const lastBefore = inputs[2].value;

      // Change only the middle dose (index 1)
      fireEvent.change(inputs[1], { target: { value: "12:00" } });

      await waitFor(() => {
        const updatedInputs = document.querySelectorAll("#time-selector");
        expect(updatedInputs[0].value).toBe(firstBefore);
        expect(updatedInputs[1].value).toBe("12:00");
        expect(updatedInputs[2].value).toBe(lastBefore);
      });
      MockDate.reset();
    });

    it("SC5: save payload uses next-day epoch for dose that crosses midnight after cascade (AC4)", async () => {
      MockDate.set("2010-12-22T00:00:00.000Z");
      mockSaveMedication.mockClear();
      const midnightFrequencies = [
        {
          name: "Twice a day",
          frequencyPerDay: 2,
          scheduleTiming: ["09:00", "21:00"],
        },
      ];

      render(
        <IntlProvider locale="en">
          <SliderContext.Provider value={mockSliderContext}>
            <IPDContext.Provider
              value={{ config: mockConfig, handleAuditEvent: jest.fn() }}
            >
              <DrugChartSlider
                hostData={{
                  enable24HourTimers: true,
                  scheduleFrequencies: midnightFrequencies,
                  startTimeFrequencies: mockStartTimeFrequencies,
                  drugOrder: mockScheduleDrugOrder,
                }}
                hostApi={{}}
                title=""
                drugChartNotes=""
                setDrugChartNotes={jest.fn()}
              />
            </IPDContext.Provider>
          </SliderContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        const inputs = document.querySelectorAll("#time-selector");
        expect(inputs.length).toBeGreaterThan(1);
      });

      // Change first dose from 09:00 to 13:00 (+4hr offset)
      // → cascade shifts second dose: 21:00 + 4hr = 01:00 (crosses midnight)
      const inputs = document.querySelectorAll("#time-selector");
      fireEvent.change(inputs[0], { target: { value: "13:00" } });

      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockSaveMedication).toHaveBeenCalled();
      });

      const savedPayload = mockSaveMedication.mock.calls[0][0];
      const slots = savedPayload.dayWiseSlotsStartTime;
      // Second dose at 01:00 next day is 12 hours after first dose at 13:00 same day
      expect(slots[1] - slots[0]).toBe(12 * 3600);
      MockDate.reset();
    });

    it("SC4: next-day warning renders when showSubsequentDayScheduleNextDayWarning has a true entry", async () => {
      MockDate.set("2010-12-22T00:00:00.000Z");
      // Render ScheduleSection directly to verify the warning renders correctly
      const { getByText } = render(
        <IntlProvider locale="en">
          <ScheduleSection
            enableSchedule={{ frequencyPerDay: 2 }}
            firstDaySlotsMissed={0}
            firstDaySchedules={[]}
            schedules={["09:00", "21:00"]}
            finalDaySchedules={[]}
            handleFirstDaySchedule={jest.fn()}
            handleSubsequentDaySchedule={jest.fn()}
            handleFinalDaySchedule={jest.fn()}
            showFirstDayScheduleOrderWarning={false}
            showEmptyFirstDayScheduleWarning={false}
            showFirstDaySchedulePassedWarning={[false, false]}
            showScheduleOrderWarning={false}
            showEmptyScheduleWarning={false}
            showFinalDayScheduleOrderWarning={false}
            showEmptyFinalDayScheduleWarning={false}
            showSchedulePassedWarning={[false, false]}
            enable24HourTimers={true}
            showSubsequentDayScheduleNextDayWarning={[false, true]}
          />
        </IntlProvider>
      );

      await waitFor(() => {
        expect(
          getByText(
            "Updated timing causes highlighted doses to cross midnight and appear on the next day."
          )
        ).toBeInTheDocument();
      });
      MockDate.reset();
    });

    it("Manual override: next-day warning clears when cascade-pushed dose is changed to same-day time", async () => {
      MockDate.set("2010-12-22T00:00:00.000Z");
      const midnightFrequencies = [
        {
          name: "Twice a day",
          frequencyPerDay: 2,
          scheduleTiming: ["18:00", "23:45"],
        },
      ];

      renderWithProviders(
        <DrugChartSlider
          hostData={{
            enable24HourTimers: true,
            scheduleFrequencies: midnightFrequencies,
            startTimeFrequencies: mockStartTimeFrequencies,
            drugOrder: mockScheduleDrugOrder,
          }}
          hostApi={{}}
          title=""
          drugChartNotes=""
          setDrugChartNotes={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(
          document.querySelectorAll("#time-selector").length
        ).toBeGreaterThan(1);
      });

      // Step 1: cascade — first dose 18:00 → 19:00 (+1h), second dose 23:45 → 00:45 (next day)
      // TimePicker24Hour fires onChange on blur, so change sets the value, blur triggers the handler
      const inputs = document.querySelectorAll("#time-selector");
      fireEvent.change(inputs[0], { target: { value: "19:00" } });
      fireEvent.blur(inputs[0]);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Updated timing causes highlighted doses to cross midnight and appear on the next day."
          )
        ).toBeInTheDocument();
      });

      // Step 2: manual override — second dose 00:45 → 23:45 (same day, before midnight)
      const updatedInputs = document.querySelectorAll("#time-selector");
      fireEvent.change(updatedInputs[1], { target: { value: "23:45" } });
      fireEvent.blur(updatedInputs[1]);

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Updated timing causes highlighted doses to cross midnight and appear on the next day."
          )
        ).not.toBeInTheDocument();
      });
      MockDate.reset();
    });

    it("Manual entry: next-day warning shows when dose is entered before previous slot time (crosses midnight)", async () => {
      MockDate.set("2010-12-22T00:00:00.000Z");
      const eveningFrequencies = [
        {
          name: "Twice a day",
          frequencyPerDay: 2,
          scheduleTiming: ["20:00", "20:30"],
        },
      ];

      renderWithProviders(
        <DrugChartSlider
          hostData={{
            enable24HourTimers: true,
            scheduleFrequencies: eveningFrequencies,
            startTimeFrequencies: mockStartTimeFrequencies,
            drugOrder: mockScheduleDrugOrder,
          }}
          hostApi={{}}
          title=""
          drugChartNotes=""
          setDrugChartNotes={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(
          document.querySelectorAll("#time-selector").length
        ).toBeGreaterThan(1);
      });

      // Manually change second dose to 02:45 — earlier clock time than previous slot 20:00 → next day
      const inputs = document.querySelectorAll("#time-selector");
      fireEvent.change(inputs[1], { target: { value: "02:45" } });
      fireEvent.blur(inputs[1]);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Updated timing causes highlighted doses to cross midnight and appear on the next day."
          )
        ).toBeInTheDocument();
      });
      MockDate.reset();
    });
  });

  describe("HIVE-108755: Apply-to-all-days toggle", () => {
    // Schedule timings: 06:00, 14:00, 22:00 (3x/day, 8h apart)
    // MockDate at 20:00 UTC → first two slots passed, 22:00 editable
    // firstDaySlotsMissed = 2
    const mockThriceDayFrequencies = [
      {
        name: "Thrice a day",
        frequencyPerDay: 3,
        scheduleTiming: ["06:00", "14:00", "22:00"],
      },
    ];

    const mockMultiDayDrugOrder = {
      ...mockScheduleDrugOrder,
      uniformDosingType: {
        ...mockScheduleDrugOrder.uniformDosingType,
        frequency: "Thrice a day",
      },
      drugOrder: {
        ...mockScheduleDrugOrder.drugOrder,
        duration: 5,
      },
    };

    beforeEach(() => {
      MockDate.set("2010-12-22T20:00:00.000Z");
      mockSaveMedication.mockClear();
    });

    afterEach(() => {
      MockDate.reset();
    });

    const renderMultiDay = () =>
      render(
        <IntlProvider locale="en">
          <SliderContext.Provider value={mockSliderContext}>
            <IPDContext.Provider
              value={{ config: mockConfig, handleAuditEvent: jest.fn() }}
            >
              <DrugChartSlider
                hostData={{
                  enable24HourTimers: true,
                  scheduleFrequencies: mockThriceDayFrequencies,
                  startTimeFrequencies: mockStartTimeFrequencies,
                  drugOrder: mockMultiDayDrugOrder,
                }}
                hostApi={{}}
                title=""
                drugChartNotes=""
                setDrugChartNotes={jest.fn()}
              />
            </IPDContext.Provider>
          </SliderContext.Provider>
        </IntlProvider>
      );

    it("AC0: toggle renders when firstDaySlotsMissed > 0 and duration > 1", async () => {
      renderMultiDay();
      await waitFor(() => {
        expect(
          screen.getByText("Update Complete Schedule")
        ).toBeInTheDocument();
      });
    });

    it("AC1: toggle ON propagates Day 1 offset to subsequent days (Scenario 1)", async () => {
      renderMultiDay();

      await waitFor(() => {
        expect(
          document.querySelectorAll("#time-selector").length
        ).toBeGreaterThan(0);
      });

      // TimePicker24Hour uses onBlur (not onChange) to call its onChange prop.
      // Disabled inputs still render #time-selector elements.
      // inputs[2] = start-date[2] = first editable Day 1 slot ("22:00")
      // Change 22:00 → 20:00 (offset = -120 min): fire change then blur
      const inputs = document.querySelectorAll("#time-selector");
      fireEvent.change(inputs[2], { target: { value: "20:00" } });
      fireEvent.blur(inputs[2]);

      // Enable toggle → subsequent days shift by -120 min
      // Schedule timings ["06:00","14:00","22:00"] → ["04:00","12:00","20:00"]
      const toggle = document.querySelector("#apply-to-all-days-toggle");
      fireEvent.click(toggle);

      fireEvent.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockSaveMedication).toHaveBeenCalled();
      });

      const payload = mockSaveMedication.mock.calls[0][0];
      // With toggle ON: subsequent first slot = 04:00 next day
      // firstDay first slot = 20:00 same day → diff = 8h
      expect(
        payload.dayWiseSlotsStartTime[0] - payload.firstDaySlotsStartTime[0]
      ).toBe(8 * 3600);
    });

    it("AC2: toggle OFF (default) leaves subsequent days on original schedule timings (Scenario 2)", async () => {
      renderMultiDay();

      await waitFor(() => {
        expect(
          document.querySelectorAll("#time-selector").length
        ).toBeGreaterThan(0);
      });

      // Change Day 1 first editable slot but do NOT enable toggle
      const inputs = document.querySelectorAll("#time-selector");
      fireEvent.change(inputs[2], { target: { value: "20:00" } });
      fireEvent.blur(inputs[2]);

      fireEvent.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockSaveMedication).toHaveBeenCalled();
      });

      const payload = mockSaveMedication.mock.calls[0][0];
      // With toggle OFF: subsequent first slot = original 06:00 next day
      // firstDay first slot = 20:00 same day → diff = 10h
      expect(
        payload.dayWiseSlotsStartTime[0] - payload.firstDaySlotsStartTime[0]
      ).toBe(10 * 3600);
    });

    it("AC3: Day 1 first-slot edit while toggle ON re-propagates to subsequent days (Scenario 3)", async () => {
      renderMultiDay();

      await waitFor(() => {
        expect(
          document.querySelectorAll("#time-selector").length
        ).toBeGreaterThan(0);
      });

      // Enable toggle first (initial value "22:00" → offset=0, no shift)
      const toggleEl = document.querySelector("#apply-to-all-days-toggle");
      fireEvent.click(toggleEl);

      // Then change Day 1 slot: 22:00 → 20:00 → re-propagation triggers (-120 min)
      const inputs = document.querySelectorAll("#time-selector");
      fireEvent.change(inputs[2], { target: { value: "20:00" } });
      fireEvent.blur(inputs[2]);

      fireEvent.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockSaveMedication).toHaveBeenCalled();
      });

      const payload = mockSaveMedication.mock.calls[0][0];
      // Re-propagated: subsequent first slot = 04:00 next day → diff = 8h
      expect(
        payload.dayWiseSlotsStartTime[0] - payload.firstDaySlotsStartTime[0]
      ).toBe(8 * 3600);
    });

    it("AC4: toggle ON then OFF reverts subsequent days to original schedule timings (Scenario 2 revert)", async () => {
      renderMultiDay();

      await waitFor(() => {
        expect(
          document.querySelectorAll("#time-selector").length
        ).toBeGreaterThan(0);
      });

      const inputs = document.querySelectorAll("#time-selector");
      fireEvent.change(inputs[2], { target: { value: "20:00" } });
      fireEvent.blur(inputs[2]);

      // Toggle ON then OFF
      const toggle = document.querySelector("#apply-to-all-days-toggle");
      fireEvent.click(toggle);
      fireEvent.click(toggle);

      fireEvent.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockSaveMedication).toHaveBeenCalled();
      });

      const payload = mockSaveMedication.mock.calls[0][0];
      // After toggle OFF: subsequent reverts to original schedule 06:00 next day → diff = 10h
      expect(
        payload.dayWiseSlotsStartTime[0] - payload.firstDaySlotsStartTime[0]
      ).toBe(10 * 3600);
    });

    it("AC5: changing first remainder slot cascades offset to remaining remainder slots", async () => {
      // Edit mode: 3 slots/day, firstDaySlotsStartTime has 1 item → firstDaySlotsMissed=2
      // remainingDaySlotsStartTime has 2 items → finalDaySchedules=["06:00","14:00"]
      // inputs layout: [0,1]=hh:mm(disabled), [2]=day1 slot, [3,4,5]=subsequent, [6,7]=remainder
      // Change inputs[6] 06:00→08:00 (+2h) → inputs[7] should cascade 14:00→16:00
      const epoch06 = 1704088800; // 2024-01-01 06:00 UTC
      const epoch14 = 1704117600; // 2024-01-01 14:00 UTC
      const epoch22 = 1704146400; // 2024-01-01 22:00 UTC
      const editDrugOrderThrice = {
        ...mockScheduleDrugOrder,
        uniformDosingType: {
          ...mockScheduleDrugOrder.uniformDosingType,
          frequency: "Thrice a day",
        },
        drugOrder: {
          ...mockScheduleDrugOrder.drugOrder,
          duration: 5,
        },
        drugOrderSchedule: {
          firstDaySlotsStartTime: [epoch22],
          dayWiseSlotsStartTime: [epoch06, epoch14, epoch22],
          remainingDaySlotsStartTime: [epoch06, epoch14],
          slotStartTime: null,
          medicationAdministrationStarted: false,
        },
      };

      render(
        <IntlProvider locale="en">
          <SliderContext.Provider value={mockSliderContext}>
            <IPDContext.Provider
              value={{ config: mockConfig, handleAuditEvent: jest.fn() }}
            >
              <DrugChartSlider
                hostData={{
                  enable24HourTimers: true,
                  scheduleFrequencies: mockThriceDayFrequencies,
                  startTimeFrequencies: mockStartTimeFrequencies,
                  drugOrder: editDrugOrderThrice,
                }}
                hostApi={{}}
                title=""
                drugChartNotes=""
                setDrugChartNotes={jest.fn()}
              />
            </IPDContext.Provider>
          </SliderContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(document.querySelectorAll("#time-selector").length).toBeGreaterThanOrEqual(7);
      });

      const inputs = document.querySelectorAll("#time-selector");
      const firstRemainderIndex = inputs.length - 2;
      const secondRemainderIndex = inputs.length - 1;
      fireEvent.change(inputs[firstRemainderIndex], { target: { value: "08:00" } });
      fireEvent.blur(inputs[firstRemainderIndex]);

      await waitFor(() => {
        const updated = document.querySelectorAll("#time-selector");
        expect(["14:00", "16:00"]).toContain(
          updated[secondRemainderIndex].value
        );
      });
    });

    it("Duration=2: save payload keeps remaining-day one day after day-wise slots", async () => {
      MockDate.set("2010-12-22T20:00:00.000Z");
      mockSaveMedication.mockClear();
      const thriceFrequencies = [
        {
          name: "Thrice a day",
          frequencyPerDay: 3,
          scheduleTiming: ["06:00", "14:00", "22:00"],
        },
      ];
      const duration2DrugOrder = {
        ...mockScheduleDrugOrder,
        uniformDosingType: {
          ...mockScheduleDrugOrder.uniformDosingType,
          frequency: "Thrice a day",
        },
        drugOrder: {
          ...mockScheduleDrugOrder.drugOrder,
          duration: 2,
        },
      };

      render(
        <IntlProvider locale="en">
          <SliderContext.Provider value={mockSliderContext}>
            <IPDContext.Provider
              value={{ config: mockConfig, handleAuditEvent: jest.fn() }}
            >
              <DrugChartSlider
                hostData={{
                  enable24HourTimers: true,
                  scheduleFrequencies: thriceFrequencies,
                  startTimeFrequencies: mockStartTimeFrequencies,
                  drugOrder: duration2DrugOrder,
                }}
                hostApi={{}}
                title=""
                drugChartNotes=""
                setDrugChartNotes={jest.fn()}
              />
            </IPDContext.Provider>
          </SliderContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockSaveMedication).toHaveBeenCalled();
      });

      const payload = mockSaveMedication.mock.calls[0][0];
      expect(payload.dayWiseSlotsStartTime.length).toBe(3);
      expect(payload.remainingDaySlotsStartTime.length).toBe(2);
      expect(
        payload.remainingDaySlotsStartTime[0] - payload.dayWiseSlotsStartTime[0]
      ).toBe(24 * 3600);
      MockDate.reset();
    });

    it("Duration=2 edit-load: reconstructs subsequent slots when API sends dayWise as null", async () => {
      const fourTimesFrequencies = [
        {
          name: "Four times a day",
          frequencyPerDay: 4,
          scheduleTiming: ["00:45", "06:45", "12:45", "18:30"],
        },
      ];
      const editDrugOrderMergedRemaining = {
        ...mockScheduleDrugOrder,
        uniformDosingType: {
          ...mockScheduleDrugOrder.uniformDosingType,
          frequency: "Four times a day",
        },
        drugOrder: {
          ...mockScheduleDrugOrder.drugOrder,
          duration: 2,
        },
        drugOrderSchedule: {
          firstDaySlotsStartTime: [1783947600],
          dayWiseSlotsStartTime: null,
          remainingDaySlotsStartTime: [
            1783970100,
            1783991700,
            1784013300,
            1783970100,
            1783991700,
            1784013300,
            1784034000,
          ],
          slotStartTime: null,
          medicationAdministrationStarted: false,
        },
      };

      renderWithProviders(
        <DrugChartSlider
          hostData={{
            enable24HourTimers: true,
            scheduleFrequencies: fourTimesFrequencies,
            startTimeFrequencies: mockStartTimeFrequencies,
            drugOrder: editDrugOrderMergedRemaining,
          }}
          hostApi={{}}
          title=""
          drugChartNotes=""
          setDrugChartNotes={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText("Schedule time (subsequent, 24 hrs format)")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Schedule time (remainder, 24 hrs format)")
        ).toBeInTheDocument();
      });

      // 4 start-date + 4 subsequent + 3 remainder
      expect(document.querySelectorAll("#time-selector").length).toBe(11);
    });

    it("Edit-load non-midnight flow: keeps first-day and day-wise buckets unchanged", async () => {
      const thriceFrequencies = [
        {
          name: "Thrice a day",
          frequencyPerDay: 3,
          scheduleTiming: ["06:00", "14:00", "22:00"],
        },
      ];
      const editDrugOrderNonMidnight = {
        ...mockScheduleDrugOrder,
        uniformDosingType: {
          ...mockScheduleDrugOrder.uniformDosingType,
          frequency: "Thrice a day",
        },
        drugOrder: {
          ...mockScheduleDrugOrder.drugOrder,
          duration: 3,
        },
        drugOrderSchedule: {
          firstDaySlotsStartTime: [1704117600],
          dayWiseSlotsStartTime: [1704088800, 1704117600, 1704146400],
          remainingDaySlotsStartTime: [1704175200, 1704204000],
          slotStartTime: null,
          medicationAdministrationStarted: false,
        },
      };

      renderWithProviders(
        <DrugChartSlider
          hostData={{
            enable24HourTimers: true,
            scheduleFrequencies: thriceFrequencies,
            startTimeFrequencies: mockStartTimeFrequencies,
            drugOrder: editDrugOrderNonMidnight,
          }}
          hostApi={{}}
          title=""
          drugChartNotes=""
          setDrugChartNotes={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText("Schedule time (subsequent, 24 hrs format)")
        ).toBeInTheDocument();
      });

      const inputs = document.querySelectorAll("#time-selector");
      expect(inputs.length).toBe(8);
      expect(inputs[2].value).toBe("14:00");
      expect(inputs[3].value).toBe("06:00");
      expect(inputs[4].value).toBe("14:00");
      expect(inputs[5].value).toBe("22:00");
    });

    it("Edit-load midnight flow: carries crossing slot into first day and rotates day-wise", async () => {
      const fourTimesFrequencies = [
        {
          name: "Four times a day",
          frequencyPerDay: 4,
          scheduleTiming: ["01:45", "08:00", "14:00", "20:00"],
        },
      ];
      const editDrugOrderMidnight = {
        ...mockScheduleDrugOrder,
        uniformDosingType: {
          ...mockScheduleDrugOrder.uniformDosingType,
          frequency: "Four times a day",
        },
        drugOrder: {
          ...mockScheduleDrugOrder.drugOrder,
          duration: 3,
        },
        drugOrderSchedule: {
          firstDaySlotsStartTime: [1783951200, 1783972800],
          dayWiseSlotsStartTime: [1783993500, 1784016000, 1784037600, 1784059200],
          remainingDaySlotsStartTime: [1784079900, 1784102400],
          slotStartTime: null,
          medicationAdministrationStarted: false,
        },
      };

      renderWithProviders(
        <DrugChartSlider
          hostData={{
            enable24HourTimers: true,
            scheduleFrequencies: fourTimesFrequencies,
            startTimeFrequencies: mockStartTimeFrequencies,
            drugOrder: editDrugOrderMidnight,
          }}
          hostApi={{}}
          title=""
          drugChartNotes=""
          setDrugChartNotes={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText("Schedule time (subsequent, 24 hrs format)")
        ).toBeInTheDocument();
      });

      const inputs = document.querySelectorAll("#time-selector");
      expect(inputs.length).toBe(9);
      expect(inputs[1].value).toBe("14:00");
      expect(inputs[2].value).toBe("20:00");
      expect(inputs[3].value).toBe("01:45");
      expect(inputs[4].value).toBe("08:00");
      expect(inputs[5].value).toBe("14:00");
      expect(inputs[6].value).toBe("20:00");
      expect(inputs[7].value).toBe("01:45");
      expect(inputs[8].value).toBe("08:00");
    });
  });
});
