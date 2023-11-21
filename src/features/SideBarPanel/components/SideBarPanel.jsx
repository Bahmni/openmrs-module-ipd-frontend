import { Close24 } from "@carbon/icons-react";
import PropTypes from "prop-types";
import React from "react";

import "../styles/SideBarPanel.scss";

export default function SideBarPanel(props) {
  const { title, closeSideBar, children } = props;

  return (
    <div className="side-bar-nav">
      <div className="side-bar-header">
        <div>{title}</div>
        <div className="close-icon" onClick={closeSideBar}>
          <Close24 />
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
