import React from "react";
import Dashboard from "./Dashboard";
import { render, waitFor } from "@testing-library/react";

const MockedDrugChart = jest.fn();
jest.mock("../features/DrugChart/DrugChart.jsx", () => {
  return function DrugChart(props) {
    MockedDrugChart(props);
    return <div>DrugChart</div>;
  };
});

describe("Dashboard", () => {
  it("should render", async () => {
    const hostData = {
      patient: {
        uuid: "__test_patient_uuid__",
      },
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
      expect(MockedDrugChart).toHaveBeenCalled();
      expect(MockedDrugChart).toHaveBeenCalledWith({
        patientId: "__test_patient_uuid__",
      });
    });
  });
});
