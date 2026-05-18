import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { AlignBoxMiddleLeft24 } from "@carbon/icons-react";
import "./DraftIndicator.scss";
import DraftOverlay from "./DraftOverlay";
import { fetchDraftsForProvider } from "../../services/draftService";
import { getProviderUuid } from "../../utils/CommonUtils";
import { CLINICAL_OBSERVATION_URL } from "../../constants";
import { I18nProvider } from "../../features/i18n/I18nProvider";

export const DraftIndicator = () => {
  const [formDrafts, setFormDrafts] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const providerUuid = await getProviderUuid();
        if (!providerUuid) return;
        const drafts = await fetchDraftsForProvider(providerUuid);
        setFormDrafts(drafts);
      } catch (error) {
        console.error("Failed to initialize draft indicator", error);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedOutsideButton =
        buttonRef.current && !buttonRef.current.contains(event.target);
      const clickedOutsideOverlay =
        overlayRef.current && !overlayRef.current.contains(event.target);
      if (clickedOutsideButton && clickedOutsideOverlay) {
        setIsOverlayOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const toggleOverlay = () => {
    if (!isOverlayOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setOverlayPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOverlayOpen((previous) => !previous);
  };

  const closeOverlay = () => setIsOverlayOpen(false);

  const handleDraftClick = (draft) => {
    window.location.href = CLINICAL_OBSERVATION_URL(draft.patientUuid);
    setIsOverlayOpen(false);
  };

  const hasDrafts = formDrafts.length > 0;

  return (
    <I18nProvider>
      <div className="ipd-draft-indicator">
        <button
          ref={buttonRef}
          className="ipd-draft-indicator__button"
          onClick={toggleOverlay}
          aria-label="View observation drafts"
          aria-expanded={isOverlayOpen}
        >
          <span className="ipd-draft-indicator__icon-wrapper">
            <AlignBoxMiddleLeft24 className="ipd-draft-indicator__icon" />
            {hasDrafts && (
              <span
                className="ipd-draft-indicator__red-dot"
                aria-hidden="true"
              />
            )}
          </span>
        </button>
        {isOverlayOpen &&
          ReactDOM.createPortal(
            <div
              ref={overlayRef}
              className="ipd-draft-indicator__overlay-wrapper"
              style={{ top: overlayPosition.top, right: overlayPosition.right }}
            >
              <DraftOverlay
                formDrafts={formDrafts}
                onClose={closeOverlay}
                onSelect={handleDraftClick}
              />
            </div>,
            document.body
          )}
      </div>
    </I18nProvider>
  );
};

export default DraftIndicator;
