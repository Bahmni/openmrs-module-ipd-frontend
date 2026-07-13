import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import VariableDoseStagesTable from "../components/VariableDoseStagesTable";

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
}) => ({
  sequence,
  text,
  timing: {
    repeat: {
      duration,
      durationUnit,
      frequency: 1,
      period: 1,
      periodUnit: "d",
    },
    code: { text: frequency },
  },
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
  extension: [
    { url: "isLoadingDose", valueBoolean: isLoadingDose },
    ...(additives ? [{ url: "additives", valueString: additives }] : []),
  ],
});

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
