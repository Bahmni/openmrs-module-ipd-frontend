import React from "react";
import PropTypes from "prop-types";

const DiagnosisExpandableRow = (props) => {
  const { data } = props;
  console.log("data insideeeee", data);
  return (
    <>
      <h6>Notes</h6>
      <div>{data?.diagnosisNotes}</div>
    </>
  );
};

DiagnosisExpandableRow.propTypes = {
  data: PropTypes.object,
}
export default DiagnosisExpandableRow;
