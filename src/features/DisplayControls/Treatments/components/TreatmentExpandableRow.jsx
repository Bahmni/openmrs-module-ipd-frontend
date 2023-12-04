import React from "react";
import PropTypes from "prop-types";
import ExpandableRowData from "./ExpandableRowData";

const TreatmentExpandableRow = (props) => {
  const { data } = props;
  console.log("TreatmentExpandableRow data", data);
  return <ExpandableRowData data={data} />;
};

TreatmentExpandableRow.propTypes = {
  data: PropTypes.object,
};
export default TreatmentExpandableRow;
