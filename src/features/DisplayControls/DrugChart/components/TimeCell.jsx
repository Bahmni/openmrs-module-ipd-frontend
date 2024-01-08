import React from "react";
import PropTypes from "prop-types";
import "../styles/TimeCell.scss";
import SVGIcon from "./SVGIcon.jsx";
import { TooltipCarbon } from "bahmni-carbon-ui";
import NoteIcon from "../../../../icons/note.svg";
import { ifMedicationNotesPresent } from "../utils/DrugChartUtils";

export default function TimeCell(props) {
  const {
    minutes,
    status,
    administrationInfo,
    medicationNotes,
    doHighlightCell,
    highlightedCell,
  } = props;
  let left, right;

  if (+minutes < 30) {
    left = status;
  } else {
    right = status;
  }

  const icon = (
    <div className="note-icon-container">
      <NoteIcon />
    </div>
  );

  return (
    <div className="time-cell">
      <div
        data-testid="left-icon"
        className={
          doHighlightCell && highlightedCell === "left" ? "highligtedCell" : ""
        }
      >
        {left && <SVGIcon iconType={left} info={administrationInfo} />}
        {ifMedicationNotesPresent(medicationNotes, left) && (
          <span data-testid="left-notes">
            <TooltipCarbon icon={() => icon} content={medicationNotes} />
          </span>
        )}
      </div>
      <div
        data-testid="right-icon"
        className={
          doHighlightCell && highlightedCell === "right" ? "highligtedCell" : ""
        }
      >
        {right && <SVGIcon iconType={right} info={administrationInfo} />}
        {ifMedicationNotesPresent(medicationNotes, right) && (
          <span data-testid="right-notes">
            <TooltipCarbon icon={() => icon} content={medicationNotes} />
          </span>
        )}
      </div>
    </div>
  );
}

TimeCell.propTypes = {
  minutes: PropTypes.string,
  status: PropTypes.string,
  administrationInfo: PropTypes.string,
  doHighlightCell: PropTypes.bool,
  highlightedCell: PropTypes.string,
  medicationNotes: PropTypes.string,
};
