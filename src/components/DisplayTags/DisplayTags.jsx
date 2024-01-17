import { Tag } from "carbon-components-react";
import React from "react";
import data from "../../utils/config.json";
import PropTypes from "prop-types";

const DisplayTags = (props) => {
  const { drugOrder } = props;
  const { config: { medicationTags = {} } = {} } = data;

  if (
    drugOrder?.asNeeded &&
    medicationTags["asNeeded"] &&
    drugOrder?.frequency in medicationTags
  ) {
    return (
      <>
        <Tag type="blue">{medicationTags.asNeeded}</Tag>
        <Tag type="blue">{medicationTags[drugOrder?.frequency]}</Tag>
      </>
    );
  }
  if (drugOrder?.asNeeded && medicationTags["asNeeded"]) {
    return <Tag type="blue">{medicationTags.asNeeded}</Tag>;
  }
  if (drugOrder?.frequency in medicationTags) {
    return <Tag type="blue">{medicationTags[drugOrder?.frequency]}</Tag>;
  }
  if (drugOrder?.emergency && medicationTags["emergency"]) {
    return <Tag type="blue">{medicationTags.emergency}</Tag>;
  }
  return <Tag type="blue">{medicationTags.default}</Tag>;
};

export default DisplayTags;

DisplayTags.propTypes = {
  drugOrder: PropTypes.exact({
    asNeeded: PropTypes.bool,
    frequency: PropTypes.string,
  }).isRequired,
};
