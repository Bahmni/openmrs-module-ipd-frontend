import React from "react";
import { render } from "@testing-library/react";
import { CareViewPatientsSummary } from "../components/CareViewPatientsSummary";
import { mockPatientsList } from "./CareViewPatientsSummaryMock";
import { CareViewContext } from "../../../context/CareViewContext";
import MockDate from "mockdate";

const mockContext = {
  dashboardConfig: { timeframeLimitInHours: 2 },
};

describe("CareViewPatientsSummary", function () {
  afterEach(() => {
    MockDate.reset();
  });

  beforeEach(() => {
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
});
