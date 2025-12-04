import React from "react";
import { Tile, Tag } from "carbon-components-react";
import PropTypes from "prop-types";
import "../styles/NoteTile.scss";

export const NoteTile = ({
  tagLabel,
  tagType,
  scheduledTime,
  performerName,
  noteText,
  className = ""
}) => {
  return (
    <Tile className={`note-readonly-tile ${className}`}>
      {tagLabel && 
        <div>
          <Tag 
            type={tagType === "custom-orange-tag" ? "custom-orange-tag" : tagType} 
            size="sm"
            className={tagType === "custom-orange-tag" ? "custom-orange-tag" : ""}
          >
            {tagLabel}
          </Tag>
        </div>
      }
      

      {(scheduledTime || performerName) && (
        <div className="sub-header-tile">
          {scheduledTime && <span className="scheduled-time">{scheduledTime}</span>}
          {performerName && <span className="performer-name">{performerName}</span>}
        </div>
      )}

      {noteText && (
        <p className="note-text">
          <strong>Note:</strong> {noteText}
        </p>
      )}
    </Tile>
  );
};

NoteTile.propTypes = {
  tagLabel: PropTypes.string,
  tagType: PropTypes.oneOf(["red", "magenta", "purple", "blue", "cyan", "teal", "green", "gray", "cool-gray", "warm-gray", "high-contrast","custom-orange-tag"]),
  scheduledTime: PropTypes.string,
  performerName: PropTypes.string,
  noteText: PropTypes.string,
  className: PropTypes.string
};