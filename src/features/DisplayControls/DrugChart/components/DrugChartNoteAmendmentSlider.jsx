import React, { useContext, useState } from "react";
import { TextArea, Select, SelectItem } from "carbon-components-react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import { SaveAndCloseButtons } from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import { SliderContext } from "../../../../context/SliderContext";
import { IPDContext } from "../../../../context/IPDContext";
import { saveMedicationAmendmentNote } from "../utils/DrugChartUtils";
import { NoteTile } from "./NoteTile";

const DrugChartNoteAmendmentSlider = (props) => {
  const { hostData, hostApi } = props;
  const { config, provider } = useContext(IPDContext);
  const { setSliderContentModified } = useContext(SliderContext);

  const { drugChartNoteAmendment = {} } = config;
  const amendmentReasons = drugChartNoteAmendment.amendmentReasons || [
    "Incorrect Time",
    "Incorrect Dose",
    "Incorrect Unit",
    "Other (Please mention the reason in notes)"
  ];
  const amendedText = hostData.amendedNotes?.map(note => note.amendedText).join('\n\n');
  const amendedReason = hostData.amendedNotes?.map(note => note.amendedReason).join('\n\n');

  const [amendmentReason, setAmendmentReason] = useState("");
  const [amendmentNotes, setAmendmentNotes] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const updateSliderContentModified = (value) => {
    setSliderContentModified((prev) => {
      return {
        ...prev,
        drugChartNoteAmendment: value,
      };
    });
  };

  const handleReasonChange = (e) => {
    updateSliderContentModified(true);
    setAmendmentReason(e.target.value);
  };

  const handleNotesChange = (e) => {
    updateSliderContentModified(true);
    setAmendmentNotes(e.target.value);
  };

  const isFormValid = () => {
    return amendmentReason.trim() !== "" && amendmentNotes.trim() !== "";
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      return;
    }
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
      console.error("Error saving amendment:", error);
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
      id="AMENDMENT_NOTES_HEADER"
      defaultMessage="Amendment Note(s)"
    />
  );

  return (
    <I18nProvider>
      <SideBarPanel title={sliderTitle} closeSideBar={handleClose}>
        <div style={{ padding: "20px", paddingBottom: "120px" }}>
          {/* Amendment Reason Dropdown */}
          <div style={{ marginBottom: "16px" }}>
            <div>
              <div style={{ marginBottom: '8px', fontWeight: 600, color: '#161616' }}>
                {hostData.drugName}
              </div>
              <div style={{ marginBottom: '16px', color: '#525252' }}>
                {hostData.dosageInfo}
              </div>
              
              {amendedText && amendedReason && 
                <NoteTile
                  tagLabel="Amended"
                  tagType="blue"
                  scheduledTime={hostData.scheduledTime}
                  performerName={hostData.performerName}
                  noteText={amendedText}
                  noteReason={amendedReason}
                />
              }

              <NoteTile
                tagLabel="Original"
                tagType="gray"
                scheduledTime={hostData.scheduledTime}
                performerName={hostData.performerName}
                noteText={hostData.existingNotes}
              />
            </div>
            <Select
              id="amendment-reason-select"
              data-testid="amendment-reason-select"
              labelText={
                <span>
                  <FormattedMessage
                    id="AMENDMENT_REASON"
                    defaultMessage="Amendment Reason"
                  />
                  <span style={{ color: "red" }}> *</span>
                </span>
              }
              value={amendmentReason}
              onChange={handleReasonChange}
              invalid={!amendmentReason.trim() && isSaveDisabled}
              invalidText="Amendment Reason is required"
            >
              <SelectItem value="" text="Select a reason" />
              {amendmentReasons.map((reason) => (
                <SelectItem key={reason} value={reason} text={reason} />
              ))}
            </Select>
          </div>

          {/* Amendment Notes */}
          <div style={{ marginBottom: "16px" }}>
            <TextArea
              id="amendment-notes"
              data-testid="amendment-notes"
              type="text"
              rows={4}
              value={amendmentNotes}
              onChange={handleNotesChange}
              labelText={
                <span>
                  <FormattedMessage
                    id="AMENDMENT_NOTES"
                    defaultMessage="Amendment Notes"
                  />
                  <span style={{ color: "red" }}> *</span>
                </span>
              }
              placeholder="Enter amendment notes"
              invalid={!amendmentNotes.trim() && isSaveDisabled}
              invalidText="Amendment notes are required"
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

DrugChartNoteAmendmentSlider.propTypes = {
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
};

export default DrugChartNoteAmendmentSlider;
