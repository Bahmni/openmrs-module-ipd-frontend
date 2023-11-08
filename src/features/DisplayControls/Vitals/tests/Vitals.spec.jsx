import React from "react";
import { render } from "@testing-library/react";
import Vitals from "../components/Vitals";

describe("Vitals", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<Vitals />);
    expect(asFragment()).toMatchSnapshot();
  });
});
