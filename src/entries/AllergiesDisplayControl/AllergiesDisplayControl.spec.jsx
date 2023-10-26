import { render, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { mockAllergiesIntolerenceResponse } from "./AllergiesDisplayCOntrolTestUtils";
import { AllergiesDisplayControl } from "./AllergiesDisplayControl";
import "@testing-library/jest-dom/extend-expect";

jest.mock("axios");
describe("AllergiesDisplayControl", () => {
  it("should render AllergiesDisplayControl", () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(
      <AllergiesDisplayControl
        hostData={{ patientId: "__test_patient_uuid__" }}
      />
    );
    expect(screen.getByText("Allergen")).toBeInTheDocument();
  });
  it("should show data in the table", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(
      <AllergiesDisplayControl
        hostData={{ patientId: "__test_patient_uuid__" }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId(/datatable/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Beef")).toBeInTheDocument();
    expect(screen.getByText(/test comment/i)).toBeInTheDocument();
  });
  it("should highlight severity column when the value is high", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(
      <AllergiesDisplayControl
        hostData={{ patientId: "__test_patient_uuid__" }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId(/datatable/i)).toBeInTheDocument();
    });

    expect(screen.getAllByRole("cell", { name: /high/i })[0]).toHaveClass(
      "high-severity-color"
    );
    expect(screen.getAllByRole("cell", { name: /mild/i })[0]).not.toHaveClass(
      "high-severity-color"
    );
  });
  it("should sort Allergen in ASC order based on severity", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(
      <AllergiesDisplayControl
        hostData={{ patientId: "__test_patient_uuid__" }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId(/datatable/i)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("table-body-row")[0]).toHaveTextContent(
      "Beef"
    );
    expect(screen.getAllByTestId("table-body-row")[0]).toHaveTextContent(
      "High"
    );
    expect(screen.getAllByTestId("table-body-row")[1]).toHaveTextContent(
      "Milk product"
    );
    expect(screen.getAllByTestId("table-body-row")[1]).toHaveTextContent(
      "High"
    );
  });

  it("should show table skeleton on loading", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(
      <AllergiesDisplayControl
        hostData={{ patientId: "__test_patient_uuid__" }}
      />
    );

    expect(screen.getByTestId("datatable-skeleton")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId(/datatable/i)).toBeInTheDocument();
    });

    expect(screen.queryByTestId("datatable-skeleton")).not.toBeInTheDocument();
  });
});
