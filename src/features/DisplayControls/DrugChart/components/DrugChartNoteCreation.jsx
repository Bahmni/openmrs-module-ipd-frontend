import React from "react";
import { TextArea, Select, SelectItem } from "carbon-components-react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import { I18nProvider } from "../../../i18n/I18nProvider";
import "../styles/DrugChartNoteAmendment.scss";

const DrugChartNoteCreation = (props) => {
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
          id="note-reason-select"
          data-testid="note-reason-select"
          labelText={
            <span>
              <FormattedMessage id="NEW_NOTE_REASON" defaultMessage="Reason" />
              <span style={{ color: "red" }}> *</span>
            </span>
          }
          value={amendmentReason}
          onChange={onReasonChange}
          invalid={!amendmentReason.trim() && isSaveDisabled}
          invalidText={intl.formatMessage({
            id: "REASON_REQUIRED",
            defaultMessage: "Reason is required",
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
              key={reason}
              value={reason}
              text={intl.formatMessage({
                id: reason,
                defaultMessage: reason,
              })}
            />
          ))}
        </Select>
      </div>
      <div className="drug-chart-note-amendment__textarea">
        <TextArea
          id="new-note"
          data-testid="new-note"
          type="text"
          rows={4}
          value={amendmentNotes}
          onChange={onNotesChange}
          labelText={
            <span>
              <FormattedMessage id="NEW_NOTES" defaultMessage="Notes" />
              <span style={{ color: "red" }}> *</span>
            </span>
          }
          placeholder={intl.formatMessage({
            id: "ENTER_NOTES",
            defaultMessage: "Enter Notes",
          })}
          invalid={!amendmentNotes.trim() && isSaveDisabled}
          invalidText={intl.formatMessage({
            id: "NOTE_REQUIRED",
            defaultMessage: "Notes are required"
          })}
        />
      </div>
    </I18nProvider>
  );
};

DrugChartNoteCreation.propTypes = {
  amendmentReasons: PropTypes.arrayOf(PropTypes.string).isRequired,
  amendmentReason: PropTypes.string.isRequired,
  amendmentNotes: PropTypes.string.isRequired,
  isSaveDisabled: PropTypes.bool.isRequired,
  onReasonChange: PropTypes.func.isRequired,
  onNotesChange: PropTypes.func.isRequired,
};

export default DrugChartNoteCreation;
