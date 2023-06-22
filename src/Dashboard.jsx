import React from "react";
import PropTypes from "prop-types";

export default function Dashboard(props) {
  return (
    <>
      <h3>Hello, this is IPD</h3>
      <div>Patient UUID: {props.options?.patient?.uuid}</div>
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
