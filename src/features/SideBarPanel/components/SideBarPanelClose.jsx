import React from "react";
import { Modal } from "carbon-components-react";
import PropTypes from "prop-types";

export const SideBarPanelClose = ({
  open,
  message,
  label,
  primaryButtonText,
  secondaryButtonText,
  onSubmit,
  onSecondarySubmit,
  onClose,
  children,
  primaryButtonDisabled,
}) => {
  return (
    <Modal
      style={{ zIndex: 10000 }}
      open={open}
      preventCloseOnClickOutside={true}
      onRequestSubmit={onSubmit}
      onSecondarySubmit={onSecondarySubmit}
      onRequestClose={onClose}
      danger
      modalHeading={message}
      modalLabel={label}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      primaryButtonDisabled={primaryButtonDisabled}
      children={children}
    >
      {children}
    </Modal>
  );
};

SideBarPanelClose.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  primaryButtonText: PropTypes.string.isRequired,
  secondaryButtonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSecondarySubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
