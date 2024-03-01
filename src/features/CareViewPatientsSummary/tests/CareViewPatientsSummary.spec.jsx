import React from "react";
import { render, waitFor } from "@testing-library/react";
import { CareViewPatientsSummary } from "../components/CareViewPatientsSummary";
import { mockPatientsList } from "./CareViewPatientsSummaryMock";
import { CareViewContext } from "../../../context/CareViewContext";
import MockDate from "mockdate";
import { mockConfig } from "../../../utils/CommonUtils";
import { mockSlotsData } from "../../CareViewSummary/tests/CareViewSummaryMock";
import "@testing-library/jest-dom/extend-expect";

const mockContext = {
  careViewConfig: { timeframeLimitInHours: 2 },
  ipdConfig: mockConfig,
};

const mockGetSlotsForPatients = jest.fn();
jest.mock("../../CareViewSummary/utils/CareViewSummary", () => {
  return {
    getSlotsForPatients: () => mockGetSlotsForPatients(),
  };
});

describe("CareViewPatientsSummary", function () {
  afterEach(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSlotsForPatients.mockReturnValue(mockSlotsData);
    MockDate.set("2023-01-01T12:00:00");
  });

  it("should match snapshot", () => {
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
        />
      </CareViewContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should fetch slot details on initial render", () => {
    render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
        />
      </CareViewContext.Provider>
    );

    expect(mockGetSlotsForPatients).toHaveBeenCalled();
  });

  it("renders table headers correctly", async () => {
    const { queryByTestId } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(queryByTestId("slot-details-header-0")).toBeTruthy();
      expect(queryByTestId("time-frame-0")).toHaveTextContent("12:00");
      expect(queryByTestId("time-frame-1")).toHaveTextContent("13:00");
      expect(queryByTestId("time-frame-2")).toBeNull();
    });
  });

  it("renders patient details correctly", async () => {
    const { queryByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(queryByText("ET55749")).toBeTruthy();
      expect(queryByText("user three")).toBeTruthy();
      expect(queryByText("ICU1")).toBeTruthy();
      expect(queryByText("30")).toBeTruthy();
    });
  });

  it("renders slot details correctly", async () => {
    const { queryByText, queryByTestId } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewPatientsSummary
          patientsSummary={mockPatientsList.admittedPatients}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(
        queryByText("Amoxicillin/Clavulanic Acid 1000 mg Tablet")
      ).toBeTruthy();
      expect(queryByTestId("drug-details")).toHaveTextContent(
        "2Tablet(s) | Oral"
      );
    });
  });
});
