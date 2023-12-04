import React from "react";
import PropTypes from "prop-types";
import "../styles/DiagnosisExpandableRow.scss";

const DiagnosisExpandableRow = (props) => {
  const { data } = props;

  return (
    <>
      <h6 className="notes-heading">Notes</h6>
      <div className="notes-content">{data?.diagnosisNotes}</div>
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
