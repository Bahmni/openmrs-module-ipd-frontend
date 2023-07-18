import React from "react";
import PropTypes from "prop-types";
import "./TimeCell.scss";
import Image from "../SVGImage/SVGImage.jsx";

export default function TimeCell(props) {
  const { minutes, status, administrationInfo } = props;
  let left, right;
  if (+minutes < 30) {
    left = status;
  } else {
    right = status;
  }
  return (
    <div className={"time-cell"}>
      <div data-testid="left-icon">
        {left && <Image iconType={left} info={administrationInfo} />}
      </div>
      <div data-testid="right-icon">
        {right && <Image iconType={right} info={administrationInfo} />}
      </div>
    </div>
  );
}

TimeCell.propTypes = {
  minutes: PropTypes.string,
  status: PropTypes.string,
  administrationInfo: PropTypes.string,
};
