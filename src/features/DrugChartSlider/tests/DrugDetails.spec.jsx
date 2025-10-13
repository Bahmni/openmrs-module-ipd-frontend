import React from "react";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
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
    const { container } = render(
      <IntlProvider locale="en">
        <DrugDetails hostData={mockHostData} />
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
