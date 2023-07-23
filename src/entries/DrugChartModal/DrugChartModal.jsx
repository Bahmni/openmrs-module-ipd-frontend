import {
  DatePickerCarbon,
  DropdownCarbon,
  NumberInputCarbon,
  TimePicker,
  TimePicker24Hour,
  Title,
} from "bahmni-carbon-ui";
import { Modal, TextArea, TextInput } from "carbon-components-react";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import { getDrugOrderFrequencies } from "../../utils/DrugChartModalUtils";
import "./DrugChartModal.scss";

export default function DrugChartModal(props) {
  const { hostData, hostApi } = props;
  const enableScheduleFrequency = hostData?.scheduleFrequencies.find(
    (frequency) =>
      frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enableStartTime = hostData?.startTimeFrequencies.includes(
    hostData?.drugOrder?.uniformDosingType?.frequency
  );
  const enable24HourTimers = hostData?.enable24HourTimers || false;
  const invalidTimeText = "Enter Time in 24hr format";

  const [startTime, setStartTime] = React.useState("");

  const handleClose = () => {
    hostApi.onModalClose?.("drug-chart-modal-close-event");
  };

  const handleSave = async () => {
    var time = "";
    const allFrequencies = await getDrugOrderFrequencies();
    enable24HourTimers
      ? (time = startTime)
      : (time = moment(startTime).format("hh:mm A"));
    console.log("Entered time = ", time);
    const frequencyConfig = allFrequencies.find(
      (frequency) =>
        frequency.name === hostData?.drugOrder?.uniformDosingType?.frequency
    );
    console.log(
      "Number of Slots = ",
      frequencyConfig?.frequencyPerDay *
        hostData?.drugOrder?.uniformDosingType?.dose *
        hostData?.drugOrder?.duration
    );
  };

  const handleCancel = () => {};

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
          onRequestSubmit={handleSave}
          onSecondarySubmit={handleCancel}
          preventCloseOnClickOutside={true}
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
                <div className="inline-field" id="schedule">
                  {Array.from(
                    { length: enableScheduleFrequency.frequencyPerDay },
                    (_, index) =>
                      enable24HourTimers ? (
                        <TimePicker24Hour
                          key={index}
                          id={`schedule-${index}`}
                          onChange={() => {}}
                          labelText=" "
                          defaultTime={""}
                          invalidText={invalidTimeText}
                          width="70%"
                        />
                      ) : (
                        <TimePicker
                          key={index}
                          onChange={() => {}}
                          labelText=" "
                          id={`schedule-${index}`}
                          invalidText={invalidTimeText}
                          defaultTime={""}
                        />
                      )
                  )}
                </div>
              </div>
            )}
            {enableStartTime && (
              <div className="start-time">
                {enable24HourTimers ? (
                  <TimePicker24Hour
                    data-modal-primary-focus
                    labelText={"Start Time"}
                    id={"start-time"}
                    onChange={(time) => setStartTime(time)}
                    isRequired={true}
                    invalidText={invalidTimeText}
                    defaultTime={startTime}
                    width="80%"
                  />
                ) : (
                  <TimePicker
                    id={"start-time"}
                    onChange={(time) => setStartTime(time)}
                    defaultTime={startTime}
                    labelText={"Start Time"}
                    invalidText={invalidTimeText}
                    isRequired={true}
                  />
                )}
              </div>
            )}
            <div className="instructions">
              <TextArea
                className="instruction"
                readOnly
                type="text"
                rows={1}
                disabled={true}
                value={hostData?.drugOrder?.instructions}
                labelText="Instruction"
              />
            </div>
            <div className="additional-instructions">
              <TextArea
                className="additional-instruction"
                readOnly
                type="text"
                rows={1}
                disabled={true}
                value={hostData?.drugOrder?.additionalInstructions}
                labelText="Additional Instruction"
              />
            </div>
            <div className="notes-sections">
              <TextArea
                data-testid="notes-section"
                className="notes-section"
                type="text"
                rows={1}
                labelText="Notes"
              />
            </div>
          </div>
        </Modal>
      </I18nProvider>
    </>
  );
}

DrugChartModal.propTypes = {
  hostData: PropTypes.shape({
    drugOrder: PropTypes.object,
    scheduleFrequencies: PropTypes.array,
    startTimeFrequencies: PropTypes.array,
    enable24HourTimers: PropTypes.bool,
  }).isRequired,
  hostApi: PropTypes.shape({
    onModalClose: PropTypes.func,
  }),
};
