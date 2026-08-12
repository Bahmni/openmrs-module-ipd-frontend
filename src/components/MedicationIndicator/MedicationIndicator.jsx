import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import "./MedicationIndicator.scss";

const MedicationIndicator = ({ type, count = 0 }) => {
  if (count <= 0) return null;

  return (
    <span
      className={`medication-indicator medication-indicator--${type}`}
      data-testid={`medication-indicator-${type}`}
    >
      {count}{" "}
      {type === "vdp" ? (
        <FormattedMessage
          id="MEDICATION_INDICATOR_VDP"
          defaultMessage="VDP"
        />
      ) : (
        <FormattedMessage
          id="MEDICATION_INDICATOR_REGULAR"
          defaultMessage="Regular"
        />
      )}
    </span>
  );
};

MedicationIndicator.propTypes = {
  type: PropTypes.oneOf(["regular", "vdp"]).isRequired,
  count: (props, propName) => {
    const value = props[propName];
    if (value != null && !Number.isInteger(value)) {
      return new Error(`${propName} must be an integer`);
    }
  },
};

export default MedicationIndicator;
