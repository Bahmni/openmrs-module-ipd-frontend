import React from "react";
// import "carbon-components/css/carbon-components.min.css";
import VerticalTabs from "../../../../components/VerticalTabs/VerticalTabs";

const ExpandableRowData = (props) => {
  const { data } = props;
  console.log("ExpandableRowData data", data);
  const verticalTabsData = {
    Instructions: {
      data: data.instructions,
      additionalData: [
        data.provider + " | " + data.recordedDate + " | " + data.recordedTime,
      ],
    },
    "Additional Instructions": {
      data: data.additionalInstructions,
      additionalData: [
        data.additionalInstructions
          ? data.provider +
            " | " +
            data.recordedDate +
            " | " +
            data.recordedTime
          : null,
      ],
    },
  };

  return <VerticalTabs tabData={verticalTabsData} />;
};

export default ExpandableRowData;
