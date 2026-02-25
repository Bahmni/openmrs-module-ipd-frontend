/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import { Close } from "@carbon/icons-react/next";
import { Button } from "carbon-components-react";
import PropTypes from "prop-types";
import React from "react";

import "../styles/SideBarPanel.scss";

export default function SideBarPanel(props) {
  const { title, closeSideBar, children } = props;

  return (
    <div className="side-bar-nav">
      <div className="side-bar-header">
        <div>{title}</div>
        <div className="close-icon">
          <Button
            renderIcon={Close}
            hasIconOnly
            iconDescription="Close"
            kind="ghost"
            onClick={closeSideBar}
          />
        </div>
      </div>
      <div className="side-bar-children">{children}</div>
    </div>
  );
}

SideBarPanel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  closeSideBar: PropTypes.func.isRequired,
};
