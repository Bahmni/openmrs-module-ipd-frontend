import React from "react";
import { render } from "@testing-library/react";
import DrugChartView from "../components/DrugChartView";
import { drugChartData } from "./DrugChartViewMockData";
import MockDate from "mockdate";

const mockUseFetchMedications = jest.fn();
const MockTooltipCarbon = jest.fn();

jest.mock("../hooks/useFetchMedications", () => ({
  useFetchMedications: () => mockUseFetchMedications(),
}));
jest.mock("bahmni-carbon-ui", () => {
  return {
    TooltipCarbon: (props) => {
      MockTooltipCarbon(props);
      return <div>TooltipCarbon</div>;
    },
  };
});

describe.skip("DrugChartWrapper", () => {
  const mockDate = new Date(1466424490000);
  MockDate.set(mockDate);
  it("matches snapshot", () => {
    mockUseFetchMedications.mockReturnValue({
      isLoading: false,
      drugChartData,
    });
    const { container } = render(
      <DrugChartView patientId="testid" viewDate={mockDate} />
    );
    expect(container).toMatchSnapshot();
    MockDate.reset();
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

  it.skip("should render no medication task message when drugChartData is empty", () => {
    mockUseFetchMedications.mockReturnValue({
      isLoading: false,
      drugChartData: [],
    });
    const { getByText } = render(
      <DrugChartView patientId="test-id" viewDate={mockDate} />
    );
    expect(
      getByText("No Medication has been scheduled for the patient yet")
    ).toBeTruthy();
  });
});
