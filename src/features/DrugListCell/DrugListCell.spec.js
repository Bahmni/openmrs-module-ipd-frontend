import React from "react";
import { render } from "@testing-library/react";
import DrugListCell from "./DrugListCell";
import {
  testDrugInfo,
  testDrugInfoWithAdministeredLateStatus,
  testDrugInfoWithAdministeredStatus,
} from "./DrugListCellMockData";

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
