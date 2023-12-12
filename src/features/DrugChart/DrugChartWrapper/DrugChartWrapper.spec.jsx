import React from "react";
import { render } from "@testing-library/react";
import DrugChartWrapper, { TransformDrugChartData } from "./DrugChartWrapper";
import { drugChartData } from "./DrugChartWrapperMockData";

const mockUseFetchMedications = jest.fn();

jest.mock("../../../hooks/useFetchMedications", () => ({
  useFetchMedications: () => mockUseFetchMedications(),
}));

describe("DrugChartWrapper", () => {
  const mockDate = new Date(1466424490000);
  it("matches snapshot", () => {
    mockUseFetchMedications.mockReturnValue({
      isLoading: false,
      drugChartData,
    });
    const { container } = render(
      <DrugChartWrapper patientId="testid" viewDate={mockDate} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render loading state when isLoading is true", () => {
    mockUseFetchMedications.mockReturnValue({
      isLoading: true,
      drugChartData: [],
    });
    const { container } = render(
      <DrugChartWrapper patientId="test-id" viewDate={mockDate} />
    );
    expect(container).toMatchSnapshot();
  });
});

describe("TransformDrugChartData", () => {
  it("should transform drug chart data", () => {
    const TransformedDrugChartData = TransformDrugChartData(drugChartData);
    expect(TransformedDrugChartData).toEqual([
      [
        {
          16: {
            administrationInfo: "",
            minutes: 15,
            status: "SCHEDULED",
          },
          19: {
            administrationInfo: "",
            minutes: 35,
            status: "SCHEDULED",
          },
        },
      ],
      [
        {
          administrationInfo: [],
          dosage: "25ml",
          drugName: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
          drugRoute: "Oral",
          duration: "3 Day(s)",
          uuid: "9d7437a9-3f10-11e4-abcd-0800271c1b75",
        },
      ],
    ]);
  });
});
