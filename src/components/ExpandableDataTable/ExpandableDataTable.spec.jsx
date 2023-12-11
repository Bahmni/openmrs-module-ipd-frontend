import { render } from "@testing-library/react";
import React from "react";
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

  it("should not render expandable row if disableExpand is true", () => {
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
    expect(queryByTestId("non-expandable-row")).toBeTruthy();
    expect(queryByTestId("expandable-row")).toBeFalsy();
  });

  it("should render expandable row if disableExpand is false or not passed", () => {
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
          },
        ]}
        component={() => {}}
        useZebraStyles={true}
      />
    );
    expect(queryByTestId("non-expandable-row")).toBeFalsy();
    expect(queryByTestId("expandable-row")).toBeTruthy();
  });
});
