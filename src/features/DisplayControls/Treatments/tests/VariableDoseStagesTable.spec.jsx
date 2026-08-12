import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MockDate from "mockdate";
import VariableDoseStagesTable from "../components/VariableDoseStagesTable";
import { MEDICATION_ADDITIVES_EXTENSION_URL } from "../../../../utils/FhirDosingUtils";

const makeDosage = ({
  sequence,
  text,
  isLoadingDose = false,
  duration = 3,
  durationUnit = "d",
  frequency = "Once a day",
  dose = 10,
  unit = "mg",
  instructions = "",
  additionalInstructions = "",
  rate = "",
  additives = "",
}) => {
  const timing = {
    repeat: isLoadingDose ? { count: 1 } : { duration, durationUnit },
  };
  if (!isLoadingDose) {
    timing.code = { text: frequency };
  }
  const dosage = {
    sequence,
    text,
    timing,
    route: { text: "Oral" },
    doseAndRate: [
      {
        type: { text: "ordered" },
        doseQuantity: { value: dose, unit },
        ...(rate
          ? { rateQuantity: { value: parseFloat(rate), unit: "ml/hr" } }
          : {}),
      },
    ],
    additionalInstruction: instructions ? [{ text: instructions }] : [],
    patientInstruction: additionalInstructions,
  };
  if (additives) {
    dosage.extension = [
      { url: MEDICATION_ADDITIVES_EXTENSION_URL, valueString: additives },
    ];
  }
  return dosage;
};

const mockFhirDosages = [
  makeDosage({
    sequence: 1,
    text: "Loading Dose",
    isLoadingDose: true,
    dose: 2,
    unit: "mg",
    frequency: "Once",
  }),
  makeDosage({
    sequence: 2,
    text: "Stage 1",
    dose: 10,
    unit: "mg",
    frequency: "Three times a day",
    duration: 3,
    durationUnit: "d",
  }),
  makeDosage({
    sequence: 3,
    text: "Stage 2",
    dose: 8,
    unit: "mg",
    frequency: "Two times a day",
    duration: 3,
    durationUnit: "d",
  }),
];

const effectiveStartDate = new Date("2026-04-21").getTime();

describe("VariableDoseStagesTable", () => {
  it("renders the Variable Dosage Protocol heading", () => {
    render(
      <VariableDoseStagesTable
        fhirDosages={mockFhirDosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    expect(screen.getByText("Variable Dosage Protocol")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <VariableDoseStagesTable
        fhirDosages={mockFhirDosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    expect(screen.getByText("Stage")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("Dose")).toBeInTheDocument();
    expect(screen.getByText("Frequency")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders loading dose row with correct data", () => {
    render(
      <VariableDoseStagesTable
        fhirDosages={mockFhirDosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    expect(screen.getByText("Loading Dose")).toBeInTheDocument();
    expect(screen.getByText("2 mg")).toBeInTheDocument();
    expect(screen.getByText("Once")).toBeInTheDocument();
    expect(screen.getByText("1 Occurrence(s)")).toBeInTheDocument();
  });

  it("renders ordinal numbers (sequence - loadingDoseCount) for non-loading-dose stages", () => {
    render(
      <VariableDoseStagesTable
        fhirDosages={mockFhirDosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    // Loading dose is sequence=1, so Stage 1 (sequence=2) → "1", Stage 2 (sequence=3) → "2"
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders ordinal numbers correctly when there is no loading dose", () => {
    const noLoadingDoseFhirDosages = [
      makeDosage({
        sequence: 1,
        text: "Stage 1",
        dose: 10,
        unit: "mg",
        frequency: "Once a day",
        duration: 3,
        durationUnit: "d",
      }),
      makeDosage({
        sequence: 2,
        text: "Stage 2",
        dose: 5,
        unit: "mg",
        frequency: "Twice a day",
        duration: 3,
        durationUnit: "d",
      }),
    ];
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    // No loading dose, so Stage 1 (sequence=1) → "1", Stage 2 (sequence=2) → "2"
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("computes start dates cumulatively from effectiveStartDate", () => {
    render(
      <VariableDoseStagesTable
        fhirDosages={mockFhirDosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    // Loading dose (0 days) and Stage 1 both start on 21 Apr 2026
    const apr21Cells = screen.getAllByText("21 Apr 2026");
    expect(apr21Cells).toHaveLength(2);
    // Stage 2 starts 3 days after Stage 1
    expect(screen.getByText("24 Apr 2026")).toBeInTheDocument();
  });

  it("shows note icon when stage has instructions", () => {
    const dosages = [
      makeDosage({
        sequence: 1,
        text: "Loading Dose",
        isLoadingDose: true,
        dose: 2,
        unit: "mg",
        frequency: "Once",
        instructions: "Take with food",
      }),
    ];
    render(
      <VariableDoseStagesTable
        fhirDosages={dosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    expect(screen.getByTestId("stage-note-icon-0")).toBeInTheDocument();
  });

  it("shows note icon when stage has rate", () => {
    const dosages = [
      makeDosage({
        sequence: 1,
        text: "Loading Dose",
        isLoadingDose: true,
        dose: 2,
        unit: "mg",
        frequency: "Once",
        rate: "20",
      }),
    ];
    render(
      <VariableDoseStagesTable
        fhirDosages={dosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    expect(screen.getByTestId("stage-note-icon-0")).toBeInTheDocument();
  });

  it("shows note icon when stage has additives", () => {
    const dosages = [
      makeDosage({
        sequence: 1,
        text: "Loading Dose",
        isLoadingDose: true,
        dose: 2,
        unit: "mg",
        frequency: "Once",
        additives: "Saline",
      }),
    ];
    render(
      <VariableDoseStagesTable
        fhirDosages={dosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    expect(screen.getByTestId("stage-note-icon-0")).toBeInTheDocument();
  });

  it("does not show note icon when stage has no instructions, rate or additives", () => {
    const dosages = [
      makeDosage({
        sequence: 1,
        text: "Loading Dose",
        isLoadingDose: true,
        dose: 2,
        unit: "mg",
        frequency: "Once",
      }),
    ];
    render(
      <VariableDoseStagesTable
        fhirDosages={dosages}
        effectiveStartDate={effectiveStartDate}
      />
    );
    expect(screen.queryByTestId("stage-note-icon-0")).toBeNull();
  });

  it("returns null when fhirDosages is empty", () => {
    const { container } = render(
      <VariableDoseStagesTable
        fhirDosages={[]}
        effectiveStartDate={effectiveStartDate}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("stage button behaviour", () => {
  const defaultStageProps = {
    stageSchedules: [],
    isAddToDrugChartDisabled: false,
    isReadMode: false,
    hasScheduleEditPrivilege: true,
    onAddToDrugChart: jest.fn(),
    onEditDrugChart: jest.fn(),
  };

  // Two stages without loading dose
  const noLoadingDoseFhirDosages = [
    makeDosage({
      sequence: 1,
      text: "Stage 1",
      dose: 5,
      unit: "mg",
      frequency: "Once a day",
      duration: 3,
      durationUnit: "d",
    }),
    makeDosage({
      sequence: 2,
      text: "Stage 2",
      dose: 3,
      unit: "mg",
      frequency: "Twice a day",
      duration: 3,
      durationUnit: "d",
    }),
  ];

  // Loading dose (sequence=1) + Stage 1 (sequence=2)
  const withLoadingDoseFhirDosages = [
    makeDosage({
      sequence: 1,
      text: "Loading Dose",
      isLoadingDose: true,
      dose: 5,
      unit: "mg",
      frequency: "Once",
    }),
    makeDosage({
      sequence: 2,
      text: "Stage 1",
      dose: 3,
      unit: "mg",
      frequency: "Once a day",
      duration: 3,
      durationUnit: "d",
    }),
  ];

  afterEach(() => {
    MockDate.reset();
  });

  it("shows Add to Drug Chart for all unscheduled stages with only the active stage enabled when date is due", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[]}
      />
    );
    // Both unscheduled stages show Add to Drug Chart; only the active stage is enabled
    const addLinks = screen.getAllByText("Add to Drug Chart");
    expect(addLinks).toHaveLength(2);
    const enabledLinks = addLinks.filter(
      (link) => link.getAttribute("aria-disabled") !== "true"
    );
    expect(enabledLinks).toHaveLength(1);
  });

  it("shows Add to Drug Chart greyed out for all stages when stage start date has not arrived", () => {
    MockDate.set(new Date("2026-04-10").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[]}
      />
    );
    // Date is before effectiveStartDate — no active stage, all Add links disabled
    const addLinks = screen.getAllByText("Add to Drug Chart");
    expect(addLinks).toHaveLength(2);
    addLinks.forEach((link) =>
      expect(link).toHaveAttribute("aria-disabled", "true")
    );
  });

  it("shows Add to Drug Chart button for the active stage when start date is due", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[]}
      />
    );
    // Active stage shows the button without disabled state
    const addLinks = screen.getAllByText("Add to Drug Chart");
    expect(addLinks).toHaveLength(2);
    const enabledLinks = addLinks.filter(
      (link) => link.getAttribute("aria-disabled") !== "true"
    );
    expect(enabledLinks).toHaveLength(1);
    expect(enabledLinks[0]).not.toHaveAttribute("aria-disabled", "true");
  });

  it("shows Edit Drug Chart link when stage is scheduled and not administered", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={mockFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 2,
            isScheduled: true,
            administrationStarted: false,
            allAttended: false,
          },
        ]}
      />
    );
    expect(screen.getByText("Edit Drug Chart")).toBeInTheDocument();
  });

  it("shows no Edit button and greyed out Add buttons when a later stage is scheduled and administration has started", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    // stage1 (seq=2) is scheduled+adminStarted; loading dose (seq=1) was never scheduled
    // Loading dose and stage2 are not addable — Add links shown greyed out
    render(
      <VariableDoseStagesTable
        fhirDosages={mockFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 2,
            isScheduled: true,
            administrationStarted: true,
            allAttended: false,
          },
        ]}
      />
    );
    expect(screen.queryByText("Edit Drug Chart")).toBeNull();
    const addLinks = screen.getAllByText("Add to Drug Chart");
    expect(addLinks).toHaveLength(2);
    addLinks.forEach((link) =>
      expect(link).toHaveAttribute("aria-disabled", "true")
    );
  });

  it("shows Add to Drug Chart greyed out for Stage 1 when loading dose is scheduled but not attended", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={withLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: false,
            allAttended: false,
          },
        ]}
      />
    );
    // Loading dose scheduled but not attended → Stage 1 Add link shown but greyed out
    // Loading dose itself is scheduled → Edit Drug Chart, no Add link
    const addLink = screen.getByText("Add to Drug Chart");
    expect(addLink).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("Edit Drug Chart")).toBeInTheDocument();
  });

  it("shows no Add to Drug Chart for a completed loading dose and an enabled Add for the next stage once the loading dose is administered", () => {
    MockDate.set(new Date("2026-04-22").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={withLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: true,
            allAttended: true,
          },
        ]}
      />
    );
    // Loading dose allAttended → completed (no Add link); Stage 1 is the active stage (enabled Add)
    const addLinks = screen.getAllByText("Add to Drug Chart");
    expect(addLinks).toHaveLength(1);
    expect(addLinks[0]).not.toHaveAttribute("aria-disabled", "true");
  });

  it("shows Add to Drug Chart button as disabled when isAddToDrugChartDisabled is true", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        isAddToDrugChartDisabled={true}
        stageSchedules={[]}
      />
    );
    // Add links show but disabled — same as regular order behaviour
    const addLinks = screen.getAllByText("Add to Drug Chart");
    expect(addLinks).toHaveLength(2);
    addLinks.forEach((link) =>
      expect(link).toHaveAttribute("aria-disabled", "true")
    );
  });

  it("shows Add to Drug Chart button as disabled when hasScheduleEditPrivilege is false", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        hasScheduleEditPrivilege={false}
        stageSchedules={[]}
      />
    );
    // No privilege → buttons show but disabled (same as regular order)
    const addLinks = screen.getAllByText("Add to Drug Chart");
    expect(addLinks).toHaveLength(2);
    addLinks.forEach((link) =>
      expect(link).toHaveAttribute("aria-disabled", "true")
    );
  });

  it("does not call onAddToDrugChart when a disabled Add to Drug Chart link is clicked", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    const onAddToDrugChart = jest.fn();
    render(
      <VariableDoseStagesTable
        fhirDosages={withLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        onAddToDrugChart={onAddToDrugChart}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: false,
            allAttended: false,
          },
        ]}
      />
    );
    // Loading dose scheduled but not attended → Stage 1 Add link is greyed out
    const addLink = screen.getByText("Add to Drug Chart");
    expect(addLink).toHaveAttribute("aria-disabled", "true");
    addLink.click();
    expect(onAddToDrugChart).not.toHaveBeenCalled();
  });

  it("calls onAddToDrugChart with the stage index when an enabled Add to Drug Chart link is clicked", () => {
    MockDate.set(new Date("2026-04-22").getTime());
    const onAddToDrugChart = jest.fn();
    render(
      <VariableDoseStagesTable
        fhirDosages={withLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        onAddToDrugChart={onAddToDrugChart}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: true,
            allAttended: true,
          },
        ]}
      />
    );
    // Loading dose allAttended → completed (no Add link), Stage 1 is the enabled stage
    const addLinks = screen.getAllByText("Add to Drug Chart");
    const enabledLink = addLinks.find(
      (link) => link.getAttribute("aria-disabled") !== "true"
    );
    expect(enabledLink).toBeDefined();
    enabledLink.click();
    expect(onAddToDrugChart).toHaveBeenCalledTimes(1);
    expect(onAddToDrugChart).toHaveBeenCalledWith(1);
  });

  it("does not show Add to Drug Chart links when all stages are completed", () => {
    MockDate.set(new Date("2026-04-25").getTime());
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: true,
            allAttended: true,
          },
          {
            variableDosageSequence: 2,
            isScheduled: true,
            administrationStarted: true,
            allAttended: true,
          },
        ]}
      />
    );
    // Both stages completed → no Add to Drug Chart link is shown
    expect(screen.queryByText("Add to Drug Chart")).not.toBeInTheDocument();
  });

  it("shows Stop drug link when stage has administrationStarted and pendingSlotsAvailable", () => {
    const onStopDrugChart = jest.fn();
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: true,
            pendingSlotsAvailable: true,
            allAttended: false,
          },
        ]}
        onStopDrugChart={onStopDrugChart}
      />
    );
    expect(screen.getByText("Stop drug")).toBeInTheDocument();
  });

  it("does not show Stop drug link when onStopDrugChart is not provided", () => {
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: true,
            pendingSlotsAvailable: true,
            allAttended: false,
          },
        ]}
      />
    );
    expect(screen.queryByText("Stop drug")).toBeNull();
  });

  it("calls onStopDrugChart when Stop drug link is clicked", () => {
    const onStopDrugChart = jest.fn();
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: true,
            pendingSlotsAvailable: true,
            allAttended: false,
          },
        ]}
        onStopDrugChart={onStopDrugChart}
        isReadMode={false}
      />
    );
    screen.getByText("Stop drug").click();
    expect(onStopDrugChart).toHaveBeenCalledTimes(1);
  });

  it("does not call onStopDrugChart when Stop drug link is clicked in read mode", () => {
    const onStopDrugChart = jest.fn();
    render(
      <VariableDoseStagesTable
        fhirDosages={noLoadingDoseFhirDosages}
        effectiveStartDate={effectiveStartDate}
        {...defaultStageProps}
        stageSchedules={[
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: true,
            pendingSlotsAvailable: true,
            allAttended: false,
          },
        ]}
        onStopDrugChart={onStopDrugChart}
        isReadMode={true}
      />
    );
    screen.getByText("Stop drug").click();
    expect(onStopDrugChart).not.toHaveBeenCalled();
  });
});
