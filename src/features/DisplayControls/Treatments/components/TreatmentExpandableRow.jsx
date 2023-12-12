import React from "react";
import PropTypes from "prop-types";
import ExpandableRowData from "./ExpandableRowData";

const TreatmentExpandableRow = (props) => {
  const { data } = props;
  return <ExpandableRowData expandTreatmentData={data} />;
};

TreatmentExpandableRow.propTypes = {
  data: PropTypes.object,
};
export default TreatmentExpandableRow;
