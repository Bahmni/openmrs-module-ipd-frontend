import React from "react";
import VerticalTabs from "../../../../components/VerticalTabs/VerticalTabs";

const ExpandableRowData = (props) => {
  const { expandTreatmentData } = props;

  const fetchAdditionalData = (additionalData) => {
    return additionalData
      ? expandTreatmentData.provider +
          " | " +
          expandTreatmentData.recordedDateTime
      : null;
  };

  const verticalTabsData = {};

  if (expandTreatmentData.instructions) {
    verticalTabsData["Instructions"] = {
      data: expandTreatmentData.instructions,
      additionalData: [fetchAdditionalData(expandTreatmentData.instructions)],
    };
  }

  if (expandTreatmentData.additionalInstructions) {
    verticalTabsData["Additional Instructions"] = {
      data: expandTreatmentData.additionalInstructions,
      additionalData: [
        fetchAdditionalData(expandTreatmentData.additionalInstructions),
      ],
    };
  }

  if (expandTreatmentData.approverNotes) {
    verticalTabsData["Acknowledgement Note"] = {
      data: expandTreatmentData.approverNotes,
      additionalData: [expandTreatmentData.approverAdditionalData]
    };
  }

  if (expandTreatmentData.stopReason) {
    verticalTabsData["Stopped Notes"] = {
      data: expandTreatmentData.stopReason,
      additionalData: [expandTreatmentData.stopperAdditionalData]
    };
  }

  return <VerticalTabs tabData={verticalTabsData} />;
};

export default ExpandableRowData;
