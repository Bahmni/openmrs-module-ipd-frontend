import { CloseLarge } from "@carbon/icons-react";
import { Button } from "carbon-components-react";
import PropTypes from "prop-types";
import React from "react";

import "./SideBarPanel.scss";

export default function SideBarPanel(props) {
  const { title, closeSideBar, children } = props;
  const closePanel = () => {
    console.log("Close");
  };

  return (
    <div className="side-bar-nav">
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
            onClick={closeSideBar ? closeSideBar() : closePanel}
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
  closeSideBar: PropTypes.func,
};
