import React from "react";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { DrugDetails } from "../components/DrugDetails";

const renderWithProviders = (ui) => {
  return render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>
  );
};

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
    const { container } = renderWithProviders(<DrugDetails hostData={mockHostData} />);
    expect(container).toMatchSnapshot();
  });

  it("renders disabled inputs for each intraday slot", () => {
    const intradayHostData = {
      drugOrder: {
        drugOrder: {
          drug: { name: "Prednisolone" },
          duration: 5,
          durationUnits: "Day(s)",
          scheduledDate: null,
        },
        uniformDosingType: { dose: null, doseUnits: "mg", frequency: null },
        route: "Oral",
        intradayDose: { morning: 10, afternoon: 0, evening: 30, night: 10 },
      },
    };

    const { container } = renderWithProviders(<DrugDetails hostData={intradayHostData} />);
    const inputs = container.querySelectorAll("input[id^='intraday-dose-']");
    expect(inputs.length).toBe(4);
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
