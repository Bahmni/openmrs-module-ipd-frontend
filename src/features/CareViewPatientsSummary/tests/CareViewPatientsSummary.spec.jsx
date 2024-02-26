import React from "react";
import { render } from "@testing-library/react";
import { CareViewPatientsSummary } from "../components/CareViewPatientsSummary";
import { mockPatientsList } from "./CareViewPatientsSummaryMock";

describe("CareViewPatientsSummary", function () {
  it("should match snapshot", () => {
    const { container } = render(
      <CareViewPatientsSummary patientsSummary={mockPatientsList} />
    );
    expect(container).toMatchSnapshot();
  });
});
