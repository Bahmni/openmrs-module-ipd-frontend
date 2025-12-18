import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import DrugChartNoteAmendment from "./DrugChartNoteAmendment";
import DrugChartNoteAcknowledgement from "./DrugChartNoteAcknowledgement";
import NoteHistory from "./NoteHistory";
import SaveAndCloseButtons from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import { IPDContext } from "../../../../context/IPDContext";
import { SliderContext } from "../../../../context/SliderContext";
import {
  saveMedicationAmendmentNote,
  saveMedicationAcknowledgementNote,
} from "../utils/DrugChartUtils";
import "../styles/DrugChartSlider.scss";

import { sliderTypes } from "../../../../constants";

const DrugChartSlider = (props) => {
  const { hostData, hostApi, sliderType } = props;
  const { config, provider, privileges } = useContext(IPDContext) || {};
  const { setSliderContentModified } = useContext(SliderContext) || {};
  const { drugChartNoteAmendment = {} } = config || {};
  const amendmentReasons = drugChartNoteAmendment.amendmentReasons || [];

  const [amendmentReason, setAmendmentReason] = useState("");
  const [amendmentNotes, setAmendmentNotes] = useState("");

  const [acknowledgementNotes, setAcknowledgementNotes] = useState("");
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const updateSliderContentModified = (type) => {
    setSliderContentModified?.((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const handleAmendmentReasonChange = (e) => {
    updateSliderContentModified("drugChartNoteAmendment");
    setAmendmentReason(e.target.value);
  };
  const handleAmendmentNotesChange = (e) => {
    updateSliderContentModified("drugChartNoteAmendment");
    setAmendmentNotes(e.target.value);
  };
  const handleAcknowledgementNotesChange = (e) => {
    updateSliderContentModified("drugChartNoteAcknowledgement");
    setAcknowledgementNotes(e.target.value);
  };
  const handleAcknowledgedToggle = (checked) => {
    updateSliderContentModified("drugChartNoteAcknowledgement");
    setIsAcknowledged(checked);
  };

  const isAmendmentFormValid = () =>
    amendmentReason.trim() !== "" && amendmentNotes.trim() !== "";
  const isAcknowledgementFormValid = () =>
    acknowledgementNotes.trim() !== "" && isAcknowledged;

  const handleSave = async () => {
    if (sliderType === sliderTypes.AMENDMENT) {
      if (!isAmendmentFormValid()) return;
      setIsSaveDisabled(true);
      const amendmentData = {
        noteUuid: hostData?.medicationAdministrationNoteUUID,
        amendedReason: amendmentReason,
        amendedText: amendmentNotes,
        amendedByUuid: provider?.uuid,
      };
      try {
        await saveMedicationAmendmentNote(amendmentData);
        setIsSaveDisabled(false);
        hostApi.onModalSave?.();
      } catch (error) {
        setIsSaveDisabled(false);
      }
    } else if (sliderType === sliderTypes.ACKNOWLEDGEMENT) {
      if (!isAcknowledgementFormValid()) return;
      setIsSaveDisabled(true);
      const acknowledgementData = {
        noteUuid: hostData?.medicationAdministrationNoteUUID,
        acknowledgementNotes,
        acknowledgedByUuid: provider?.uuid,
      };
      try {
        await saveMedicationAcknowledgementNote(acknowledgementData);
        setIsSaveDisabled(false);
        hostApi.onModalSave?.();
      } catch (error) {
        setIsSaveDisabled(false);
      }
    }
  };

  const handleCancel = () => {
    hostApi.onModalCancel?.();
  };
  const handleClose = () => {
    hostApi.onModalClose?.();
  };

  return (
    <I18nProvider>
      <SideBarPanel title={sliderTitle()} closeSideBar={handleClose}>
        <div className="drug-chart-slider">
          <div className="drug-chart-slider__header">
            <div>
              <div className="drug-chart-slider__drug-name">
                {hostData.drugName}
              </div>
              <div className="drug-chart-slider__dosage-info">
                {hostData.dosageInfo}
              </div>

              <NoteHistory hostData={hostData} />
            </div>
          </div>
          {sliderType === sliderTypes.AMENDMENT && (
            <DrugChartNoteAmendment
              amendmentReasons={amendmentReasons}
              amendmentReason={amendmentReason}
              amendmentNotes={amendmentNotes}
              isSaveDisabled={isSaveDisabled}
              onReasonChange={handleAmendmentReasonChange}
              onNotesChange={handleAmendmentNotesChange}
            />
          )}
          {sliderType === sliderTypes.ACKNOWLEDGEMENT && (
            <DrugChartNoteAcknowledgement
              privileges={privileges}
              acknowledgementNotes={acknowledgementNotes}
              isAcknowledged={isAcknowledged}
              isSaveDisabled={isSaveDisabled}
              onNotesChange={handleAcknowledgementNotesChange}
              onToggleChange={handleAcknowledgedToggle}
            />
          )}
        </div>
        {(sliderType === sliderTypes.AMENDMENT ||
          sliderType === sliderTypes.ACKNOWLEDGEMENT) && (
          <SaveAndCloseButtons
            onSave={handleSave}
            onClose={handleCancel}
            isSaveDisabled={
              isSaveDisabled ||
              (sliderType === sliderTypes.AMENDMENT
                ? !isAmendmentFormValid()
                : !isAcknowledgementFormValid())
            }
          />
        )}
      </SideBarPanel>
    </I18nProvider>
  );

  function sliderTitle() {
    const titles = {
      amendment: {
        id: "AMENDMENT_NOTES_HEADER",
        defaultMessage: "Amendment Note(s)",
      },
      acknowledgement: {
        id: "ACKNOWLEDGEMENT_NOTES_HEADER",
        defaultMessage: "Acknowledge Amend Note",
      },
      history: {
        id: "NOTES_HISTORY_SLIDER_TITLE",
        defaultMessage: "Notes History",
      },
    };
    const title = titles[sliderType];
    return title ? (
      <FormattedMessage id={title.id} defaultMessage={title.defaultMessage} />
    ) : null;
  }
};

DrugChartSlider.propTypes = {
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
  sliderType: PropTypes.string.isRequired,
};

export default DrugChartSlider;
