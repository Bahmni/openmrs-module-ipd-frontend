import React from "react";
import NoteIcon from "../../icons/note.svg";
import AmendedNoteIcon from "../../icons/acknowledge-pending.svg";
import AcknowledgedNoteIcon from "../../icons/acknowledged.svg";
import "./NoteLegend.scss";
import { FormattedMessage } from "react-intl";

export default function NoteLegend() {
  return (
    <div className={"note-legend"}>
      <div>
        <NoteIcon />
        <FormattedMessage id="NOTE" defaultMessage={"Note"} />
      </div>
      <div>
        <AmendedNoteIcon />
        <FormattedMessage id="AMENDED_NOTE" defaultMessage={"Amended Note"} />
      </div>
      <div>
        <AcknowledgedNoteIcon />
        <FormattedMessage
          id="ACKNOWLEDGED_NOTE"
          defaultMessage={"Acknowledged Note"}
        />
      </div>
    </div>
  );
}
