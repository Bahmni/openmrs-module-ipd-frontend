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
  const test = ["Not-Administered", "Pending", "Late"];

  test.forEach((iconType) => {
    it(`should render ${iconType} icon`, () => {
      render(<SVGIcon iconType={iconType} />);
      expect(MockTooltipCarbon).not.toHaveBeenCalled();
    });
  });

  it("should render Administered icon when info is present", () => {
    render(<SVGIcon iconType="Administered" info="info" />);
    expect(MockTooltipCarbon).toHaveBeenCalled();
    expect(MockTooltipCarbon).toHaveBeenCalledWith({
      icon: expect.any(Function),
      content: "info",
    });
  });

  it("should render Administered-Late icon when info is present", () => {
    render(<SVGIcon iconType="Administered-Late" info="info" />);
    expect(MockTooltipCarbon).toHaveBeenCalled();
    expect(MockTooltipCarbon).toHaveBeenCalledWith({
      icon: expect.any(Function),
      content: "info",
    });
  });
});
