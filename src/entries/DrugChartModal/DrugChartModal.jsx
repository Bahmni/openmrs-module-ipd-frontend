import {
  DatePickerCarbon,
  DropdownCarbon,
  NumberInputCarbon,
  TimePicker,
} from "bahmni-carbon-ui";
import { Modal, TextArea, TextInput } from "carbon-components-react";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import "./DrugChartModal.scss";
import {
  enableScheduleFrequencies,
  enableStartTimeFrequencies,
} from "../../constants";

export default function DrugChartModal(props) {
  let { hostData } = props;
  const enableScheduleFrequency = enableScheduleFrequencies.find(
    (frequency) =>
      frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enableStartTime = enableStartTimeFrequencies.includes(
    hostData?.drugOrder?.uniformDosingType?.frequency
  );

  return (
    <I18nProvider>
      <Modal
        open
        modalHeading={<FormattedMessage id="DRUG_CHART_MODAL_HEADER" />}
        primaryButtonText={<FormattedMessage id="MODAL_SAVE" />}
        secondaryButtonText={<FormattedMessage id="MODAL_CANCEL" />}
        onRequestClose={() => {
          if (hostData) {
            hostData.close = false;
          }
        }}
        onRequestSubmit={() => {}}
        onSecondarySubmit={() => {}}
      >
        {console.log(hostData)}
        <div>
          <TextInput
            className="drug-name"
            readOnly
            type="text"
            value={hostData?.drugOrder?.drug?.name}
            labelText="Drug Name"
          />
          <div className="inline-field">
            <NumberInputCarbon
              id={"Dropdown"}
              onChange={() => {}}
              label={"Dose"}
              value={hostData?.drugOrder?.uniformDosingType?.dose}
              isDisabled={true}
            />
            <DropdownCarbon
              id={"Dropdown"}
              onChange={() => {}}
              titleText={"Units(s)"}
              selectedValue={hostData?.drugOrder?.uniformDosingType?.doseUnits}
              options={[]}
              isDisabled={true}
            />
            <NumberInputCarbon
              id={"Dropdown"}
              onChange={() => {}}
              label={"Duration"}
              value={hostData?.drugOrder?.duration}
              isDisabled={true}
            />
            <DropdownCarbon
              id={"Dropdown"}
              onChange={() => {}}
              titleText={"Units(s)"}
              selectedValue={hostData?.drugOrder?.durationUnit}
              options={[]}
              isDisabled={true}
            />
          </div>
          <div className="inline-field">
            <DropdownCarbon
              id={"Dropdown"}
              onChange={() => {}}
              titleText={"Frequency"}
              selectedValue={hostData?.drugOrder?.uniformDosingType?.frequency}
              options={[]}
              isDisabled={true}
            />
            <DropdownCarbon
              id={"Dropdown"}
              onChange={() => {}}
              titleText={"Route"}
              selectedValue={hostData?.drugOrder?.route}
              options={[]}
              isDisabled={true}
            />
            <DatePickerCarbon
              id={"Dropdown"}
              onChange={() => {}}
              titleText={"Start Date"}
              minDate={moment().format("MM-DD-YYYY")}
              title={"Start Date"}
              value={moment(hostData?.drugOrder?.scheduledDate).format(
                "MM/DD/YYYY"
              )}
              isDisabled={true}
            />
          </div>
          <TextArea
            className="instruction"
            readOnly
            type="text"
            rows={1}
            disabled={true}
            value={hostData?.drugOrder?.instructions || "No Instructions"}
            labelText="Instruction"
          />
          <TextArea
            className="additional-instruction"
            readOnly
            type="text"
            rows={1}
            disabled={true}
            value={
              hostData?.drugOrder?.additionalInstructions ||
              "No Additional Instructions"
            }
            labelText="Additional Instruction"
          />
          <TextArea
            data-modal-primary-focus
            className="notes-section"
            type="text"
            rows={2}
            labelText="Notes"
          />
          {enableScheduleFrequency && (
            <div className="schedule-section">
              {/* <label className="bx--label">Schedule</label> */}
              <div className="inline-field" id="schedule">
                {Array.from(
                  { length: enableScheduleFrequency.frequencyPerDay },
                  (_, index) => (
                    <TimePicker
                      key={index}
                      onChange={() => {}}
                      id={`schedule-${index}`}
                      labelText={`Schedule ${index + 1}`}
                      defaultTime={moment()}
                      isRequired={true}
                    />
                  )
                )}
              </div>
            </div>
          )}
          {enableStartTime && (
            <div className="start-time">
              <TimePicker
                id={"start-time"}
                onChange={() => {}}
                defaultTime={moment()}
                labelText={"Start Time"}
                isRequired={true}
              />
            </div>
          )}
        </div>
      </Modal>
    </I18nProvider>
  );
}

DrugChartModal.propTypes = {
  hostData: PropTypes.shape({
    drugOrder: PropTypes.object,
    close: PropTypes.bool,
  }).isRequired,
  hostApi: PropTypes.shape({
    onConfirm: PropTypes.func,
  }),
};
