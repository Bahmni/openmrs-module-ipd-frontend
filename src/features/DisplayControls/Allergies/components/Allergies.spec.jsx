import { render, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { mockAllergiesIntolerenceResponse } from "./AllergiesTestUtils";
import Allergies from "./Allergies";
import "@testing-library/jest-dom/extend-expect";

jest.mock("axios");
describe("Allergies", () => {
  it("should render Allergies", () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(<Allergies patientId={"__test_patient_uuid__"} />);
    expect(screen.getByText("Allergen")).toBeInTheDocument();
  });

  it("should show data in the table", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(<Allergies patientId={"__test_patient_uuid__"} />);

    await waitFor(() => {
      expect(screen.getByTestId(/datatable/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Beef")).toBeInTheDocument();
    expect(screen.getByText(/test comment/i)).toBeInTheDocument();
  });

  it("should highlight column in red", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(<Allergies patientId={"__test_patient_uuid__"} />);

    await waitFor(() => {
      expect(screen.getByTestId(/datatable/i)).toBeInTheDocument();
    });
    expect(screen.getAllByRole("cell", { name: /severe/i })[0]).toHaveClass(
      "high-severity-color"
    );
  });

  it("should sort Allergen in ASC order based on severity", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(<Allergies patientId={"__test_patient_uuid__"} />);

    await waitFor(() => {
      expect(screen.getByTestId(/datatable/i)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("table-body-row")[0]).toHaveTextContent(
      "Beef"
    );
    expect(screen.getAllByTestId("table-body-row")[0]).toHaveTextContent(
      "Severe"
    );
    expect(screen.getAllByTestId("table-body-row")[1]).toHaveTextContent(
      "Milk product"
    );
    expect(screen.getAllByTestId("table-body-row")[1]).toHaveTextContent(
      "Severe"
    );
  });

  it("should show table skeleton on loading", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(<Allergies patientId={"__test_patient_uuid__"} />);

    expect(screen.getByTestId("datatable-skeleton")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId(/datatable/i)).toBeInTheDocument();
    });

    expect(screen.queryByTestId("datatable-skeleton")).not.toBeInTheDocument();
  });

  it("should show no data message when there is no data", async () => {
    axios.get.mockResolvedValue({ data: { entry: undefined } });
    render(<Allergies patientId={"__test_patient_uuid__"} />);

    await waitFor(() => {
      expect(
        screen.getByText(/No Allergen is captured for this patient yet/i)
      ).toBeInTheDocument();
    });
  });
});
