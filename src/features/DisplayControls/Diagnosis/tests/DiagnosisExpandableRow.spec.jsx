import { render } from "@testing-library/react";
import React from "react";
import DiagnosisExpandableRow from "../components/DiagnosisExpandableRow";

describe("ExpandableRowData", () => {
  it("should render ExpandableRowData component", async () => {
    render(<DiagnosisExpandableRow data={[]} />);
  });
});
