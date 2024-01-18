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

const slotInfoWithin30MinDuration = [
  {
    minutes: "20",
    status: "Pending",
    administrationInfo: "Superman[12.20]",
  },
  {
    minutes: "25",
    status: "Administered",
    administrationInfo: "",
  },
];

const slotInfo = [
  {
    minutes: "40",
    status: "Administered",
    administrationInfo: "Superman[12.20]",
  },
];

const slotInfoWithNotes = [
  {
    minutes: "40",
    status: "Administered",
    administrationInfo: "Superman[12.20]",
    notes: "test notes",
  },
];

describe("TimeCell", () => {
  it("should render icon on left side of cell if minutes is less than 30", () => {
    const component = render(
      <TimeCell slotInfo={[slotInfoWithin30MinDuration[0]]} />
    );
    expect(component.getByTestId("left-icon")).toBeTruthy();
  });

  it("should render timecell with 2 icons on left", () => {
    const component = render(
      <TimeCell slotInfo={slotInfoWithin30MinDuration} status="Pending" />
    );
    expect(component.getByTestId("left-icon").children.length).toBe(2);
  });

  it("should render icon on right side of cell if minutes is greater than 30", async () => {
    const component = render(<TimeCell slotInfo={slotInfo} />);
    await waitFor(() => {
      expect(component.getByTestId("right-icon")).toBeTruthy();
    });
  });

  it("should show notes icon when notes is present", () => {
    const component = render(<TimeCell slotInfo={slotInfoWithNotes} />);

    expect(component.getByTestId("right-notes")).toBeTruthy();
  });

  it("should highlight only left side of the cell if highligted flag is true", () => {
    const component = render(
      <TimeCell
        slotInfo={slotInfo}
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
        slotInfo={slotInfo}
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
        slotInfo={slotInfo}
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
