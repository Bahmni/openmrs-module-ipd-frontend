import React from "react";
import { render } from "@testing-library/react";
import { DrugDetails } from "../components/DrugDetails";

const mockHostData = {
  drugOrder: {
    drug: {
      name: "drugName",
    },
    uniformDosingType: {
      dose: "dose",
      doseUnits: "doseUnits",
    },
    route: "route",
    duration: "duration",
  },
};

describe("DrugDetails", () => {
  it("should match snapshot", () => {
    const { container } = render(<DrugDetails hostData={mockHostData} />);
    expect(container).toMatchSnapshot();
  });
});
