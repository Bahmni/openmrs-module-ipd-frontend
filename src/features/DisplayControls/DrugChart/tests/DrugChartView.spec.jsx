import React from "react";
import { render } from "@testing-library/react";
import DrugChartView from "../components/DrugChartView";
import { drugChartData } from "./DrugChartViewMockData";

const mockUseFetchMedications = jest.fn();

jest.mock("../hooks/useFetchMedications", () => ({
  useFetchMedications: () => mockUseFetchMedications(),
}));

describe("DrugChartWrapper", () => {
  const mockDate = new Date(1466424490000);
  it.skip("matches snapshot", () => {
    mockUseFetchMedications.mockReturnValue({
      isLoading: false,
      drugChartData,
    });
    const { container } = render(
      <DrugChartView patientId="testid" viewDate={mockDate} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render loading state when isLoading is true", () => {
    mockUseFetchMedications.mockReturnValue({
      isLoading: true,
      drugChartData: [],
    });
    const { container } = render(
      <DrugChartView patientId="test-id" viewDate={mockDate} />
    );
    expect(container).toMatchSnapshot();
  });
});
