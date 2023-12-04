import React from "react";
// import "carbon-components/css/carbon-components.min.css";
import VerticalTabs from "../../../../components/VerticalTabs/VerticalTabs";

const ExpandableRowData = (props) => {
  const { data } = props;
  const verticalTabsData = {
    "Instructions": data.instructions,
    "Additional Instructions": data.additionalInstructions,
  }

  return <VerticalTabs tabData = {verticalTabsData}/>;
};

export default ExpandableRowData;
