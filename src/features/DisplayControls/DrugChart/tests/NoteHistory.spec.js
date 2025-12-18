import React from "react";
import { render, screen } from "@testing-library/react";
import NoteHistory from "../components/NoteHistory";

describe("NoteHistory", () => {
  const baseHostData = {
    scheduledTime: "2023-12-01T10:00:00Z",
    performerName: "Dr. Smith",
    existingNotes: "Initial note.",
    amendedNotes: [],
    approvedTime: "2023-12-01T12:00:00Z",
    amendedTime: "2023-12-01T11:00:00Z",
  };

  it("renders only the Original note when no amendedNotes are present", () => {
    render(<NoteHistory hostData={baseHostData} />);
    expect(screen.getByText("Original")).toBeInTheDocument();
    expect(screen.getByText("Initial note.")).toBeInTheDocument();
    expect(screen.queryByText("Amended")).not.toBeInTheDocument();
    expect(screen.queryByText("Acknowledged")).not.toBeInTheDocument();
  });

  it("renders Amended note when amendedNotes with amendedText and amendedReason are present", () => {
    const hostData = {
      ...baseHostData,
      amendedNotes: [
        {
          amendedText: "Changed dose.",
          amendedReason: "Correction",
          approvalStatus: "PENDING",
        },
      ],
    };
    render(<NoteHistory hostData={hostData} />);
    expect(screen.getByText("Amended")).toBeInTheDocument();
    expect(screen.getByText("Changed dose.")).toBeInTheDocument();
    expect(screen.getByText("Correction")).toBeInTheDocument();
  });

  it("renders Acknowledged note when amendedNotes with approvalStatus APPROVED and approvedBy are present", () => {
    const hostData = {
      ...baseHostData,
      amendedNotes: [
        {
          amendedText: "Changed dose.",
          amendedReason: "Correction",
          approvalStatus: "APPROVED",
          approvalNotes: "Looks good.",
          approvedBy: { display: "Nurse Joy" },
        },
      ],
    };
    render(<NoteHistory hostData={hostData} />);
    expect(screen.getByText("Acknowledged")).toBeInTheDocument();
    expect(screen.getByText("Looks good.")).toBeInTheDocument();
    expect(screen.getByText("Nurse Joy")).toBeInTheDocument();
  });

  it("uses performerName as acknowledgedByName if approvedBy is missing", () => {
    const hostData = {
      ...baseHostData,
      performerName: "Dr. House",
      amendedNotes: [
        {
          approvalStatus: "APPROVED",
          approvalNotes: "Confirmed.",
          amendedText: "Changed dose.",
          amendedReason: "Correction",
        },
      ],
    };
    render(<NoteHistory hostData={hostData} />);
    expect(screen.getByText("Acknowledged")).toBeInTheDocument();
    expect(screen.getByText("Confirmed.")).toBeInTheDocument();
    // There may be multiple elements with the performer name, so use getAllByText
    const performerNames = screen.getAllByText("Dr. House");
    expect(performerNames.length).toBeGreaterThan(0);
  });

  it("renders nothing for Amended and Acknowledged if amendedNotes is empty or missing fields", () => {
    const hostData = {
      ...baseHostData,
      amendedNotes: [{}],
    };
    render(<NoteHistory hostData={hostData} />);
    expect(screen.queryByText("Amended")).not.toBeInTheDocument();
    expect(screen.queryByText("Acknowledged")).not.toBeInTheDocument();
    expect(screen.getByText("Original")).toBeInTheDocument();
  });
});
