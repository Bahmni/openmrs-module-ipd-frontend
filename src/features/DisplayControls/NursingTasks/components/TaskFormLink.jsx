import React from "react";
import PropTypes from "prop-types";
import "../styles/TaskFormLink.scss";
import { CLINICAL_FORM_URL, TASK_COLORS } from "../../../../constants";

export default function TaskFormLink(props) {
  const {
    patientId,
    formUuid,
    children,
    onClick,
    className = "task-form-link",
  } = props;

  if (!patientId || !formUuid) {
    return children;
  }

  return (
    <a
      href={CLINICAL_FORM_URL(patientId, formUuid)}
      className={className}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      style={{ color: TASK_COLORS.LINK_BLUE }}
    >
      {children}
    </a>
  );
}

TaskFormLink.propTypes = {
  patientId: PropTypes.string,
  formUuid: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
