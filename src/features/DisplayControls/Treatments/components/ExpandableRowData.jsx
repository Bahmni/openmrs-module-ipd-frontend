import React from "react";
import VerticalTabs from "../../../../components/VerticalTabs/VerticalTabs";
import PropTypes from "prop-types";
import VariableDoseStagesTable from "./VariableDoseStagesTable";

const ExpandableRowData = (props) => {
  const { expandTreatmentData } = props;

  if (expandTreatmentData.isVariableDose) {
    return (
      <VariableDoseStagesTable
        fhirDosages={expandTreatmentData.fhirDosages || []}
        effectiveStartDate={expandTreatmentData.effectiveStartDate}
      />
    );
  }

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

  if (expandTreatmentData.rate) {
    verticalTabsData["Rate"] = {
      data: `${expandTreatmentData.rate} ml/hr`,
      additionalData: [
        fetchAdditionalData(expandTreatmentData.recordedDateTime),
      ],
    };
  }

  if (expandTreatmentData.additives) {
    verticalTabsData["Additives"] = {
      data: expandTreatmentData.additives,
      additionalData: [
        fetchAdditionalData(expandTreatmentData.recordedDateTime),
      ],
    };
  }

  if (expandTreatmentData.approverNotes) {
    verticalTabsData["Acknowledgement Note"] = {
      data: expandTreatmentData.approverNotes,
      additionalData: [expandTreatmentData.approverAdditionalData],
    };
  }

  if (expandTreatmentData.stopReason) {
    verticalTabsData["Stopped Notes"] = {
      data: expandTreatmentData.stopReason,
      additionalData: [expandTreatmentData.stopperAdditionalData],
    };
  }

  return <VerticalTabs tabData={verticalTabsData} />;
};

ExpandableRowData.propTypes = {
  expandTreatmentData: PropTypes.object,
};

export default ExpandableRowData;
