import {
  DatePickerCarbon,
  DropdownCarbon,
  NumberInputCarbon,
  Title,
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
  const { hostData, hostApi } = props;
  const enableScheduleFrequency = enableScheduleFrequencies.find(
    (frequency) =>
      frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enableStartTime = enableStartTimeFrequencies.includes(
    hostData?.drugOrder?.uniformDosingType?.frequency
  );

  const handleClose = () => {
    hostApi.onModalClose?.("drug-chart-modal-close-event");
  };

  return (
    <>
      <I18nProvider>
        <Modal
          className="drug-chart-modal"
          open
          modalHeading={<FormattedMessage id="DRUG_CHART_MODAL_HEADER" />}
          primaryButtonText={<FormattedMessage id="MODAL_SAVE" />}
          secondaryButtonText={<FormattedMessage id="MODAL_CANCEL" />}
          onRequestClose={handleClose}
          closeButtonLabel="Close"
          onRequestSubmit={() => {}}
          onSecondarySubmit={() => {}}
        >
          <div>
            <TextInput
              id="drug-name"
              className="drug-name"
              readOnly
              type="text"
              value={hostData?.drugOrder?.drug?.name}
              labelText="Drug Name"
            />
            <div className="inline-field">
              <div className="field-with-units">
                <NumberInputCarbon
                  id={"Dropdown"}
                  onChange={() => {}}
                  style={{ width: "50%" }}
                  label={"Dose"}
                  value={hostData?.drugOrder?.uniformDosingType?.dose}
                  isDisabled={true}
                />
                <DropdownCarbon
                  id={"Dropdown"}
                  onChange={() => {}}
                  titleText={" "}
                  style={{ paddingLeft: "10px" }}
                  selectedValue={
                    hostData?.drugOrder?.uniformDosingType?.doseUnits
                  }
                  options={[]}
                  isDisabled={true}
                />
              </div>
              <div className="route">
                <DropdownCarbon
                  id={"Dropdown"}
                  onChange={() => {}}
                  titleText={"Route"}
                  selectedValue={hostData?.drugOrder?.route}
                  options={[]}
                  isDisabled={true}
                />
              </div>
            </div>
            <div className="inline-field">
              <DatePickerCarbon
                id={"Dropdown"}
                onChange={() => {}}
                titleText={"Start Date"}
                title={"Start Date"}
                value={moment(hostData?.drugOrder?.scheduledDate).format(
                  "MM/DD/YYYY"
                )}
                isDisabled={true}
              />
              <div className="field-with-units">
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
                  titleText={" "}
                  selectedValue={hostData?.drugOrder?.durationUnit}
                  options={[]}
                  isDisabled={true}
                />
              </div>
            </div>
            <div className="frequency">
              <DropdownCarbon
                id={"Dropdown"}
                onChange={() => {}}
                titleText={"Frequency"}
                selectedValue={
                  hostData?.drugOrder?.uniformDosingType?.frequency
                }
                options={[]}
                isDisabled={true}
              />
            </div>
            {enableScheduleFrequency && (
              <div className="schedule-section">
                <Title text="Schedule" isRequired={true} />
                {/* <label className="bx--label">Schedule</label> */}
                <div className="inline-field" id="schedule">
                  {Array.from(
                    { length: enableScheduleFrequency.frequencyPerDay },
                    (_, index) => (
                      <TimePicker
                        key={index}
                        onChange={() => {}}
                        labelText=" "
                        id={`schedule-${index}`}
                        defaultTime={moment()}
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
            <TextArea
              className="instruction"
              readOnly
              type="text"
              rows={1}
              disabled={true}
              value={hostData?.drugOrder?.instructions}
              labelText="Instruction"
            />
            <TextArea
              className="additional-instruction"
              readOnly
              type="text"
              rows={1}
              disabled={true}
              value={hostData?.drugOrder?.additionalInstructions}
              labelText="Additional Instruction"
            />
            <TextArea
              data-modal-primary-focus
              data-testid="notes-section"
              className="notes-section"
              type="text"
              rows={2}
              labelText="Notes"
            />
          </div>
        </Modal>
      </I18nProvider>
    </>
  );
}

DrugChartModal.propTypes = {
  hostData: PropTypes.shape({
    drugOrder: PropTypes.object,
  }).isRequired,
  hostApi: PropTypes.shape({
    onModalClose: PropTypes.func,
  }),
};
