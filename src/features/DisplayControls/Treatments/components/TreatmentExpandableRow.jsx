import React from "react";
import PropTypes from "prop-types";
import MyTreeComponent from "./TreeComponent";

const TreatmentExpandableRow = (props) => {
  const { data } = props;
  return (
    <>
      <h6>Treatments</h6>
      <>
        <div>{data.instructions}</div>
        <div>{data.additionalInstructions}</div>
        <div>{data.recordedDate}</div>
        <div>{data.recordedTime}</div>
        <div>{data.provider}</div>
      </>
    </>
  );
};

TreatmentExpandableRow.propTypes = {
    data: PropTypes.object,
}
export default TreatmentExpandableRow;
