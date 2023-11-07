import React from "react";
import { Grid, Row, Column } from "carbon-components-react";
import { CloseLarge } from "@carbon/icons-react";
import PropTypes from "prop-types";

import "./SideBarPanel.scss";

export default function SideBarPanel(props) {
  const { title, children } = props;
  console.log("Inside SideBarPanel");
  const closePanel = () => {
    console.log("close panel");
  };

  return (
    <div className="side-bar-nav">
      <Grid>
        <Row>
          <Column>
            <div>
              <h1>{title}</h1>
            </div>
          </Column>
          <Column className="close-column">
            <button className="close-button" onClick={closePanel}>
              <CloseLarge size={32} aria-label="Close" className="close-icon" />
            </button>
          </Column>
        </Row>
        {children}
      </Grid>
    </div>
  );
}

SideBarPanel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
