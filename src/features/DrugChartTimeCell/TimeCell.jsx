import React from "react";
import PropTypes from "prop-types";
import "./TimeCell.scss";
import Image from "../SVGImage/SVGImage.jsx";

export default function TimeCell(props) {
  const { minutes, status } = props;
  let left, right;
  if (+minutes < 30) {
    left = status;
  } else {
    right = status;
  }
  return (
    <div className={"time-cell"}>
      <div>{left && <Image iconType={left} />}</div>
      <div>{right && <Image iconType={right} />}</div>
    </div>
  );
}

TimeCell.propTypes = {
  minutes: PropTypes.string,
  status: PropTypes.string,
};
