import React from "react";
import PropTypes from "prop-types";
import { NoteTile } from "./NoteTile";
import AmendmentHistory from "../../../../components/AmendmentHistory/AmendmentHistory";

const NoteHistory = ({ hostData }) => {
  const {
    acknowledgementNotes: ack,
    original,
    newNote,
    amendedNotes: amended,
  } = hostData.noteInfo;
  return (
    <>
      {ack.length > 0 && (
        <NoteTile
          tagLabel="Acknowledged"
          tagType="green"
          scheduledTime={ack[0].recordedTime}
          performerName={ack[0].author.display}
          noteText={ack[0].text}
        />
      )}
      {amended.length > 0 && <AmendmentHistory amendments={amended} />}
      {original && (
        <NoteTile
          tagLabel={"Original"}
          tagType="gray"
          scheduledTime={original.recordedTime}
          performerName={original.author.display}
          noteText={original.text}
        />
      )}
      {newNote && (
        <NoteTile
          tagLabel={"New"}
          tagType="gray"
          scheduledTime={newNote.recordedTime}
          performerName={newNote.author.display}
          noteText={newNote.text}
          noteReason={newNote.amendmentReason}
        />
      )}
    </>
  );
};

NoteHistory.propTypes = {
  hostData: PropTypes.object.isRequired,
};

export default NoteHistory;
