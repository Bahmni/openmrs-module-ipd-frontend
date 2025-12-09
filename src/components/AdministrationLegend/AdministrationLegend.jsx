import React from "react";
import AdministeredIcon from "../../icons/completed.svg";

import AdministeredLateIcon from "../../icons/administered-late.svg";
import LateIcon from "../../icons/late.svg";
import NotAdministeredIcon from "../../icons/missed.svg";
import PendingIcon from "../../icons/pending.svg";
import StoppedIcon from "../../icons/stopped.svg";
import NoteIcon from "../../icons/note.svg";
import AmendedNoteIcon from "../../icons/acknowledge-pending.svg";
import AcknowledgedNoteIcon from "../../icons/acknowledged.svg";
import "./AdministrationLegend.scss";
import { FormattedMessage } from "react-intl";

export default function AdministrationLegend() {
  return (
    <div className={"drug-chart-legend"}>
      <div>
        <PendingIcon />
        <FormattedMessage id="PENDING" defaultMessage={"Pending"} />
      </div>
      <div>
        <LateIcon />
        <FormattedMessage id="LATE" defaultMessage={"Late"} />
      </div>
      <div>
        <AdministeredIcon />
        <FormattedMessage id="COMPLETED" defaultMessage={"Completed"} />
      </div>
      <div>
        <AdministeredLateIcon />
        <FormattedMessage
          id="ADMINISTERED_LATE"
          defaultMessage={"Administered Late"}
        />
      </div>
      <div>
        <NotAdministeredIcon />
        <FormattedMessage
          id="NOT_ADMINISTERED"
          defaultMessage={"Not Administered"}
        />
      </div>
      <div>
        <StoppedIcon />
        <FormattedMessage id="STOPPED" defaultMessage={"Stopped"} />
      </div>
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
