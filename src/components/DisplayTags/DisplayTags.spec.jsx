import { render } from "@testing-library/react";
import React from "react";
import DisplayTags from "./DisplayTags";

describe("DisplayTags", () => {
  it("should render DisplayTags", () => {
    render(
      <DisplayTags
        drugOrder={{ asNeeded: true, frequency: "STAT (Immediately)" }}
        ipdConfig={{ config: { medicationTags: { default: "Rx" } } }}
      />
    );
  });

  it("should render medication tags based on config", () => {
    const { getByText } = render(
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
    );
    expect(getByText("Rx-PRN")).toBeTruthy();
    expect(getByText("Rx-STAT")).toBeTruthy();
  });
});
