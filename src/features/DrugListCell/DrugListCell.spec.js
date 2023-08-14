import React from "react";
import { render } from "@testing-library/react";
import DrugListCell from "./DrugListCell";

const testDrugInfo = {
  drugName: "Suxamethonium Chloride 100 mg/2 mL Ampoule (50 mg/mL )",
  drugRoute: "Intravenous",
  administrationInfo: [],
  duration: "4 Day(s)",
  dosage: 2,
  doseType: "mg",
};

const testDrugInfoWithAdministeredLateStatus = {
  drugName: "Enalapril 5 mg Tablet",
  drugRoute: "Oral",
  administrationInfo: [
    {
      time: 8.45,
      kind: "Administered-Late",
    },
  ],
  duration: "4 Day(s)",
  dosage: 1,
  doseType: "Tablet(s)",
};

const testDrugInfoWithAdministeredStatus = {
  drugName: "Enalapril 5 mg Tablet",
  drugRoute: "Oral",
  administrationInfo: [
    {
      time: 8.45,
      kind: "Administered",
    },
  ],
  duration: "4 Day(s)",
  dosage: 1,
  doseType: "Tablet(s)",
};
describe("DrugListCell", () => {
  it("should  match snapshot", () => {
    const { container } = render(<DrugListCell drugInfo={testDrugInfo} />);
    expect(container).toMatchSnapshot();
  });

  it("should  match snapshot for for drug cell with admin info status as Administered-Late", () => {
    const { container } = render(
      <DrugListCell drugInfo={testDrugInfoWithAdministeredLateStatus} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should  match snapshot for drug cell with admin info status as Administered", () => {
    const { container } = render(
      <DrugListCell drugInfo={testDrugInfoWithAdministeredStatus} />
    );
    expect(container).toMatchSnapshot();
  });
});
