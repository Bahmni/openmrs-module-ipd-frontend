import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import "./AmendmentHistory.scss";
import { ChevronDown20, ChevronUp20 } from "@carbon/icons-react";
import { NoteTile } from "../../features/DisplayControls/DrugChart/components/NoteTile";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

const AmendmentHistory = ({ amendments = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef(null);
  const intl = useIntl();

  const totalAmendments = amendments?.length || 0;
  const displayAmendments = !totalAmendments
    ? []
    : isExpanded
    ? amendments
    : [amendments[0]];

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerHeight(isExpanded ? containerRef.current.scrollHeight : 0);
    }
  }, [isExpanded, displayAmendments.length]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!amendments || amendments.length === 0) {
    return null;
  }

  const ParentTile = () => {
    let icon,
      className = "";
    if (totalAmendments > 1) {
      icon = isExpanded ? ChevronUp20 : ChevronDown20;
      className = isExpanded ? "no-margin active-tile" : "";
    }
    return (
      <div
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        style={
          totalAmendments > 1
            ? {
                cursor: "pointer",
                boxShadow: "0px 4px 4px 0px #00000026",
              }
            : {}
        }
      >
        <NoteTile
          noteReason={displayAmendments[0].amendmentReason}
          noteText={displayAmendments[0].text}
          tagLabel={`${intl.formatMessage({
            id: "AMENDED",
            defaultMessage: "Amended",
          })} (${totalAmendments})`}
          performerName={displayAmendments[0].author.display}
          scheduledTime={displayAmendments[0].recordedTime}
          Icon={icon}
          tagType={"blue"}
          className={className}
        />
      </div>
    );
  };
  return (
    <div className={`amendment-history ${isExpanded ? "expanded" : ""}`}>
      <ParentTile />
      <div
        className="amendments-container"
        ref={containerRef}
        style={{ maxHeight: `${containerHeight}px` }}
      >
        {displayAmendments.slice(1).map((amendment, index) => (
          <Fragment key={index}>
            <div className="connector" />
            <NoteTile
              noteReason={amendment.amendmentReason}
              noteText={amendment.text}
              performerName={amendment.author.display}
              scheduledTime={amendment.recordedTime}
              className={
                index === displayAmendments.length - 2 ? "" : "no-margin"
              }
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
AmendmentHistory.propTypes = {
  amendments: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      amendmentReason: PropTypes.string,
      recordedTime: PropTypes.number.isRequired,
    })
  ),
};
export default AmendmentHistory;
