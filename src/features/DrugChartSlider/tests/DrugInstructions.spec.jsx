import React from "react";
import { render } from "@testing-library/react";
import { DrugInstructions } from "../components/DrugInstructions";

const mockHostData = {
  drugOrder: {
    instructions: "instructions",
    additionalInstructions: "additionalInstructions",
  },
};

describe("DrugInstructions", () => {
  it("should match snapshot", () => {
    const { container } = render(<DrugInstructions hostData={mockHostData} />);
    expect(container).toMatchSnapshot();
  });
});
