import { render } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import ExpandableDataTable from "./ExpandableDataTable";

describe("ExpandableDataTable", () => {
  it("should render ExpandableDataTable", () => {
    render(
      <ExpandableDataTable
        rows={[]}
        headers={[]}
        additionalData={[]}
        component={() => {}}
        useZebraStyles={true}
      />
    );
  });

  it("should render expandable row on clicking the icon", () => {
    const { queryByTestId } = render(
      <ExpandableDataTable
        rows={[
          {
            id: "1",
            name: "test",
          },
        ]}
        headers={[
          {
            id: "1",
            header: "Name",
            key: "name",
            isSortable: false,
          },
        ]}
        additionalData={[
          {
            id: "1",
            disableExpand: true,
          },
        ]}
        component={() => {}}
        useZebraStyles={true}
      />
    );
    expect(queryByTestId("expandable-row")).toBeTruthy();
  });
});

describe("row class names", () => {
  const rows = [{ id: "1", name: "test" }];
  const headers = [
    { id: "1", header: "Name", key: "name", isSortable: false },
  ];

  const renderTable = (additionalData) =>
    render(
      <ExpandableDataTable
        rows={rows}
        headers={headers}
        additionalData={additionalData}
        component={() => <div />}
        useZebraStyles={true}
      />
    );

  it("applies green-row when isNotScheduled is true", () => {
    const { queryByTestId } = renderTable([
      { id: "1", isNotScheduled: true },
    ]);
    const row =
      queryByTestId("expandable-row") || queryByTestId("non-expandable-row");
    expect(row).toHaveClass("green-row");
  });

  it("applies in-progress-row when isInProgress is true", () => {
    const { queryByTestId } = renderTable([
      { id: "1", isInProgress: true },
    ]);
    const row =
      queryByTestId("expandable-row") || queryByTestId("non-expandable-row");
    expect(row).toHaveClass("in-progress-row");
  });

  it("applies no special class when isCompleted is true", () => {
    const { queryByTestId } = renderTable([
      { id: "1", isCompleted: true },
    ]);
    const row =
      queryByTestId("expandable-row") || queryByTestId("non-expandable-row");
    expect(row).not.toHaveClass("green-row");
    expect(row).not.toHaveClass("in-progress-row");
    expect(row).not.toHaveClass("variable-dose-row");
  });

  it("applies variable-dose-row when isVariableDose is true and not scheduled/inProgress/completed", () => {
    const { queryByTestId } = renderTable([
      { id: "1", isVariableDose: true },
    ]);
    const row =
      queryByTestId("expandable-row") || queryByTestId("non-expandable-row");
    expect(row).toHaveClass("variable-dose-row");
  });
});

describe("zebra striping", () => {
  const headers = [{ id: "1", header: "Name", key: "name", isSortable: false }];
  const rows = [
    { id: "1", name: "regular-1" },
    { id: "2", name: "vdp-1" },
    { id: "3", name: "regular-2" },
    { id: "4", name: "regular-3" },
  ];
  const additionalData = [
    { id: "1" },
    { id: "2", isVariableDose: true },
    { id: "3" },
    { id: "4" },
  ];

  it("alternates plain-row and zebra-row for regular rows, skipping VDP rows in the count", () => {
    const { getAllByTestId } = render(
      <ExpandableDataTable
        rows={rows}
        headers={headers}
        additionalData={additionalData}
        component={() => <div />}
        useZebraStyles={true}
        isExpandable={(data) => !!data.isVariableDose}
      />
    );
    const allRows = getAllByTestId(/expandable-row|non-expandable-row/);
    expect(allRows[0]).toHaveClass("plain-row");
    expect(allRows[1]).not.toHaveClass("plain-row");
    expect(allRows[1]).not.toHaveClass("zebra-row");
    expect(allRows[2]).toHaveClass("zebra-row");
    expect(allRows[3]).toHaveClass("plain-row");
  });

  it("applies no zebra or plain class when useZebraStyles is false", () => {
    const { getAllByTestId } = render(
      <ExpandableDataTable
        rows={[{ id: "1", name: "test" }, { id: "2", name: "test2" }]}
        headers={headers}
        additionalData={[{ id: "1" }, { id: "2" }]}
        component={() => <div />}
        useZebraStyles={false}
      />
    );
    getAllByTestId(/expandable-row|non-expandable-row/).forEach((row) => {
      expect(row).not.toHaveClass("zebra-row");
      expect(row).not.toHaveClass("plain-row");
    });
  });
});
