import { CloseLarge } from "@carbon/icons-react";
import { Button } from "carbon-components-react";
import PropTypes from "prop-types";
import React from "react";

import "../styles/SideBarPanel.scss";

export default function SideBarPanel(props) {
  const { title, closeSideBar, isClinicalDashboard, children } = props;

  const sideBarPanelClass = isClinicalDashboard
    ? "clinical-side-bar-nav"
    : "ipd-side-bar-nav";
  return (
    <div className={sideBarPanelClass}>
      <div className="side-bar-header">
        <div>
          <h1>{title}</h1>
        </div>
        <div className="close-icon">
          <Button
            renderIcon={CloseLarge}
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
  isClinicalDashboard: PropTypes.bool.isRequired,
};
