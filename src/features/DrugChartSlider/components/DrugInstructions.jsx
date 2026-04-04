/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { TextArea } from "carbon-components-react";
import PropTypes from "prop-types";

export const DrugInstructions = ({ hostData }) => {
  return (
    <>
      <div className="instructions">
        <TextArea
          className="instruction"
          readOnly
          type="text"
          rows={1}
          value={hostData?.drugOrder?.instructions}
          labelText="Instruction"
          disabled
        />
      </div>
      <div className="additional-instructions">
        <TextArea
          className="additional-instruction"
          readOnly
          type="text"
          rows={1}
          value={hostData?.drugOrder?.additionalInstructions}
          labelText="Additional Instruction"
          disabled
        />
      </div>
    </>
  );
};

DrugInstructions.propTypes = {
  hostData: PropTypes.shape({
    drugOrder: PropTypes.shape({
      instructions: PropTypes.string,
      additionalInstructions: PropTypes.string,
    }),
  }),
};
