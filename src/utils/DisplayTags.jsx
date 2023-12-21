import { Tag } from "carbon-components-react";
import React from "react";

export const getTagForTheDrugOrder = (drugOrder, ipdConfig) => {
  if (ipdConfig !== undefined) {
    let medicationTags = ipdConfig.config.medicationTags;
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
  }
};
