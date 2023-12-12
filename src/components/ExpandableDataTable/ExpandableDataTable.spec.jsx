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
