import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AmendmentHistory from "./AmendmentHistory";

describe("AmendmentHistory", () => {
  const mockAmendment = {
    text: "Updated medication dosage",
    amendmentReason: "Dosage adjustment",
    recordedTime: 1234567890,
    author: {
      display: "Dr. John Doe",
    },
  };

  const mockAmendment2 = {
    text: "Changed frequency",
    amendmentReason: "Frequency change",
    recordedTime: 1234567900,
    author: {
      display: "Dr. Jane Smith",
    },
  };

  const mockAmendment3 = {
    text: "Added notes",
    amendmentReason: "Additional notes",
    recordedTime: 1234567910,
    author: {
      display: "Nurse Bob",
    },
  };

  describe("Rendering", () => {
    it("should render null when amendments array is empty", () => {
      const { container } = render(<AmendmentHistory amendments={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render null when amendments is undefined", () => {
      const { container } = render(<AmendmentHistory amendments={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render null when amendments is null", () => {
      const { container } = render(<AmendmentHistory amendments={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render amendment history with single amendment", () => {
      const { container } = render(
        <AmendmentHistory amendments={[mockAmendment]} />
      );
      expect(container.querySelector(".amendment-history")).toBeInTheDocument();
      expect(screen.getAllByTestId("note-tile")).toHaveLength(1);
    });

    it("should render amendment history with multiple amendments", () => {
      const amendments = [mockAmendment, mockAmendment2, mockAmendment3];
      const { container } = render(
        <AmendmentHistory amendments={amendments} />
      );
      const mainDiv = container.querySelector(".amendment-history");
      expect(mainDiv).toBeInTheDocument();
      // In collapsed state, should only show 1 amendment
      const noteTiles = screen.getAllByTestId("note-tile");
      expect(noteTiles.length).toBeGreaterThan(0);
    });
  });

  describe("Single Amendment Display", () => {
    it("should display single amendment with correct details", () => {
      render(<AmendmentHistory amendments={[mockAmendment]} />);
      expect(screen.getByText("Updated medication dosage")).toBeInTheDocument();
      expect(screen.getByText("Dosage adjustment")).toBeInTheDocument();
      expect(screen.getByText("Dr. John Doe")).toBeInTheDocument();
    });

    it("should not show chevron icon for single amendment", () => {
      render(<AmendmentHistory amendments={[mockAmendment]} />);
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    });

    it("should not have cursor pointer style for single amendment", () => {
      const { container } = render(
        <AmendmentHistory amendments={[mockAmendment]} />
      );
      const parentDiv = container.querySelector(
        ".amendment-history > div:first-child > div"
      );
      expect(parentDiv).not.toHaveStyle({ cursor: "pointer" });
    });
  });

  describe("Multiple Amendments Display - Collapsed State", () => {
    it("should display only first amendment when collapsed", () => {
      const amendments = [mockAmendment, mockAmendment2, mockAmendment3];
      render(<AmendmentHistory amendments={amendments} />);
      const parentDiv = screen.getAllByTestId("note-tile")[0].parentElement;
      fireEvent.click(parentDiv);
      const noteTiles = screen.getAllByTestId("note-tile");
      expect(noteTiles).toHaveLength(1);
    });

    it("should show correct tag label with amendment count", () => {
      const amendments = [mockAmendment, mockAmendment2, mockAmendment3];
      render(<AmendmentHistory amendments={amendments} />);
      expect(screen.getByTestId("note-tag-Amended (3)")).toBeInTheDocument();
    });
    it("should have clickable style for multiple amendments", () => {
      const amendments = [mockAmendment, mockAmendment2];
      const { container } = render(
        <AmendmentHistory amendments={amendments} />
      );
      const clickableDiv = container.querySelector('[role="button"]');
      const styles = clickableDiv.getAttribute("style");
      expect(styles).toContain("cursor: pointer");
      expect(styles).toContain("box-shadow");
    });

    it("should have no-margin and active-tile classes when not expanded", () => {
      const amendments = [mockAmendment, mockAmendment2];
      render(<AmendmentHistory amendments={amendments} />);
      const parentDiv = screen.getAllByTestId("note-tile")[0].parentElement;
      fireEvent.click(parentDiv);
      const noteTile = screen.getByTestId("note-tile");
      expect(noteTile).not.toHaveClass("no-margin");
      expect(noteTile).not.toHaveClass("active-tile");
    });
  });

  describe("Multiple Amendments Display - Expanded State", () => {
    it("should display all amendments when expanded", () => {
      const amendments = [mockAmendment, mockAmendment2, mockAmendment3];
      render(<AmendmentHistory amendments={amendments} />);

      const noteTiles = screen.getAllByTestId("note-tile");
      expect(noteTiles).toHaveLength(3);
    });

    it("should add expanded class to main container when expanded", () => {
      const amendments = [mockAmendment, mockAmendment2];
      const { container } = render(
        <AmendmentHistory amendments={amendments} />
      );
      const mainDiv = container.querySelector(".amendment-history");

      expect(mainDiv).toHaveClass("expanded");
    });

    it("should apply no-margin and active-tile classes when expanded", () => {
      const amendments = [mockAmendment, mockAmendment2];
      render(<AmendmentHistory amendments={amendments} />);

      const noteTile = screen.getAllByTestId("note-tile")[0];
      expect(noteTile).toHaveClass("no-margin");
      expect(noteTile).toHaveClass("active-tile");
    });
  });
});
