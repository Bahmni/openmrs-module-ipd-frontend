/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import { Tag } from "carbon-components-react";
import React, { useContext } from "react";
import PropTypes from "prop-types";
import { IPDContext } from "../../context/IPDContext";

const DisplayTags = (props) => {
  const { config } = useContext(IPDContext);
  const { drugOrder, size = "sm" } = props;
  const { medicationTags = {} } = config;

  if (
    drugOrder?.asNeeded &&
    medicationTags["asNeeded"] &&
    drugOrder?.frequency in medicationTags
  ) {
    return (
      <>
        <Tag type="blue" size={size}>
          {medicationTags.asNeeded}
        </Tag>
        <Tag type="blue" size={size}>
          {medicationTags[drugOrder?.frequency]}
        </Tag>
      </>
    );
  }
  if (drugOrder?.asNeeded && medicationTags["asNeeded"]) {
    return (
      <Tag type="blue" size={size}>
        {medicationTags.asNeeded}
      </Tag>
    );
  }
  if (drugOrder?.frequency in medicationTags) {
    return (
      <Tag type="blue" size={size}>
        {medicationTags[drugOrder?.frequency]}
      </Tag>
    );
  }
  if (drugOrder?.emergency && medicationTags["emergency"]) {
    return (
      <Tag type="blue" size={size}>
        {medicationTags.emergency}
      </Tag>
    );
  }
  return (
    <Tag type="blue" size={size}>
      {medicationTags.default}
    </Tag>
  );
};

export default DisplayTags;

DisplayTags.propTypes = {
  drugOrder: PropTypes.exact({
    asNeeded: PropTypes.bool,
    frequency: PropTypes.string,
    emergency: PropTypes.bool,
  }).isRequired,
  size: PropTypes.string,
};
