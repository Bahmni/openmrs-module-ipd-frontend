import React from "react";
import PropTypes from "prop-types";
import "./Dashboard.scss";
import { TestComp } from "bahmni-carbon-ui";
import { Button } from "carbon-components-react";

export default function Dashboard(props) {
  return (
    <>
      <h3>Hello, this is IPD</h3>
      <div>Patient UUID: {props.options?.patient?.uuid}</div>
      <p className="sub-text">Right, some changes</p>
      <hr />
      <h4>A component from Bahmni Carbon UI</h4>
      <TestComp />

      <h5>And now directly using carbon components</h5>
      <Button kind="primary">Final button</Button>
      <p>This is an additional change</p>
    </>
  );
}

Dashboard.propTypes = {
  options: PropTypes.shape({
    patient: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
