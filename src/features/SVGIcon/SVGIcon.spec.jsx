import React from "react";
import { render } from "@testing-library/react";
import SVGIcon from "./SVGIcon";

const MockTooltipCarbon = jest.fn();
jest.mock("../../icons/pending.svg");

jest.mock("bahmni-carbon-ui", () => {
  return {
    TooltipCarbon: (props) => {
      MockTooltipCarbon(props);
      return <div>TooltipCarbon</div>;
    },
  };
});

describe("SVGImage", () => {
  it("should render pending icon when info is not present", () => {
    render(<SVGIcon iconType="Pending" />);
    expect(MockTooltipCarbon).not.toHaveBeenCalled();
  });

  it("should render pending icon when info is present", () => {
    render(<SVGIcon iconType="Administered" info="info" />);
    expect(MockTooltipCarbon).toHaveBeenCalled();
    expect(MockTooltipCarbon).toHaveBeenCalledWith({
      icon: expect.any(Function),
      content: "info",
    });
  });
});
