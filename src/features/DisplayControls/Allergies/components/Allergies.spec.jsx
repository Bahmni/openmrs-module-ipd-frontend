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
    expect(screen.getByText(/test comment/i)).toBeInTheDocument();
  });

  it("should highlight column in red", async () => {
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
    expect(screen.getAllByRole("cell", { name: /severe/i })[0]).toHaveClass(
      "high-severity-color"
    );
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
    expect(
      screen.queryByTestId("datatable-with-value")
    ).not.toBeInTheDocument();
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
