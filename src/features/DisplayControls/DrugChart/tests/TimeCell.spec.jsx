import React from "react";
import TimeCell from "../components/TimeCell";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/react";

const MockTooltipCarbon = jest.fn();
jest.mock("../../../../icons/note.svg");

jest.mock("bahmni-carbon-ui", () => {
  return {
    TooltipCarbon: (props) => {
      MockTooltipCarbon(props);
      return <div>TooltipCarbon</div>;
    },
  };
});

describe("TimeCell", () => {
  it("should render icon on left side of cell if minutes is less than 30", () => {
    const component = render(<TimeCell minutes="20" status="Pending" />);
    expect(component.getByTestId("left-icon")).toBeTruthy();
  });

  it("should render icon on right side of cell if minutes is less than 30", async () => {
    const component = render(
      <TimeCell
        minutes="40"
        status="Administered"
        medicationNotes="Temp notes"
      />
    );
    await waitFor(() => {
      expect(component.getByTestId("right-icon")).toBeTruthy();
    });
  });

  it("should highlight only left side of the cell if highligted flag is true", () => {
    const component = render(
      <TimeCell
        minutes="40"
        status="Administered"
        doHighlightCell={true}
        highlightedCell={"left"}
      />
    );

    expect(component.getByTestId("left-icon")).toHaveClass("highligtedCell");
    expect(component.getByTestId("right-icon")).not.toHaveClass(
      "highligtedCell"
    );
  });

  it("should highlight only right side of the cell if highligted flag is true", () => {
    const component = render(
      <TimeCell
        minutes="40"
        status="Administered"
        doHighlightCell={true}
        highlightedCell={"right"}
      />
    );

    expect(component.getByTestId("left-icon")).not.toHaveClass(
      "highligtedCell"
    );
    expect(component.getByTestId("right-icon")).toHaveClass("highligtedCell");
  });

  it("should not highlight if highligted flag cell is false", () => {
    const component = render(
      <TimeCell
        minutes="40"
        status="Administered"
        doHighlightCell={false}
        highlightedCell={"left"}
      />
    );

    expect(component.getByTestId("left-icon")).not.toHaveClass(
      "highligtedCell"
    );
    expect(component.getByTestId("right-icon")).not.toHaveClass(
      "highligtedCell"
    );
  });
});
