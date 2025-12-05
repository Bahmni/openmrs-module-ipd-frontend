import React, { useContext, useState } from "react";
import { TextArea, Select, SelectItem, Toggle } from "carbon-components-react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import "../styles/DrugChartNoteAcknowledgementSlider.scss";
import { SaveAndCloseButtons } from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import { SliderContext } from "../../../../context/SliderContext";
import { IPDContext } from "../../../../context/IPDContext";
import { timeFormatFor24Hr, timeFormatFor12Hr, timeText24, timeText12 } from "../../../../constants";
import { saveMedicationAcknowledgementNote } from "../utils/DrugChartUtils";
import { NoteTile } from "./NoteTile";
import moment from "moment";

const DrugChartNoteAcknowledgementSlider = (props) => {
  const { hostData, hostApi } = props;
  const { config, handleAuditEvent, provider } = useContext(IPDContext);
  const { setSliderContentModified } = useContext(SliderContext);

  const { enable24HourTime = false } = config;

  const [acknowledgementNotes, setAcknowledgementNotes] = useState("");
  const [acknowledgementDate, setAcknowledgementDate] = useState(new Date());
  const [acknowledgementTime, setAcknowledgementTime] = useState(
    moment().format(enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr)
  );
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

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

  const handleDateChange = (date) => {
    updateSliderContentModified(true);
    setAcknowledgementDate(date);
  };

  const handleTimeChange = (time) => {
    updateSliderContentModified(true);
    setAcknowledgementTime(time);
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

    const timeFormat = enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr;
        const dateTimeString = moment(acknowledgementDate).format("YYYY-MM-DD") + " " + acknowledgementTime;
        const dateTime = moment(dateTimeString, "YYYY-MM-DD " + timeFormat);
        const epochTime = dateTime.utc().unix();

    const acknowledgementData = {
      noteUuid: hostData?.medicationAdministrationNoteUUID,
      acknowledgementNotes: acknowledgementNotes,
      acknowledgedByUuid: provider?.uuid,
      acknowledgedDateTime: epochTime,
    };

    try {
      await saveMedicationAcknowledgementNote(acknowledgementData);

      //handleAuditEvent("ACKNOWLEDGE_MEDICATION_TASK");

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
      defaultMessage="Acknowledge Amendment"
    />
  );

  return (
    <I18nProvider>
      <SideBarPanel title={sliderTitle} closeSideBar={handleClose}>
         <div style={{ padding: "20px", paddingBottom: "120px" }}>
          <div style={{ marginBottom: "16px" }}>
             <div>
              <div style={{ marginBottom: '8px', fontWeight: 600, color: '#161616' }}>
                {hostData.drugName}
              </div>
              <div style={{ marginBottom: '16px', color: '#525252' }}>
                {hostData.dosageInfo}
              </div>
              
              <NoteTile
                tagLabel="Amended"
                tagType="custom-orange-tag"
                scheduledTime={hostData.scheduledTime}
                performerName={hostData.performerName}
                noteText={hostData.amendedNotes?.map(note => note.amendedText).join('\n\n')}
              />

              <NoteTile
                tagLabel="Original"
                tagType="gray"
                scheduledTime={hostData.scheduledTime}
                performerName={hostData.performerName}
                noteText={hostData.existingNotes}
              />
            </div>

          <Toggle
            data-testId="acknowledge-toggle"
            size={"sm"}
            labelA="Acknowledge"
            labelB="Acknowledge"
            toggled={isAcknowledged}
            onToggle={handleToggleChange}
          />
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