import React from "react";
import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import DrugListCell from "../components/DrugListCell";
import {
  testDrugInfo,
  testDrugInfoWithAdministeredLateStatus,
  testDrugInfoWithAdministeredStatus,
} from "./DrugListCellMockData";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";

const MockTooltip = jest.fn();
jest.mock("../../../../icons/note.svg");

jest.mock("carbon-components-react", () => {
  const actual = jest.requireActual("carbon-components-react");
  return {
    ...actual,
    Tooltip: (props) => {
      MockTooltip(props);
      return <div>{props.children}</div>;
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

describe("variable dose order", () => {
  beforeEach(() => {
    MockTooltip.mockClear();
  });

  const mockVariableDrugInfo = {
    dosingInstructions: {
      dosage: 18,
      doseUnits: "Tablet(s)",
      route: "Oral",
      frequency: null,
      instructions: null,
      asNeeded: false,
    },
    duration: "5 Day(s)",
    name: "Prednisolone",
    slots: [],
    notes: null,
    orderReasonText: null,
    isVariableDose: true,
    fhirDosages: [
      {
        sequence: 1,
        text: "Loading Dose",
        timing: { code: { text: "Once" }, repeat: { count: 1 } },
        doseAndRate: [{ doseQuantity: { value: 5, unit: "Tablet(s)" } }],
        additionalInstruction: [{ text: "After meals" }],
        patientInstruction: "",
      },
      {
        sequence: 2,
        text: "Stage 1",
        timing: {
          code: { text: "Once a day" },
          repeat: { duration: 3, durationUnit: "d" },
        },
        doseAndRate: [{ doseQuantity: { value: 3, unit: "Tablet(s)" } }],
        additionalInstruction: [],
        patientInstruction: "Take with food",
      },
    ],
    stageSchedules: [
      { variableDosageSequence: 2, isScheduled: true, notes: "Nurse note stage 1" },
    ],
  };

  it("shows stages and days summary instead of dosage for variable dose order", () => {
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={mockVariableDrugInfo} />
      </IPDContext.Provider>
    );
    // loading dose present → "Loading Dose + 1 Stages - 3 Days" rendered as two nodes
    expect(getByText("Loading Dose +")).toBeInTheDocument();
    expect(getByText("1 Stages - 3 Days")).toBeInTheDocument();
  });

  it("shows Variable Dosage tag for variable dose order", () => {
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={mockVariableDrugInfo} />
      </IPDContext.Provider>
    );
    expect(getByText("Variable Dosage")).toBeInTheDocument();
  });

  it("note icon tooltip content includes stage label and nurse notes", () => {
    render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={mockVariableDrugInfo} />
      </IPDContext.Provider>
    );
    expect(MockTooltip).toHaveBeenCalled();
    const callArgs = MockTooltip.mock.calls[0][0];
    const content = callArgs.children;
    expect(content).not.toBeNull();
    // Stage 1 (sequence=2, 1 loading dose → Stage 1) has nurse notes
    const contentHtml = renderToStaticMarkup(content);
    expect(contentHtml).toContain("Stage 1");
    expect(contentHtml).toContain("Nurse note stage 1");
  });

  it("note icon tooltip shows Loading Dose section when it has instructions", () => {
    render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={mockVariableDrugInfo} />
      </IPDContext.Provider>
    );
    expect(MockTooltip).toHaveBeenCalled();
    const callArgs = MockTooltip.mock.calls[0][0];
    const contentHtml = renderToStaticMarkup(callArgs.children);
    expect(contentHtml).toContain("Loading Dose");
    expect(contentHtml).toContain("After meals");
  });

  it("note icon is not shown when no stages have content", () => {
    const noContentDrugInfo = {
      ...mockVariableDrugInfo,
      fhirDosages: [
        {
          sequence: 1,
          text: "Stage 1",
          timing: { code: { text: "Once a day" }, repeat: { duration: 3, durationUnit: "d" } },
          doseAndRate: [{ doseQuantity: { value: 5, unit: "Tablet(s)" } }],
          additionalInstruction: [],
          patientInstruction: "",
          },
      ],
      stageSchedules: [],
    };
    render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={noContentDrugInfo} />
      </IPDContext.Provider>
    );
    expect(MockTooltip).not.toHaveBeenCalled();
  });
});

describe("intraday order in DrugListCell", () => {
  it("renders intradayDoseString when isIntraday is true", () => {
    const intradayDrugInfo = {
      dosingInstructions: {
        dosage: null,
        doseUnits: "mg",
        route: "Oral",
        frequency: null,
        instructions: null,
        asNeeded: false,
      },
      duration: "5 Day(s)",
      name: "Prednisolone",
      slots: [],
      notes: null,
      orderReasonText: null,
      isVariableDose: false,
      fhirDosages: null,
      stageSchedules: null,
      isIntraday: true,
      intradayDoseString: "10-0-30-10 mg - Oral - for 5 Day(s)",
    };

    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DrugListCell drugInfo={intradayDrugInfo} />
      </IPDContext.Provider>
    );

    expect(getByText("10-0-30-10 mg - Oral - for 5 Day(s)")).toBeTruthy();
  });
});
