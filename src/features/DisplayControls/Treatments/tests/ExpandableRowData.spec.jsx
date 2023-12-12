import { render } from "@testing-library/react";
import React from "react";
import ExpandableRowData from "../components/ExpandableRowData";

describe("ExpandableRowData", () => {
  it("should render ExpandableRowData component", async () => {
    render(<ExpandableRowData expandTreatmentData={[]} />);
  });
});
