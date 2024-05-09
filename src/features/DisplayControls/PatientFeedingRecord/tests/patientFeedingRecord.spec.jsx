import React from "react";
import { getByText, render, waitFor } from "@testing-library/react";
import PatientFeedingRecordTable from "../components/PatientFeedingRecordTable";
import { patientFeedingRecordHeaders } from "../utils/PatientFeedingRecordUtils";
import PatientFeedingRecord from "../components/PatientFeedingRecord";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";
import MockDate from "mockdate";

const mockRowData = [
  {
    id: "1",
    dateAndTime: "2021-09-01T00:00:00.000Z",
    shift: "Morning",
    route: "Oral",
    feedType: "Milk",
    amount: "100 ml",
  },
  {
    id: "2",
    dateAndTime: "2021-09-01T00:00:00.000Z",
    shift: "Morning",
    route: "Oral",
    feedType: "Milk",
    amount: "100 ml",
  },
];

const mockVisitSummaryData = {
  uuid: "44832301-a09e-4bbb-b521-47144ed302cb",
  startDateTime: 1698301800000,
  stopDateTime: null,
  visitType: "IPD",
  admissionDetails: {
    uuid: "3a0642ef-2403-469d-8fd9-b2478a71e931",
    date: 1698301800000,
    provider: "Super Man",
    notes: null,
  },
  dischargeDetails: null,
};

describe("PatientFeedingRecordTable", () => {
  it("should render PatientFeedingRecordTable", () => {
    const { container } = render(
      <PatientFeedingRecordTable
        rows={mockRowData}
        headers={patientFeedingRecordHeaders}
        useZebraStyles={true}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render rows with data", () => {
    const { getAllByTestId } = render(
      <PatientFeedingRecordTable
        rows={mockRowData}
        headers={patientFeedingRecordHeaders}
        useZebraStyles={true}
      />
    );
    expect(getAllByTestId("table-body-row").length).toBe(2);
  });
});

describe("PatientFeedingRecord", () => {
  it("should render PatientFeedingRecord", () => {
    const { container } = render(
      <IPDContext.Provider
        value={{ config: mockConfig, visitSummary: mockVisitSummaryData }}
      >
        <PatientFeedingRecord patientId="__test_patient_uuid__" />
      </IPDContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render current shift button", async () => {
    MockDate.set("2021-09-01T00:00:00.000Z");
    const { getByTestId, getByText } = render(
      <IPDContext.Provider
        value={{ config: mockConfig, visitSummary: mockVisitSummaryData }}
      >
        <PatientFeedingRecord patientId="__test_patient_uuid__" />
      </IPDContext.Provider>
    );
    const currentButton = getByTestId("current-period");
    expect(currentButton).toBeTruthy();
  });

  it("should render next shift button", async () => {
    MockDate.set("2021-09-01T00:00:00.00", async () => {
      MockDate.set("2021-09-01T00:00:00.000Z");
      const { getByTestId } = render(
        <IPDContext.Provider
          value={{ config: mockConfig, visitSummary: mockVisitSummaryData }}
        >
          <PatientFeedingRecord patientId="__test_patient_uuid__" />
        </IPDContext.Provider>
      );
      const nextButton = getByTestId("next-shift");
      expect(nextButton).toBeTruthy();
    });
  });
  it("should render previous shift button", async () => {
    MockDate.set("2021-09-01T00:00:00.00", async () => {
      MockDate.set("2021-09-01T00:00:00.000Z");
      const { getByTestId } = render(
        <IPDContext.Provider
          value={{ config: mockConfig, visitSummary: mockVisitSummaryData }}
        >
          <PatientFeedingRecord patientId="__test_patient_uuid__" />
        </IPDContext.Provider>
      );
      const previousButton = getByTestId("previous-shift");
      expect(previousButton).toBeTruthy();
    });
  });
  it("should show not in current shift message when not in current shift", async () => {
    MockDate.set("2021-09-01T00:00:00.00", async () => {
      MockDate.set("2021-09-01T00:00:00.000Z");
      const { getByTestId } = render(
        <IPDContext.Provider
          value={{ config: mockConfig, visitSummary: mockVisitSummaryData }}
        >
          <PatientFeedingRecord patientId="__test_patient_uuid__" />
        </IPDContext.Provider>
      );
      const previousButton = getByTestId("previous-shift");
      previousButton.click();
      await waitFor(() => {
        expect(getByText("You're not viewing the current period")).toBeTruthy();
      });
    });
  });
});
