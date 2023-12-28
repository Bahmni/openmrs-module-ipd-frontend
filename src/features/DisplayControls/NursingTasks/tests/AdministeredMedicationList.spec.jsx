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
    screen.debug();
    mockGetStatus("completed");
    expect(mockGetStatus).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});
