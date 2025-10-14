import React from "react";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { DrugInstructions } from "../components/DrugInstructions";

const mockHostData = {
  drugOrder: {
    instructions: "instructions",
    additionalInstructions: "additionalInstructions",
  },
};

describe("DrugInstructions", () => {
  it("should match snapshot", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <DrugInstructions hostData={mockHostData} />
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
