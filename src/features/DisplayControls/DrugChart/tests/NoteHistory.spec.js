import { render, screen } from "@testing-library/react";
import NoteHistory from "../components/NoteHistory";
import React from "react";

describe("Note History", () => {
  const hostdata = {
    noteInfo: {
      acknowledgementNotes: [
        {
          uuid: "20a19a42-3f5e-4cd8-ba4e-a92bd5431539",
          author: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Super Man",
          },
          recordedTime: 1770196392000,
          text: "Dosage 500mg 1",
          amendmentReason: "Incorrect Dosage 1",
          previousNoteUuid: "4fa0131e-2098-4251-b781-c3d315b562ab",
          acknowledgement: {
            taskUuid: "a2bc37a7-b71f-4420-a9e1-41dec335da10",
            approvedBy: {
              uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
              display: "Super Man",
            },
            remarks: "Time correction verified with nursing staff",
            acknowledgedTime: 1770196921000,
          },
        },
      ],
      original: {
        uuid: "9605d8fb-6d72-4419-b396-c63b1bd11d90",
        author: {
          uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
          display: "Super Man",
        },
        recordedTime: 1770196304000,
        text: "sd",
        amendmentReason: null,
        previousNoteUuid: null,
        acknowledgement: null,
      },
      newNote: null,
      amendedNotes: [
        {
          uuid: "4fa0131e-2098-4251-b781-c3d315b562ab",
          author: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Super Man",
          },
          recordedTime: 1770196692000,
          text: "Dosage 500mg 2",
          amendmentReason: "Incorrect Dosage",
          previousNoteUuid: "F78CFD52-CD7D-4097-B55A-0B9C5015ACDE",
          acknowledgement: null,
        },
        {
          uuid: "F78CFD52-CD7D-4097-B55A-0B9C5015ACDE",
          author: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Super Man",
          },
          recordedTime: 1770196493000,
          text: "Dosage 500mg two",
          amendmentReason: "Incorrect Dosage",
          previousNoteUuid: "9605d8fb-6d72-4419-b396-c63b1bd11d90",
          acknowledgement: null,
        },
        {
          uuid: "F78CFD52-CD7D-4097-B55A-0B9C5015ADEF",
          author: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Super Man",
          },
          recordedTime: 1770196393000,
          text: "Dosage 500mg one",
          amendmentReason: "Incorrect Dosage",
          previousNoteUuid: "F78CFD52-CD7D-4097-B55A-0B9C5015ACDE",
          acknowledgement: null,
        },
      ],
    },
  };
  it("should render notes", () => {
    render(<NoteHistory hostData={hostdata} />);
    expect(screen.getByText("Acknowledged")).toBeInTheDocument();
    expect(screen.getByText("Amended (3)")).toBeInTheDocument();
    expect(screen.getByText("Original")).toBeInTheDocument();
  });
});
