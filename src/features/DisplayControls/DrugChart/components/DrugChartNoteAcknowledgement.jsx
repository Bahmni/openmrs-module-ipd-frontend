import React from "react";
import { TextArea, Toggle } from "carbon-components-react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { canAcknowledgeAmendment } from "../utils/DrugChartUtils";
import "../styles/DrugChartNoteAcknowledgement.scss";

const DrugChartNoteAcknowledgement = (props) => {
  const {
    privileges,
    acknowledgementNotes,
    isAcknowledged,
    isSaveDisabled,
    onNotesChange,
    onToggleChange,
  } = props;

  return (
    <I18nProvider>
      <div className="drug-chart-note-acknowledgement__toggle">
        {canAcknowledgeAmendment(privileges) && (
          <Toggle
            id="acknowledge-toggle"
            data-testId="acknowledge-toggle"
            size={"sm"}
            labelA="Acknowledge"
            labelB="Acknowledge"
            toggled={isAcknowledged}
            onToggle={onToggleChange}
          />
        )}
      </div>
      <div className="drug-chart-note-acknowledgement__textarea">
        <TextArea
          id="acknowledgement-notes"
          data-testid="acknowledgement-notes"
          type="text"
          rows={4}
          value={acknowledgementNotes}
          onChange={onNotesChange}
          labelText={
            <span>
              <FormattedMessage
                id="ACKNOWLEDGEMENT_NOTES"
                defaultMessage="Acknowledgement Notes"
              />
              <span style={{ color: "red" }}> *</span>
            </span>
          }
          placeholder="Enter Notes"
          invalid={!acknowledgementNotes.trim() && isSaveDisabled}
          invalidText="Acknowledgement notes are required"
        />
      </div>
    </I18nProvider>
  );
};

DrugChartNoteAcknowledgement.propTypes = {
  privileges: PropTypes.array,
  acknowledgementNotes: PropTypes.string.isRequired,
  isAcknowledged: PropTypes.bool.isRequired,
  isSaveDisabled: PropTypes.bool.isRequired,
  onNotesChange: PropTypes.func.isRequired,
  onToggleChange: PropTypes.func.isRequired,
};

export default DrugChartNoteAcknowledgement;
