import React from "react";
import propTypes from "prop-types";
import { Button } from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import "../styles/SaveAndCloseButtons.scss";

export const SaveAndCloseButtons = (props) => {
  const {
    onSave,
    onClose,
    isSaveDisabled,
    primaryButtonText = (
      <FormattedMessage id={"SAVE"} defaultMessage={"Save"} />
    ),
  } = props;
  return (
    <div className="footer">
      <Button
        kind="secondary"
        data-testid="cancel"
        onClick={onClose}
        className="cancel-button-slider"
      >
        <span>
          <FormattedMessage id={"CANCEL"} defaultMessage={"Cancel"} />
        </span>
      </Button>
      <Button
        kind="primary"
        onClick={onSave}
        disabled={isSaveDisabled}
        className="save-button-slider"
      >
        {primaryButtonText}
      </Button>
    </div>
  );
};

SaveAndCloseButtons.propTypes = {
  onSave: propTypes.func.isRequired,
  onClose: propTypes.func.isRequired,
  isSaveDisabled: propTypes.bool.isRequired,
  primaryButtonText: propTypes.string,
};
export default SaveAndCloseButtons;
