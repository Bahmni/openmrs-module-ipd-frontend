/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import PropTypes from "prop-types";
import "../styles/DiagnosisExpandableRow.scss";

const DiagnosisExpandableRow = (props) => {
  const { data } = props;
  return (
    <>
      <h6 className="notes-heading">Notes</h6>
      <div className="notes-content">
        {data.diagnosisNotes ? data.diagnosisNotes : "No notes available"}
      </div>
      {data.diagnosisNotes !== "" && (
        <div className="notes-provider-details">
          {data?.provider} | {data.diagnosisTime}
        </div>
      )}
    </>
  );
};

DiagnosisExpandableRow.propTypes = {
  data: PropTypes.object,
};
export default DiagnosisExpandableRow;
