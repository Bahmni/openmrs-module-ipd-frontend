import React from "react";
import { render } from "@testing-library/react";
import { TestComp } from "./TestComp";

describe("TestComp", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TestComp />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("contains dummy data", () => {
    const component = render(<TestComp />);
    expect(
      component.getByRole("heading", { name: "Hello World!" })
    ).toBeTruthy();
  });
});
