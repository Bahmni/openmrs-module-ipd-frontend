import React from "react";
import PropTypes from "prop-types";
import "./Dashboard.scss";

export default function Dashboard(props) {
  return (
    <>
      <h3>Hello, this is IPD</h3>
      <div>Patient UUID: {props.options?.patient?.uuid}</div>
      <p className="sub-text">Right, some changes</p>
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
