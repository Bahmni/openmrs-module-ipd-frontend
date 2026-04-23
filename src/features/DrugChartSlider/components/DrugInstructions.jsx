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
          labelText={intl.formatMessage({
            id: "DRUG_CHART_MODAL_SCHEDULE_INSTRUCTIONS",
            defaultMessage: "Instruction",
          })}
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
          labelText={intl.formatMessage({
            id: "DRUG_CHART_MODAL_ADDITIONAL_INSTRUCTIONS",
            defaultMessage: "Additional Instruction",
          })}
          disabled
        />
      </div>
      {hostData?.drugOrder?.rate && (
        <div className="infusion-rate">
          <TextArea
            className="infusion-rate-field"
            readOnly
            rows={1}
            value={String(hostData.drugOrder.rate)}
            labelText={intl.formatMessage({
              id: "DRUG_CHART_MODAL_RATE",
              defaultMessage: "Rate (ml/hr)",
            })}
            disabled
          />
        </div>
      )}
      {hostData?.drugOrder?.additives && (
        <div className="additives">
          <TextArea
            className="additives-field"
            readOnly
            rows={1}
            value={hostData.drugOrder.additives}
            labelText={intl.formatMessage({
              id: "DRUG_CHART_MODAL_ADDITIVES",
              defaultMessage: "Additives",
            })}
            disabled
          />
        </div>
      )}
    </>
  );
};

DrugInstructions.propTypes = {
  hostData: PropTypes.shape({
    drugOrder: PropTypes.shape({
      instructions: PropTypes.string,
      additionalInstructions: PropTypes.string,
      rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      additives: PropTypes.string,
    }),
  }),
};
