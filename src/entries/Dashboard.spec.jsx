import React from "react";
import Dashboard from "./Dashboard";
import { render, waitFor } from "@testing-library/react";

const MockedDrugChartWrapper = jest.fn();
jest.mock("../features/DrugChart/DrugChartWrapper/DrugChartWrapper.jsx", () => {
  return function DrugChart(props) {
    MockedDrugChartWrapper(props);
    return <div>DrugChartWrapper</div>;
  };
});

describe("Dashboard", () => {
  it("should render", async () => {
    const mockDate = new Date(1466424490000);
    const hostData = {
      patientId: "__test_patient_uuid__",
      viewDate: mockDate,
    };

    const hostApi = {
      onConfirm: jest.fn(),
    };

    render(<Dashboard hostData={hostData} hostApi={hostApi} />);

    // await waitFor(() => {
    //   expect(component.getByText("__test_patient_uuid__")).toBeTruthy();
    // });

    // fireEvent.click(
    //   component.getByRole("button", {
    //     name: "Click to send event to host appliation",
    //   })
    // );
    // expect(hostApi.onConfirm).toHaveBeenCalledWith("event-from-ipd");

    await waitFor(() => {
      expect(MockedDrugChartWrapper).toHaveBeenCalled();
      expect(MockedDrugChartWrapper).toHaveBeenCalledWith({
        patientId: "__test_patient_uuid__",
      });
    });
  });
});
