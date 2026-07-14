import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const PatientPhotoModal = ({ src, onClose }) => {
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const trigger = document.activeElement;
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (trigger) {
        trigger.focus();
      }
    };
  }, []);

  return (
    <div
      className="patient-photo-overlay"
      data-testid="photo-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged patient photo"
      onClick={onClose}
    >
      <div
        className="patient-photo-overlay-inner"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="patient-photo-overlay-close"
          aria-label="Close photo preview"
          onClick={onClose}
        >
          ✕
        </button>
        <img
          className="patient-photo-modal-image"
          src={src}
          alt="Enlarged patient photo"
        />
      </div>
    </div>
  );
};

PatientPhotoModal.propTypes = {
  src: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PatientPhotoModal;
