import React from "react";
import Dashboard from "./Dashboard";
import { render, fireEvent, waitFor } from "@testing-library/react";

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

    const component = render(
      <Dashboard hostData={hostData} hostApi={hostApi} />
    );

    await waitFor(() => {
      expect(component.getByText("__test_patient_uuid__")).toBeTruthy();
    });

    fireEvent.click(
      component.getByRole("button", {
        name: "Click to send event to host appliation",
      })
    );
    expect(hostApi.onConfirm).toHaveBeenCalledWith("event-from-ipd");
  });
});
