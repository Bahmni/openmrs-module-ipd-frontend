import React from "react";
import VerticalTabs from "../../../../components/VerticalTabs/VerticalTabs";

const ExpandableRowData = (props) => {
  const { expandTreatmentData } = props;

  const fetchAdditionalData = (additionalData) => {
    return additionalData
      ? expandTreatmentData.provider +
          " | " +
          expandTreatmentData.recordedDate +
          " | " +
          expandTreatmentData.recordedTime
      : null;
  };

  const verticalTabsData = {};

  if (expandTreatmentData.instructions && expandTreatmentData.instructions !== "") {
    verticalTabsData["Instructions"] = {
      data: expandTreatmentData.instructions,
      additionalData: [fetchAdditionalData(expandTreatmentData.instructions)],
    };
  }

  if (expandTreatmentData.additionalInstructions && expandTreatmentData.additionalInstructions !== "") {
    verticalTabsData["Additional Instructions"] = {
      data: expandTreatmentData.additionalInstructions,
      additionalData: [
        fetchAdditionalData(expandTreatmentData.additionalInstructions),
      ],
    };
  }

  if (expandTreatmentData.approverNotes && expandTreatmentData.approverNotes !== "") {
    verticalTabsData["Acknowledgement Note"] = {
      data: expandTreatmentData.approverNotes,
      additionalData: [expandTreatmentData.approverAdditionalData]
    };
  }

  return <VerticalTabs tabData={verticalTabsData} />;
};

export default ExpandableRowData;
