import React from "react";
import { render } from "@testing-library/react";
import PatientSummary from "./PatientSummary";

describe("Patient Summary", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<PatientSummary />);
    expect(asFragment()).toMatchSnapshot();
  });
});
