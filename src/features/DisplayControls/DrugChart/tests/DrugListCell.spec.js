import React from "react";
import { render } from "@testing-library/react";
import DrugListCell from "../components/DrugListCell";
import {
  testDrugInfo,
  testDrugInfoWithAdministeredLateStatus,
  testDrugInfoWithAdministeredStatus,
} from "./DrugListCellMockData";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";

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

describe("DrugListCell", () => {
  it("should  match snapshot", () => {
    const { container } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={testDrugInfo} />
      </IPDContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should  match snapshot for for drug cell with admin info status as Administered-Late", () => {
    const { container } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={testDrugInfoWithAdministeredLateStatus} />
      </IPDContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should  match snapshot for drug cell with admin info status as Administered", () => {
    const { container } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={testDrugInfoWithAdministeredStatus} />
      </IPDContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
