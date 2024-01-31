import { render } from "@testing-library/react";
import React from "react";
import DisplayTags from "./DisplayTags";
import { IPDContext } from "../../context/IPDContext";
import { mockConfig } from "../../utils/CommonUtils";

describe("DisplayTags", () => {
  it("should render DisplayTags", () => {
    render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DisplayTags
          drugOrder={{ asNeeded: true, frequency: "STAT (Immediately)" }}
          ipdConfig={{ config: { medicationTags: { default: "Rx" } } }}
        />
      </IPDContext.Provider>
    );
  });

  it("should render medication tags based on config", () => {
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <DisplayTags
          drugOrder={{ asNeeded: true, frequency: "STAT (Immediately)" }}
          ipdConfig={{
            config: {
              medicationTags: {
                asNeeded: "Rx-PRN",
                "STAT (Immediately)": "Rx-STAT",
              },
            },
          }}
        />
      </IPDContext.Provider>
    );
    expect(getByText("Rx-PRN")).toBeTruthy();
    expect(getByText("Rx-STAT")).toBeTruthy();
  });
});
