import { useContext, useState } from "react";
import { TextArea, Select, SelectItem } from "carbon-components-react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import "../styles/DrugChartNoteAmendmentSlider.scss";
import { SaveAndCloseButtons } from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import { SliderContext } from "../../../../context/SliderContext";
import { IPDContext } from "../../../../context/IPDContext";
import { timeFormatFor24Hr, timeFormatFor12Hr, timeText24, timeText12 } from "../../../../constants";
import { saveMedicationAmendmentNote } from "../utils/DrugChartUtils";
import { NoteTile } from "./NoteTile";
import moment from "moment";

const DrugChartNoteAmendmentSlider = (props) => {
  const { hostData, hostApi } = props;
  const { config, handleAuditEvent } = useContext(IPDContext);
  const { setSliderContentModified } = useContext(SliderContext);

  // Get amendment reasons from config or use defaults
  const { drugChartNoteAmendment = {} } = config;
  
  const amendmentReasons = drugChartNoteAmendment.amendmentReasons || [
    "Incorrect Time",
    "Incorrect Dose",
    "Incorrect Unit",
    "Other123"
  ];

  const { enable24HourTime = false } = config;

  const [amendmentReason, setAmendmentReason] = useState("");
  const [amendmentNotes, setAmendmentNotes] = useState("");
  const [amendmentDate, setAmendmentDate] = useState(new Date());
  const [amendmentTime, setAmendmentTime] = useState(
    moment().format(enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr)
  );
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

  const handleDateChange = (date) => {
    updateSliderContentModified(true);
    setAmendmentDate(date);
  };

  const handleTimeChange = (time) => {
    updateSliderContentModified(true);
    setAmendmentTime(time);
  };

  const isFormValid = () => {
    return amendmentReason.trim() !== "" && amendmentNotes.trim() !== "";
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsSaveDisabled(true);

    // Combine date and time into epoch timestamp in seconds
    const timeFormat = enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr;
    const dateTimeString = moment(amendmentDate).format("YYYY-MM-DD") + " " + amendmentTime;
    const dateTime = moment(dateTimeString, "YYYY-MM-DD " + timeFormat);
    const epochTime = dateTime.utc().unix();

    const amendmentData = {
      noteUuid: hostData?.medicationAdministrationNoteUUID,
      amendedReason: amendmentReason,
      amendedText: amendmentNotes,
      amendedByUuid: hostData?.slot?.medicationAdministration?.providers?.[0]?.uuid,
      amendedDateTime: epochTime,
    };

    try {
      await saveMedicationAmendmentNote(amendmentData);

      // handleAuditEvent("AMEND_MEDICATION_TASK");

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
