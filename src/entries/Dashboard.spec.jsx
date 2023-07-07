import React from "react";
import Dashboard from "./Dashboard";
import { render, fireEvent } from "@testing-library/react";

describe("Dashboard", () => {
  it("should render", () => {
    const hostData = {
      patient: {
        uuid: "__test_patient_uuid__",
      },
    };

    const hostApi = {
      onConfirm: jest.fn(),
    };

    const component = render(
      <Dashboard hostData={hostData} hostApi={hostApi} />
    );

    expect(component.getByText("__test_patient_uuid__")).toBeTruthy();

    fireEvent.click(
      component.getByRole("button", {
        name: "Click to send event to host appliation",
      })
    );
    expect(hostApi.onConfirm).toHaveBeenCalledWith("event-from-ipd");
  });
});
