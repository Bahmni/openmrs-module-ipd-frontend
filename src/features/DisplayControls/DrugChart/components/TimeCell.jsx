import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "carbon-components-react";
import "../styles/TimeCell.scss";
import SVGIcon from "./SVGIcon.jsx";
import NoteIcon from "../../../../icons/note.svg";
import { ifMedicationNotesPresent } from "../utils/DrugChartUtils";
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

  const icon = (
    <div className="note-icon-container">
      <NoteIcon />
    </div>
  );

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
          return (
            <div key={minutes}>
              <SVGIcon iconType={status} info={administrationInfo} />
              {ifMedicationNotesPresent(notes, status) && (
                <span data-testid="left-notes">
                  <Tooltip autoOrientation={true} renderIcon={() => icon}>
                    {notes}
                  </Tooltip>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div
        data-testid="right-icon"
        className={
          doHighlightCell && highlightedCell === "right"
            ? "highlightedCell"
            : isBlank
            ? "blank"
            : ""
        }
      >
        {right.map((slot) => {
          const { status, administrationInfo, notes, minutes } = slot;
          return (
            <div key={minutes}>
              <SVGIcon iconType={status} info={administrationInfo} />
              {ifMedicationNotesPresent(notes, status) && (
                <span data-testid="right-notes">
                  <Tooltip autoOrientation={true} renderIcon={() => icon}>
                    {notes}
                  </Tooltip>
                </span>
              )}
            </div>
          );
        })}
      </div>
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
};
