import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "carbon-components-react";
import "../styles/TimeCell.scss";
import SVGIcon from "./SVGIcon.jsx";
import NoteIcon from "../../../../icons/note.svg";
import { ifMedicationNotesPresent } from "../utils/DrugChartUtils";

export default function TimeCell(props) {
  const { slotInfo = [], doHighlightCell, highlightedCell } = props;
  const left = [],
    right = [];
  slotInfo.map((slot) => {
    const { minutes } = slot;
    if (+minutes < 30) {
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
    <div className="time-cell">
      <div
        data-testid="left-icon"
        className={
          doHighlightCell && highlightedCell === "left" ? "highligtedCell" : ""
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
          doHighlightCell && highlightedCell === "right" ? "highligtedCell" : ""
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
};
