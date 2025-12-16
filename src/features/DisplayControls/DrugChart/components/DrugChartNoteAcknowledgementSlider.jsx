import React, { useContext, useState } from "react";
import { TextArea, Toggle } from "carbon-components-react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import { SaveAndCloseButtons } from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import { SliderContext } from "../../../../context/SliderContext";
import { IPDContext } from "../../../../context/IPDContext";
import {
  canAcknowledgeAmendment,
  saveMedicationAcknowledgementNote,
} from "../utils/DrugChartUtils";
import { NoteTile } from "./NoteTile";

const DrugChartNoteAcknowledgementSlider = (props) => {
  const { hostData, hostApi } = props;
  const { provider, privileges } = useContext(IPDContext);
  const { setSliderContentModified } = useContext(SliderContext);
  const [acknowledgementNotes, setAcknowledgementNotes] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const amendedText = hostData.amendedNotes
    ?.map((note) => note.amendedText)
    .join("\n\n");
  const amendedReason = hostData.amendedNotes
    ?.map((note) => note.amendedReason)
    .join("\n\n");

  const updateSliderContentModified = (value) => {
    setSliderContentModified((prev) => {
      return {
        ...prev,
        drugChartNoteAcknowledgement: value,
      };
    });
  };

  const handleNotesChange = (e) => {
    updateSliderContentModified(true);
    setAcknowledgementNotes(e.target.value);
  };

  const handleToggleChange = (checked) => {
    updateSliderContentModified(true);
    setIsAcknowledged(checked);
  };

  const isFormValid = () => {
    return acknowledgementNotes.trim() !== "" && isAcknowledged;
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsSaveDisabled(true);

    const acknowledgementData = {
      noteUuid: hostData?.medicationAdministrationNoteUUID,
      acknowledgementNotes: acknowledgementNotes,
      acknowledgedByUuid: provider?.uuid,
    };

    try {
      await saveMedicationAcknowledgementNote(acknowledgementData);
      setIsSaveDisabled(false);
      hostApi.onModalSave?.();
    } catch (error) {
      console.error("Error saving acknowledgement:", error);
      setIsSaveDisabled(false);
    }
  };

  const handleCancel = () => {
    hostApi.onModalCancel?.();
  };

  const handleClose = () => {
    hostApi.onModalClose?.();
  };

  const sliderTitle = (
    <FormattedMessage
      id="ACKNOWLEDGEMENT_NOTES_HEADER"
      defaultMessage="Acknowledge Amend Note"
    />
  );

  return (
    <I18nProvider>
      <SideBarPanel title={sliderTitle} closeSideBar={handleClose}>
        <div style={{ padding: "20px", paddingBottom: "120px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div>
              <div
                style={{
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#161616",
                }}
              >
                {hostData.drugName}
              </div>
              <div style={{ marginBottom: "16px", color: "#525252" }}>
                {hostData.dosageInfo}
              </div>

              <NoteTile
                tagLabel="Amended"
                tagType="blue"
                scheduledTime={hostData.amendedTime}
                performerName={hostData.performerName}
                noteText={amendedText}
                noteReason={amendedReason}
              />

              <NoteTile
                tagLabel="Original"
                tagType="gray"
                scheduledTime={hostData.scheduledTime}
                performerName={hostData.performerName}
                noteText={hostData.existingNotes}
              />
            </div>

            {canAcknowledgeAmendment(privileges) && (
              <Toggle
                data-testId="acknowledge-toggle"
                size={"sm"}
                labelA="Acknowledge"
                labelB="Acknowledge"
                toggled={isAcknowledged}
                onToggle={handleToggleChange}
              />
            )}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <TextArea
              id="acknowledgement-notes"
              data-testid="acknowledgement-notes"
              type="text"
              rows={4}
              value={acknowledgementNotes}
              onChange={handleNotesChange}
              labelText={
                <span>
                  <FormattedMessage
                    id="ACKNOWLEDGEMENT_NOTES"
                    defaultMessage="Acknowledgement Notes"
                  />
                  <span style={{ color: "red" }}> *</span>
                </span>
              }
              placeholder="Enter Notes"
              invalid={!acknowledgementNotes.trim() && isSaveDisabled}
              invalidText="Acknowledgement notes are required"
            />
          </div>
        </div>

        <SaveAndCloseButtons
          onSave={handleSave}
          onClose={handleCancel}
          isSaveDisabled={isSaveDisabled || !isFormValid()}
        />
      </SideBarPanel>
    </I18nProvider>
  );
};

DrugChartNoteAcknowledgementSlider.propTypes = {
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
};

export default DrugChartNoteAcknowledgementSlider;
