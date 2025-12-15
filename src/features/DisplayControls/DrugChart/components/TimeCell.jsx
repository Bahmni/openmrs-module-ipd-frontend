import React from "react";
import PropTypes from "prop-types";
import { Tooltip, Button } from "carbon-components-react";
import "../styles/TimeCell.scss";
import SVGIcon from "./SVGIcon.jsx";
import NoteIcon from "../../../../icons/note.svg";
import AmendedIcon from "../../../../icons/acknowledge-pending.svg";
import AcknowledgedIcon from "../../../../icons/acknowledged.svg";
import { canAcknowledgeAmendment, ifMedicationNotesPresent } from "../utils/DrugChartUtils";
import { timeFormatFor24Hr } from "../../../../constants.js";
import moment from "moment";

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
    privileges
  } = props;
  const left = [],
    right = [];
  slotInfo.map((slot) => {
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
    if (hasAmendedNotes && (isNoteCreator(slot) || canAcknowledgeAmendment(privileges))) {
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

  const canAmendNotes = (slot) => {
    const isAcknowledged =
      slot?.originalSlot?.administrationSummary?.approvalStatus === "APPROVED";
    
    if (isAcknowledged) {
      return false;
    }

    return isNoteCreator(slot);
  };

  const renderTooltipContent = (notes, slot, amendedNotes = null) => {
    const showAmendButton = canAmendNotes(slot);
    const hasAmendedNotes = amendedNotes && amendedNotes.length > 0;
    
    const amendedText = hasAmendedNotes
      ? amendedNotes
          .filter(note => note?.amendedText)
          .map(note => note.amendedText)
          .join('\n\n')
      : null;

    const isAcknowledged =
            slot?.originalSlot?.administrationSummary?.approvalStatus ===
            "APPROVED";
            
    return (
      <div className="tooltip-content">
        {!isAcknowledged && (
          <div>
            {(isNoteCreator(slot)||canAcknowledgeAmendment(privileges)) ? (
               <div className="tooltip-notes">
                {amendedText || notes}
              </div>
            ) : (
              <div className="tooltip-notes">{notes}</div>
            )}
           
            {config?.drugChartNoteAmendment?.isAmendFeatureEnabled && showAmendButton && (
              <div className="tooltip-actions">
                <Button
                  kind="ghost"
                  size="sm"
                  className="no-focus-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slot.originalSlot) {
                      slot.originalSlot.clickAction = 'amend';
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
          <div style={{ marginTop: "12px" }}></div>
        )}
        {amendedText && !isAcknowledged && canAcknowledgeAmendment(privileges) && (
          <div>
            {!isNoteCreator(slot) && (
            <div className="tooltip-actions">
              <Button
                kind="ghost"
                size="sm"
                className="no-focus-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (slot.originalSlot) {
                    slot.originalSlot.clickAction = 'acknowledge';
                  }
                  onIconClick && onIconClick(slot);
                }}
                onBlur={(e) => e.target.blur()}
              >
                Acknowledge Note
              </Button>
            </div>
            )}
          </div>
        )}
        {isAcknowledged && (
          <div>
            <div className="tooltip-notes">
              <div>Amend Note:</div>
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
                    slot.originalSlot.clickAction = 'viewHistory';
                  }
                  onIconClick && onIconClick(slot);
                }}
                onBlur={(e) => e.target.blur()}
              >
                History
              </Button>
            </div>
          </div>
        )
        }
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
        {left.map((slot) => {
          const { status, administrationInfo, notes, minutes } = slot;
          const hasAmendedNotes =
            slot?.originalSlot?.administrationSummary?.hasAmendedNotes || false;
          const isAcknowledged =
            slot?.originalSlot?.administrationSummary?.approvalStatus ===
            "APPROVED";
          const amendedNotesResponse = slot?.originalSlot?.medicationAdministration?.amendedNotes;

          return (
            <div key={minutes}>
              <SVGIcon iconType={status} info={administrationInfo} />
              {ifMedicationNotesPresent(notes, status) && (
                <span data-testid="left-notes">
                  <Tooltip
                    autoOrientation={true}
                    renderIcon={() =>
                      getNoteIcon(hasAmendedNotes, isAcknowledged, slot)
                    }
                  >
                    {renderTooltipContent(notes, slot, amendedNotesResponse)}
                  </Tooltip>
                </span>
              )}
            </div>
          );
        })}
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
          {right.map((slot) => {
            const { status, administrationInfo, notes, minutes } = slot;
            const hasAmendedNotes =
              slot?.originalSlot?.administrationSummary?.hasAmendedNotes ||
              false;
            const isAcknowledged =
              slot?.originalSlot?.administrationSummary?.approvalStatus ===
              "APPROVED";
            const amendedNotesResponse = slot?.originalSlot?.medicationAdministration?.amendedNotes;

            return (
              <div key={minutes}>
                <SVGIcon iconType={status} info={administrationInfo} />
                {ifMedicationNotesPresent(notes, status) && (
                  <span data-testid="right-notes">
                    <Tooltip
                      autoOrientation={true}
                      renderIcon={() =>
                        getNoteIcon(hasAmendedNotes, isAcknowledged, slot)
                      }
                    >
                    {renderTooltipContent(notes, slot, amendedNotesResponse)}
                    </Tooltip>
                  </span>
                )}
              </div>
            );
          })}
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
  privileges: PropTypes.array
};
