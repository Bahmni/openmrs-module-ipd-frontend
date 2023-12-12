import React from "react";
import PropTypes from "prop-types";
import "../styles/TimeCell.scss";
import SVGIcon from "./SVGIcon.jsx";

export default function TimeCell(props) {
  const { minutes, status, administrationInfo } = props;
  let left, right;
  if (+minutes < 30) {
    left = status;
  } else {
    right = status;
  }
  return (
    <div className="time-cell">
      <div data-testid="left-icon">
        {left && <SVGIcon iconType={left} info={administrationInfo} />}
      </div>
      <div data-testid="right-icon">
        {right && <SVGIcon iconType={right} info={administrationInfo} />}
      </div>
    </div>
  );
}

TimeCell.propTypes = {
  minutes: PropTypes.string,
  status: PropTypes.string,
  administrationInfo: PropTypes.string,
};
