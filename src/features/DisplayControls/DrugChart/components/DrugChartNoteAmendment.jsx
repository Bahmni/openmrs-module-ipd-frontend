import React from "react";
import { TextArea, Select, SelectItem } from "carbon-components-react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import "../styles/DrugChartNoteAmendment.scss";

const DrugChartNoteAmendment = (props) => {
  const {
    amendmentReasons,
    amendmentReason,
    amendmentNotes,
    isSaveDisabled,
    onReasonChange,
    onNotesChange,
  } = props;

  const intl = useIntl();
  return (
    <I18nProvider>
      <div className="drug-chart-note-amendment__select">
        <Select
          id="amendment-reason-select"
          data-testid="amendment-reason-select"
          labelText={
            <span>
              <FormattedMessage
                id="AMENDMENT_REASON"
                defaultMessage="Amendment Reason"
              />
              <span style={{ color: "red" }}> *</span>
            </span>
          }
          value={amendmentReason}
          onChange={onReasonChange}
          invalid={!amendmentReason.trim() && isSaveDisabled}
          invalidText={intl.formatMessage({
            id: "INVALID_AMENDMENT_REASON",
            defaultMessage: "Amendment Reason is required",
          })}
        >
          <SelectItem
            value=""
            text={intl.formatMessage({
              id: "SELECT_REASON",
              defaultMessage: "Select a reason",
            })}
          />
          {amendmentReasons.map((reason) => (
            <SelectItem
              key={reason.uuid}
              value={reason.uuid}
              text={reason.display}
            />
          ))}
        </Select>
      </div>
      {/* Amendment Notes */}
      <div className="drug-chart-note-amendment__textarea">
        <TextArea
          id="amendment-notes"
          data-testid="amendment-notes"
          type="text"
          rows={4}
          value={amendmentNotes}
          onChange={onNotesChange}
          labelText={
            <span>
              <FormattedMessage
                id="AMENDMENT_NOTES"
                defaultMessage="Amendment Notes"
              />
              <span style={{ color: "red" }}> *</span>
            </span>
          }
          placeholder={intl.formatMessage({
            id: "AMENDMENT_NOTE_PLACEHOLDER",
            defaultMessage: "Enter amendment notes",
          })}
          invalid={!amendmentNotes.trim() && isSaveDisabled}
          invalidText={intl.formatMessage({
            id: "AMENDMENT_NOTE_REQUIRED",
            defaultMessage: "Amendment notes are required",
          })}
        />
      </div>
    </I18nProvider>
  );
};

DrugChartNoteAmendment.propTypes = {
  amendmentReasons: PropTypes.array.isRequired,
  amendmentReason: PropTypes.string.isRequired,
  amendmentNotes: PropTypes.string.isRequired,
  isSaveDisabled: PropTypes.bool.isRequired,
  onReasonChange: PropTypes.func.isRequired,
  onNotesChange: PropTypes.func.isRequired,
};

export default DrugChartNoteAmendment;
