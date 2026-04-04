/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import PropTypes from "prop-types";
import "./TimeCell.scss";
import SVGIcon from "../SVGIcon/SVGIcon.jsx";

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
