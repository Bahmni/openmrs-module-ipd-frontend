import React from "react";
import PropTypes from "prop-types";
import { Tooltip, Button, TooltipDefinition } from "carbon-components-react";
import "../styles/TimeCell.scss";
import SVGIcon from "./SVGIcon.jsx";
import NoteIcon from "../../../../icons/note.svg";
import AmendedIcon from "../../../../icons/acknowledge-pending.svg";
import AcknowledgedIcon from "../../../../icons/acknowledged.svg";
import DocumentAdd from "../../../../icons/document-add.svg";
import {
  canAcknowledgeAmendment,
  ifMedicationNotesPresent,
} from "../utils/DrugChartUtils";
import { timeFormatFor24Hr } from "../../../../constants.js";
import moment from "moment";
import { FormattedMessage } from "react-intl";

export default function TimeCell(props) {
  const {
    slotInfo = [],
    startTime = "",
    endTime = "",
    doHighlightCell,
    highlightedCell,
    isBlank,
    isWholeHourStartTime,
    onIconClick,
    currentProviderUuid,
    config = {},
    privileges,
  } = props;
  const left = [],
    right = [];
  slotInfo.forEach((slot) => {
    const { time } = slot;
    const momentTime = moment(time, timeFormatFor24Hr);
    let diffStartTime = momentTime.diff(startTime);
    let diffEndTime = endTime.diff(momentTime);

    if (endTime.isBefore(startTime)) {
      const midnight = moment("00:00", timeFormatFor24Hr);
      if (momentTime.isAfter(midnight)) {
        diffStartTime = midnight.diff(startTime) + momentTime.diff(midnight);
      } else {
        diffEndTime = momentTime.diff(midnight) + midnight.diff(endTime);
      }
    }
    if (diffStartTime < diffEndTime) {
      left.push(slot);
    } else {
      right.push(slot);
    }
  });

  const isNoteCreator = (slot) => {
    if (
      !currentProviderUuid ||
      !slot?.originalSlot?.medicationAdministration?.providers
    ) {
      return false;
    }
    const noteAuthor =
      slot.originalSlot?.medicationAdministration?.providers.find(
        (provider) => provider.function === "Performer"
      );
    return noteAuthor?.provider?.uuid === currentProviderUuid;
  };

  const getNoteIcon = (hasAmendedNotes, isAcknowledged, slot) => {
    if (isAcknowledged) {
      return (
        <div className="note-icon-container">
          <AcknowledgedIcon />
        </div>
      );
    }
    if (hasAmendedNotes || isNewNotes(slot)) {
      return (
        <div className="note-icon-container">
          <AmendedIcon />
        </div>
      );
    }
    return (
      <div className="note-icon-container">
        <NoteIcon />
      </div>
    );
  };

  const isNewNotes = (slot) => {
    const { noteInfo = {} } = slot.originalSlot.administrationSummary || {};
    return !!(
      (noteInfo.acknowledgementNotes || []).length === 0 &&
      (noteInfo.amendedNotes || []).length === 0 &&
      noteInfo.newNote &&
      !noteInfo.original
    );
  };

  const renderTooltipContent = (notes, slot, amendedNotes = null) => {
    const { administrationSummary = {} } = slot.originalSlot;
    const noteInfo = administrationSummary?.noteInfo;
    const isAcknowledged = administrationSummary?.approvalStatus === "APPROVED";
    const showAmendButton = !isAcknowledged && !administrationSummary?.isMissed;
    const hasAmendedNotes = amendedNotes && amendedNotes.length > 0;

    let amendedText;
    if (hasAmendedNotes) {
      amendedText = amendedNotes[0]?.text;
    } else {
      amendedText = noteInfo?.newNote?.text;
    }

    return (
      <div className="tooltip-content">
        {!isAcknowledged && (
          <div>
            {isNoteCreator(slot) || canAcknowledgeAmendment(privileges) ? (
              <div className="tooltip-notes">{amendedText || notes}</div>
            ) : (
              <div className="tooltip-notes">{notes}</div>
            )}

            {config?.drugChartNoteAmendment?.isAmendFeatureEnabled &&
              showAmendButton && (
                <div className="tooltip-actions">
                  <Button
                    kind="ghost"
                    size="sm"
                    className="no-focus-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (slot.originalSlot) {
                        slot.originalSlot.clickAction = "amend";
                      }
                      onIconClick && onIconClick(slot);
                    }}
                    onBlur={(e) => e.target.blur()}
                  >
                    Amend Note
                  </Button>
                </div>
              )}
          </div>
        )}

        {notes && amendedText && !isAcknowledged && (
          <div style={{ marginTop: "12px" }} />
        )}

        {(amendedText || isNewNotes(slot)) &&
          !isAcknowledged &&
          canAcknowledgeAmendment(privileges) && (
            <div>
              <div className="tooltip-actions">
                <Button
                  kind="ghost"
                  size="sm"
                  className="no-focus-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slot.originalSlot) {
                      slot.originalSlot.clickAction = "acknowledge";
                    }
                    onIconClick && onIconClick(slot);
                  }}
                  onBlur={(e) => e.target.blur()}
                >
                  Acknowledge Note
                </Button>
              </div>
            </div>
          )}

        {isAcknowledged && (
          <div>
            <div className="tooltip-notes">
              <div>Amended Note:</div>
              <div style={{ marginTop: "8px" }}>{amendedText}</div>
            </div>
            <div className="tooltip-actions">
              <Button
                kind="ghost"
                size="sm"
                className="no-focus-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (slot.originalSlot) {
                    slot.originalSlot.clickAction = "viewHistory";
                  }
                  onIconClick && onIconClick(slot);
                }}
                onBlur={(e) => e.target.blur()}
              >
                History
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSlot = (slot, position) => {
    const { status, administrationInfo, notes, minutes } = slot;
    const summary = slot?.originalSlot?.administrationSummary || {};
    const noteInfo = summary?.noteInfo || {};
    const hasAmendedNotes = summary?.hasAmendedNotes || false;
    const isAcknowledged = summary?.approvalStatus === "APPROVED";
    const amendedNotesResponse = noteInfo?.amendedNotes;

    const content = ifMedicationNotesPresent(notes, status) ? (
      <Tooltip
        autoOrientation={true}
        renderIcon={() => getNoteIcon(hasAmendedNotes, isAcknowledged, slot)}
      >
        {renderTooltipContent(notes, slot, amendedNotesResponse)}
      </Tooltip>
    ) : (
      (status === "Administered-Late" || status === "Administered") && (
        <TooltipDefinition
          tooltipText={
            <div style={{ color: "#fff", fontSize: "14px", fontWeight: 400 }}>
              <FormattedMessage id="ADD_NOTES" defaultMessage="Add Notes" />
            </div>
          }
          direction="top"
        >
          <div
            className="note-icon-container"
            onClick={(e) => {
              e.stopPropagation();
              onIconClick && onIconClick(slot);
            }}
          >
            <DocumentAdd />
          </div>
        </TooltipDefinition>
      )
    );

    return (
      <div key={minutes}>
        <SVGIcon iconType={status} info={administrationInfo} />
        {content ? (
          <span
            data-testid={
              ifMedicationNotesPresent(notes, status)
                ? `${position}-notes`
                : `add-${position}-note`
            }
          >
            {content}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div
      className={
        isWholeHourStartTime
          ? "time-cell-for-whole-hour"
          : "time-cell-for-half-hour"
      }
    >
      <div
        data-testid="left-icon"
        className={
          doHighlightCell && highlightedCell === "left" ? "highlightedCell" : ""
        }
      >
        {left.map((slot) => renderSlot(slot, "left"))}
      </div>

      {!isBlank ? (
        <div
          data-testid="right-icon"
          className={
            doHighlightCell && highlightedCell === "right"
              ? "highlightedCell"
              : ""
          }
        >
          {right.map((slot) => renderSlot(slot, "right"))}
        </div>
      ) : (
        <div className="blank"></div>
      )}
    </div>
  );
}

TimeCell.propTypes = {
  slotInfo: PropTypes.array,
  doHighlightCell: PropTypes.bool,
  highlightedCell: PropTypes.string,
  startTime: PropTypes.object,
  endTime: PropTypes.object,
  isBlank: PropTypes.bool,
  isWholeHourStartTime: PropTypes.bool,
  onIconClick: PropTypes.func,
  currentProviderUuid: PropTypes.string,
  config: PropTypes.object,
  privileges: PropTypes.array,
};
