import React from "react";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { DrugInstructions } from "../components/DrugInstructions";

const renderWithProviders = (ui) => {
  return render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>
  );
};

const mockHostData = {
  drugOrder: {
    instructions: "instructions",
    additionalInstructions: "additionalInstructions",
  },
};

describe("DrugInstructions", () => {
  it("should match snapshot", () => {
    const { container } = renderWithProviders(<DrugInstructions hostData={mockHostData} />);
    expect(container).toMatchSnapshot();
  });
});
