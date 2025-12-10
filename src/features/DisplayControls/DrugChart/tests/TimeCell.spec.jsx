import React from "react";
import TimeCell from "../components/TimeCell";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/react";
import moment from "moment";
import { timeFormatFor24Hr } from "../../../../constants";

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

jest.mock("carbon-components-react", () => {
  const actual = jest.requireActual("carbon-components-react");
  return {
    ...actual,
    Tooltip: ({ children, renderIcon }) => (
      <div>
        {renderIcon && renderIcon()}
        {children}
      </div>
    ),
  };
});

const slotInfoWithin30MinDuration = [
  {
    time: "10:20",
    status: "Pending",
    administrationInfo: "Superman[12.20]",
  },
  {
    time: "10:25",
    status: "Administered",
    administrationInfo: "",
  },
];

const slotInfo = [
  {
    time: "10:40",
    status: "Administered",
    administrationInfo: "Superman[12.20]",
  },
];

const slotInfoWithNotes = [
  {
    time: "10:40",
    status: "Administered",
    administrationInfo: "Superman[12.20]",
    notes: "test notes",
  },
];

describe("TimeCell", () => {
  it("should render icon on left side of cell if minutes is less than 30", () => {
    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);
    const component = render(
      <TimeCell
        slotInfo={[slotInfoWithin30MinDuration[0]]}
        startTime={startTime}
        endTime={endTime}
      />
    );
    expect(component.getByTestId("left-icon")).toBeTruthy();
  });

  it("should render icon on left side of cell since time is close to startTime", () => {
    const startTime = moment("10:30", timeFormatFor24Hr);
    const endTime = moment("11:30", timeFormatFor24Hr);
    const component = render(
      <TimeCell
        slotInfo={[slotInfo[0]]}
        startTime={startTime}
        endTime={endTime}
      />
    );
    expect(component.getByTestId("left-icon")).toBeTruthy();
  });

  it("should render timecell with 2 icons on left", async () => {
    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);
    const component = render(
      <TimeCell
        slotInfo={slotInfoWithin30MinDuration}
        status="Pending"
        startTime={startTime}
        endTime={endTime}
      />
    );
    await waitFor(() => {
      expect(component.getByTestId("left-icon").children.length).toBe(2);
    });
  });

  it("should render icon on right side of cell if minutes is greater than 30", async () => {
    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);
    const component = render(
      <TimeCell slotInfo={slotInfo} startTime={startTime} endTime={endTime} />
    );
    await waitFor(() => {
      expect(component.getByTestId("right-icon")).toBeTruthy();
    });
  });

  it("should show notes icon when notes is present", () => {
    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);
    const component = render(
      <TimeCell
        slotInfo={slotInfoWithNotes}
        startTime={startTime}
        endTime={endTime}
      />
    );

    expect(component.getByTestId("right-notes")).toBeTruthy();
  });

  it("should highlight only left side of the cell if highligted flag is true", () => {
    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);
    const component = render(
      <TimeCell
        slotInfo={slotInfo}
        doHighlightCell={true}
        highlightedCell={"left"}
        startTime={startTime}
        endTime={endTime}
      />
    );

    expect(component.getByTestId("left-icon")).toHaveClass("highlightedCell");
    expect(component.getByTestId("right-icon")).not.toHaveClass(
      "highlightedCell"
    );
  });

  it("should highlight only right side of the cell if highligted flag is true", () => {
    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);
    const component = render(
      <TimeCell
        slotInfo={slotInfo}
        doHighlightCell={true}
        highlightedCell={"right"}
        startTime={startTime}
        endTime={endTime}
      />
    );

    expect(component.getByTestId("left-icon")).not.toHaveClass(
      "highlightedCell"
    );
    expect(component.getByTestId("right-icon")).toHaveClass("highlightedCell");
  });

  it("should not highlight if highligted flag cell is false", () => {
    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);
    const component = render(
      <TimeCell
        slotInfo={slotInfo}
        doHighlightCell={false}
        highlightedCell={"left"}
        startTime={startTime}
        endTime={endTime}
      />
    );

    expect(component.getByTestId("left-icon")).not.toHaveClass(
      "highlightedCell"
    );
    expect(component.getByTestId("right-icon")).not.toHaveClass(
      "highlightedCell"
    );
  });

  it("should render with config containing drugChartNoteAmendment", () => {
    const slotWithAmendableNote = [
      {
        time: "10:40",
        status: "Administered",
        administrationInfo: "Superman[12.20]",
        notes: "test notes",
        originalSlot: {
          medicationAdministration: {
            providers: [
              { function: "Performer", provider: { uuid: "provider-123" } },
            ],
          },
          administrationSummary: {
            status: "Administered",
            approvalStatus: null,
          },
        },
      },
    ];

    const config = {
      drugChartNoteAmendment: {
        isAmendFeatureEnabled: true,
      },
    };

    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);

    const { container, getByText } = render(
      <TimeCell
        slotInfo={slotWithAmendableNote}
        startTime={startTime}
        endTime={endTime}
        currentProviderUuid="provider-123"
        config={config}
      />
    );

    expect(container.querySelector("[data-testid='right-notes']")).toBeTruthy();
    expect(getByText("Amend Note")).toBeInTheDocument();
  });

  it("should render without config - backward compatibility", () => {
    const slotWithNote = [
      {
        time: "10:40",
        status: "Administered",
        administrationInfo: "Superman[12.20]",
        notes: "test notes",
        originalSlot: {
          medicationAdministration: {
            providers: [
              { function: "Performer", provider: { uuid: "provider-123" } },
            ],
          },
          administrationSummary: {
            status: "Administered",
          },
        },
      },
    ];

    const startTime = moment("10:00", timeFormatFor24Hr);
    const endTime = moment("11:00", timeFormatFor24Hr);

    const component = render(
      <TimeCell
        slotInfo={slotWithNote}
        startTime={startTime}
        endTime={endTime}
        currentProviderUuid="provider-123"
      />
    );

    expect(component.getByTestId("right-notes")).toBeTruthy();
    expect(component.queryByText("Amend Note")).not.toBeInTheDocument();
  });
});
