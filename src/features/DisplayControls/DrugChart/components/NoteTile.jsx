import React from "react";
import { Tile, Tag } from "carbon-components-react";
import PropTypes from "prop-types";
import "../styles/NoteTile.scss";
import moment from "moment";

export const NoteTile = ({
  tagLabel,
  tagType,
  scheduledTime,
  performerName,
  noteText,
  className = "",
  noteReason,
  Icon = () => <></>,
}) => {
  return (
    <Tile className={`note-readonly-tile ${className}`} data-testid="note-tile">
      {tagLabel && (
        <div className="note-tag flex-centered">
          <Tag type={tagType} size="sm" data-testid={`note-tag-${tagLabel}`}>
            {tagLabel}
          </Tag>
          <Icon />
        </div>
      )}
      {(scheduledTime || performerName) && (
        <div className="sub-header-tile">
          {scheduledTime && (
            <span className="scheduled-time">
              {moment(scheduledTime).format("DD MMM YYYY | HH:mm")}
            </span>
          )}
          {performerName && (
            <span className="performer-name">{performerName}</span>
          )}
        </div>
      )}

      {noteReason && (
        <p className="note-text">
          <strong>Reason:</strong> {noteReason}
        </p>
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
  tagType: PropTypes.oneOf(["blue", "gray", "green"]),
  scheduledTime: PropTypes.string,
  performerName: PropTypes.string,
  noteText: PropTypes.string,
  className: PropTypes.string,
  noteReason: PropTypes.string,
  Icon: PropTypes.element,
};
