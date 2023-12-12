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
