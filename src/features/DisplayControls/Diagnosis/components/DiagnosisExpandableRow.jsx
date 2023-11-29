import React from "react";
import PropTypes from "prop-types";

const DiagnosisExpandableRow = (props) => {
    const { row, additionalData } = props;
  return (
    <>
      <h6>Notes</h6>
      {additionalData.map((data) => {
        if (data.id === row.id) {
          return <div>{data.diagnosisNotes}</div>;
        }
      })}
    </>
  );
};

DiagnosisExpandableRow.propTypes = {
  row: PropTypes.object,
  additionalData: PropTypes.array,
};
export default DiagnosisExpandableRow;
