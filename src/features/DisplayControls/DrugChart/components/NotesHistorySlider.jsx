import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import { SliderContext } from "../../../../context/SliderContext";
import { IPDContext } from "../../../../context/IPDContext";
import { NoteTile } from "./NoteTile";

const NotesHistorySlider = (props) => {
  const { hostData, hostApi } = props;
  const amendedText = hostData.amendedNotes?.map(note => note.amendedText).join('\n\n');
  const amendedReason = hostData.amendedNotes?.map(note => note.amendedReason).join('\n\n');
  const acknowledgedText = hostData.amendedNotes?.map(note => note.approvalNotes).join('\n\n');
  
  // Extract the name of person who acknowledged
  const acknowledgedByName = hostData.amendedNotes?.find(
    note => note.approvalStatus === "APPROVED" && note.approvedBy
  )?.approvedBy?.display || hostData.performerName;

  const handleClose = () => {
    hostApi.onModalClose?.();
  };

  const sliderTitle = (
    <FormattedMessage
      id="NOTES_HISTORY_SLIDER_TITLE"
      defaultMessage="Notes History"
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
                  tagLabel="Acknowledged"
                  tagType="green"
                  scheduledTime={hostData.scheduledTime}
                  performerName={acknowledgedByName}
                  noteText={acknowledgedText}
              />

              <NoteTile
                  tagLabel="Amended"
                  tagType="blue"
                  scheduledTime={hostData.scheduledTime}
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

      </div>
      </div>
      </SideBarPanel>
    </I18nProvider>
  );
};

NotesHistorySlider.propTypes = {
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
};

export default NotesHistorySlider;
