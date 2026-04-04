/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import VerticalTabs from "../../../../components/VerticalTabs/VerticalTabs";
import PropTypes from "prop-types";

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
