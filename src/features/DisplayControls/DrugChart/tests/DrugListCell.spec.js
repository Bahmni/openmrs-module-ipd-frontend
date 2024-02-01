import React from "react";
import { render } from "@testing-library/react";
import DrugListCell from "../components/DrugListCell";
import {
  testDrugInfo,
  testDrugInfoWithAdministeredLateStatus,
  testDrugInfoWithAdministeredStatus,
} from "./DrugListCellMockData";

const MockTooltipCarbon = jest.fn();
jest.mock("../../../../icons/note.svg");

jest.mock("bahmni-carbon-ui", () => {
  return {
    TooltipCarbon: (props) => {
      MockTooltipCarbon(props);
      return <div>TooltipCarbon</div>;
    },
  };
});

describe.skip("DrugListCell", () => {
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
