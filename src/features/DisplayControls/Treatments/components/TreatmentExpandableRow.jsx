/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


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
