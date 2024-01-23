import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AdministeredMedicationList from "../components/AdministeredMedicationList";

const mockAdministeredMedicationsList = {
  "8040ab44-2100-4e4e-91ad-50a5715050da": {
    displayName: "Liquid Paraffin",
    doseType: "Drop",
    dosage: 2,
    route: "Topical",
    startTime: "16:00",
    isSelected: true,
    actualTime: "2023-12-15T12:30:21.731Z",
    status: "completed",
  },
  "605319f2-d51f-42fb-b3bd-ab1ded2355ad": {
    displayName: "Adenosine 3 mg/mL Ampoule/Vial",
    dosage: "5mg",
    route: "Intravenous",
    startTime: "14:00",
    isSelected: false,
    actualTime: null,
    orderId: "aaf6a0de-a04b-4a16-a686-071c0a5c399a",
    skipped: true,
    notes: "Notes 3",
    status: "not-done",
  },
};

describe("AdministeredMedicationList", () => {
  it("should render AdministeredMedicationList", () => {
    const { container } = render(
      <AdministeredMedicationList list={mockAdministeredMedicationsList} />
    );
    expect(container).toMatchSnapshot();
  });

  test("should call getStatus function", () => {
    const mockGetStatus = jest.fn();
    render(
      <AdministeredMedicationList list={mockAdministeredMedicationsList} />
    );
    mockGetStatus("completed");
    expect(mockGetStatus).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("should render skipped medication", function () {
    render(
      <AdministeredMedicationList list={mockAdministeredMedicationsList} />
    );
    expect(screen.getByText("Skipped")).toBeTruthy();
  });
});
