import React from "react";
import { TextArea } from "carbon-components-react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

export const DrugInstructions = ({ hostData }) => {
  const intl = useIntl();
  return (
    <>
      <div className="instructions">
        <TextArea
          className="instruction"
          readOnly
          type="text"
          rows={1}
          value={hostData?.drugOrder?.instructions}
          labelText={intl.formatMessage({ id: "DRUG_CHART_MODAL_SCHEDULE_INSTRUCTIONS", defaultMessage: "Instruction" })}
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
          labelText={intl.formatMessage({ id: "DRUG_CHART_MODAL_ADDITIONAL_INSTRUCTIONS", defaultMessage: "Additional Instruction" })}
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