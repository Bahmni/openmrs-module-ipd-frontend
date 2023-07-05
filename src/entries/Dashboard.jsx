import React from "react";
import PropTypes from "prop-types";
import "./Dashboard.scss";
import { TestComp } from "bahmni-carbon-ui";
import { Button } from "carbon-components-react";

/**
 * NOTE: Currently there is nothing in this dashboard, all debugging items
 */
export default function Dashboard(props) {
  const { hostData, hostApi } = props;
  return (
    <>
      <h3>IPD Care and Monitoring Dashboard</h3>
      <div>
        <h4>DEBUG: Data received from host</h4>
        <p>
          <b className="sub-text">Patient UUID:</b> {hostData?.patient?.uuid}
        </p>
      </div>
      <hr />

      <div>
        <h4>
          DEBUG: following is a content switcher from{" "}
          <code>bahmni-carbon-ui</code> library
        </h4>
        <TestComp />
      </div>
      <hr />

      <div>
        <h4>
          DEBUG: following is a component from{" "}
          <code>carbon-components-react</code> library
        </h4>
        <Button
          kind="primary"
          onClick={() => hostApi.onConfirm?.("event-from-ipd")}
        >
          Click to send event to host appliation
        </Button>
      </div>
    </>
  );
}

Dashboard.propTypes = {
  hostData: PropTypes.shape({
    patient: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  hostApi: PropTypes.shape({
    onConfirm: PropTypes.func,
  }),
};
