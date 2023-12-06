import React from "react";
import VerticalTabs from "../../../../components/VerticalTabs/VerticalTabs";

const ExpandableRowData = (props) => {
  const { expandTreatmentData } = props;

  const verticalTabsData = {
    Instructions: {
      data: expandTreatmentData.instructions,
      additionalData: [
        expandTreatmentData.instructions
          ? expandTreatmentData.provider +
            " | " +
            expandTreatmentData.recordedDate +
            " | " +
            expandTreatmentData.recordedTime
          : null,
      ],
    },
    "Additional Instructions": {
      data: expandTreatmentData.additionalInstructions,
      additionalData: [
        expandTreatmentData.additionalInstructions
          ? expandTreatmentData.provider +
            " | " +
            expandTreatmentData.recordedDate +
            " | " +
            expandTreatmentData.recordedTime
          : null,
      ],
    },
  };

  return <VerticalTabs tabData={verticalTabsData} />;
};

export default ExpandableRowData;
