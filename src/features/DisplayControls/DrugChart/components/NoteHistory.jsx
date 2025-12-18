import React from "react";
import PropTypes from "prop-types";
import { NoteTile } from "./NoteTile";
import { extractNameFromDisplay } from "../utils/DrugChartUtils";

const NoteHistory = ({ hostData }) => {
  const amendedText = hostData.amendedNotes
    ?.map((note) => note.amendedText)
    .join("\n\n");
  const amendedReason = hostData.amendedNotes
    ?.map((note) => note.amendedReason)
    .join("\n\n");
  const amendedBy = hostData.amendedNotes
    ?.map((note) => note.amendedBy?.display || hostData.performerName)
    .join("\n\n");
  const acknowledgedText = hostData.amendedNotes
    ?.map((note) => note.approvalNotes)
    .join("\n\n");
  const acknowledgedByName =
    hostData.amendedNotes?.find(
      (note) => note.approvalStatus === "APPROVED" && note.approvedBy
    )?.approvedBy?.display || hostData.performerName;

  return (
    <>
      {acknowledgedText && acknowledgedByName && (
        <NoteTile
          tagLabel="Acknowledged"
          tagType="green"
          scheduledTime={hostData.approvedTime}
          performerName={extractNameFromDisplay(acknowledgedByName)}
          noteText={acknowledgedText}
        />
      )}
      {amendedText && amendedReason && (
        <NoteTile
          tagLabel="Amended"
          tagType="blue"
          scheduledTime={hostData.amendedTime}
          performerName={extractNameFromDisplay(amendedBy)}
          noteText={amendedText}
          noteReason={amendedReason}
        />
      )}
      <NoteTile
        tagLabel="Original"
        tagType="gray"
        scheduledTime={hostData.scheduledTime}
        performerName={hostData.performerName}
        noteText={hostData.existingNotes}
      />
    </>
  );
};

NoteHistory.propTypes = {
  hostData: PropTypes.object.isRequired,
};

export default NoteHistory;
