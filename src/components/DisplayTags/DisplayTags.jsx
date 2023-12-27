import { Tag } from "carbon-components-react";
import React from "react";
import data from "../../utils/config.json";

const DisplayTags = ({ drugOrder }) => {
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
  return <Tag type="blue">{medicationTags.default}</Tag>;
};
export default DisplayTags;

