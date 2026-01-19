import { render, waitFor, screen } from "@testing-library/react";
import React from "react";
import {
  mockAllergiesIntolerenceResponse,
  mockVisitSummaryData,
} from "./AllergiesTestUtils";
import Allergies from "./Allergies";
import "@testing-library/jest-dom/extend-expect";
import { IPDContext } from "../../../../context/IPDContext";

const mockData1 = { ...mockAllergiesIntolerenceResponse.data };
const mockUseFetchAllergiesIntolerance = jest.fn();

jest.mock("../hooks/useFetchAllergiesIntolerance", () => {
  return {
    useFetchAllergiesIntolerance: () => mockUseFetchAllergiesIntolerance(),
  };
});
jest.mock("../utils/AllergiesUtils", () => ({
  getNoKnownAllergyUuid: jest.fn(() =>
    Promise.resolve("f535bd4e-33ff-4f35-bf7c-189e07d1ac90")
  ),
}));

describe("Allergies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFetchAllergiesIntolerance.mockImplementation(() => ({
      allergiesData: mockData1,
      isLoading: false,
    }));
  });

  it("should render Allergies", () => {
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Allergies patientId={"__test_patient_uuid__"} />
      </IPDContext.Provider>
    );

    expect(screen.getByText("Allergen")).toBeInTheDocument();
  });

  it("should show data in the table", async () => {
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Allergies patientId={"__test_patient_uuid__"} />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole(/table/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Beef")).toBeInTheDocument();
    expect(screen.getAllByText("Bailly RURANGIRWA")).toBeTruthy();
    expect(screen.getByText(/test comment/i)).toBeInTheDocument();
  });

  it("should highlight row in red for severe allergies", async () => {
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Allergies patientId={"__test_patient_uuid__"} />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole(/table/i)).toBeInTheDocument();
    });

    // Check that rows with Severe allergies have high-severity-color class
    const rows = screen.getAllByTestId("table-body-row");
    expect(rows[0]).toHaveClass("high-severity-color"); // Beef - Severe
    expect(rows[1]).toHaveClass("high-severity-color"); // Milk product - Severe
  });

  it("should apply strike-through styling to 'no known allergy' row when multiple allergies exist", async () => {
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Allergies patientId={"__test_patient_uuid__"} />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole(/table/i)).toBeInTheDocument();
    });

    // Check that "No Known Allergy" row has no-known-allergy class when there are multiple allergies
    const rows = screen.getAllByTestId("table-body-row");
    expect(rows[4]).toHaveClass("no-known-allergy"); // No Known Allergy - last row
    expect(rows[4]).toHaveTextContent("No Known Allergy");
  });

  it("should sort Allergen in ASC order based on severity", async () => {
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Allergies patientId={"__test_patient_uuid__"} />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole(/table/i)).toBeInTheDocument();
    });

    // Check Severe severity (weight -1) - appears first
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

    // Check Moderate severity (weight 0) - appears second
    expect(screen.getAllByTestId("table-body-row")[2]).toHaveTextContent(
      "Dust"
    );
    expect(screen.getAllByTestId("table-body-row")[2]).toHaveTextContent(
      "Moderate"
    );

    // Check Mild severity (weight 1) - appears third
    expect(screen.getAllByTestId("table-body-row")[3]).toHaveTextContent(
      "Wheat"
    );
    expect(screen.getAllByTestId("table-body-row")[3]).toHaveTextContent(
      "Mild"
    );

    // Check No Known Allergy (weight 2) - appears last
    expect(screen.getAllByTestId("table-body-row")[4]).toHaveTextContent(
      "No Known Allergy"
    );
  });

  it("should show table skeleton on loading", async () => {
    mockUseFetchAllergiesIntolerance.mockImplementation(() => ({
      allergiesData: mockData1,
      isLoading: true,
    }));
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Allergies patientId={"__test_patient_uuid__"} />
      </IPDContext.Provider>
    );

    expect(screen.getByTestId("datatable-skeleton")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Milk products")).toBeFalsy();
      expect(screen.queryByText("Beef")).toBeFalsy();
      expect(screen.queryByText("Dust")).toBeFalsy();
      expect(screen.queryByText("Wheat")).toBeFalsy();
    });
  });

  it("should show no data message when there is no data", async () => {
    mockUseFetchAllergiesIntolerance.mockImplementationOnce(() => ({
      allergiesData: { ...mockData1, entry: undefined },
    }));
    render(
      <IPDContext.Provider
        value={{
          visitSummary: mockVisitSummaryData,
        }}
      >
        <Allergies patientId={"__test_patient_uuid__"} />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No Allergen is captured for this patient yet/i)
      ).toBeInTheDocument();
    });
  });

  it("should show Allergy data exclusively for current and previous dates if it pertains to an inactive inpatient visit", async () => {
    render(
      <IPDContext.Provider
        value={{
          visitSummary: {
            ...mockVisitSummaryData,
            stopDateTime: 1698316200000,
          },
        }}
      >
        <Allergies patientId={"__test_patient_uuid__"} />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Milk products")).toBeFalsy();
      expect(screen.queryByText("Beef")).toBeTruthy();
      expect(screen.queryByText("Dust")).toBeTruthy();
      expect(screen.queryByText("Wheat")).toBeTruthy();
    });
  });
});
