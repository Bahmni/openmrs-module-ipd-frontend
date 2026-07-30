import { render, screen } from "@testing-library/react";
import React from "react";
import ExpandableRowData from "../components/ExpandableRowData";
import "@testing-library/jest-dom/extend-expect";

const makeDosage = ({ sequence, text, isLoadingDose = false }) => ({
  sequence,
  text,
  timing: {
    repeat: isLoadingDose ? { count: 1 } : { duration: 3, durationUnit: "d" },
    code: { text: "Once a day" },
  },
  route: { text: "Oral" },
  doseAndRate: [{ type: { text: "ordered" }, doseQuantity: { value: 5, unit: "mg" } }],
  additionalInstruction: [],
  patientInstruction: "",
});

describe("ExpandableRowData", () => {
  it("should render ExpandableRowData component for non-variable dose", () => {
    render(<ExpandableRowData expandTreatmentData={{}} />);
  });

  it("should render VariableDoseStagesTable when isVariableDose is true", () => {
    const expandData = {
      isVariableDose: true,
      fhirDosages: [
        makeDosage({ sequence: 1, text: "Loading Dose", isLoadingDose: true }),
        makeDosage({ sequence: 2, text: "Stage 1" }),
      ],
      effectiveStartDate: new Date("2026-04-21").getTime(),
    };
    render(<ExpandableRowData expandTreatmentData={expandData} />);
    expect(screen.getByText("Variable Dosage Protocol")).toBeInTheDocument();
    expect(screen.getByText("Loading Dose")).toBeInTheDocument();
  });

  it("should render VerticalTabs for non-variable dose with instructions", () => {
    const expandData = {
      isVariableDose: false,
      instructions: "Take after meals",
      provider: "Test Provider",
      recordedDateTime: "01 Jan 2026 10:00 AM",
    };
    render(<ExpandableRowData expandTreatmentData={expandData} />);
    expect(screen.getByText("Take after meals")).toBeInTheDocument();
  });
});
