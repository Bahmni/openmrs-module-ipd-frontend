import React from "react";
import SideBarPanel from "../../../../../components/SideBarPanel/SideBarPanel";
import { TextInput } from "carbon-components-react";
import {
  DatePickerCarbon,
  DropdownCarbon,
  NumberInputCarbon,
} from "bahmni-carbon-ui";
import PropTypes from "prop-types";
import { TextArea } from "carbon-components-react";
import "../../styles/DrugChartSlider.scss";

const DrugChartSlider = (props) => {
  const { title, hostData, hostApi } = props;
  console.log("Inside DrugChartSlider");
  console.log("hostDataaaaaaaaa", hostData);
  console.log("hostApi", hostApi);

  return (
    <SideBarPanel title={title}>
      <TextInput
        id="drug-name"
        className="drug-name"
        type="text"
        // value={hostData?.drugOrder?.drug?.name}
        labelText="Drug Name"
        // disabled
      />
      <div className="inline-field">
        <div className="dose-field-with-units">
          <NumberInputCarbon
            id={"Dropdown"}
            onChange={() => {}}
            style={{ width: "50%" }}
            label={"Dose"}
            // value={hostData?.drugOrder?.uniformDosingType?.dose}
            // isDisabled={true}
          />
          <DropdownCarbon
            id={"Dropdown"}
            onChange={() => {}}
            titleText={" "}
            style={{ paddingLeft: "10px" }}
            // selectedValue={hostData?.drugOrder?.uniformDosingType?.doseUnits}
            options={[]}
            // isDisabled={true}
          />
        </div>
        <div className="route">
          <DropdownCarbon
            id={"Dropdown"}
            onChange={() => {}}
            titleText={"Route"}
            // selectedValue={hostData?.drugOrder?.route}
            options={[]}
            // isDisabled={true}
          />
        </div>
      </div>
      <div className="inline-field">
        <DatePickerCarbon
          id={"Dropdown"}
          onChange={() => {}}
          titleText={"Start Date"}
          title={"Start Date"}
          // value={moment(hostData?.drugOrder?.scheduledDate).format(
          //   "MM/DD/YYYY"
          // )}
          // isDisabled={true}
        />
        <div className="duration-field-with-units">
          <NumberInputCarbon
            id={"Dropdown"}
            onChange={() => {}}
            label={"Duration"}
            // value={hostData?.drugOrder?.duration}
            isDisabled={true}
          />
          <DropdownCarbon
            id={"Dropdown"}
            onChange={() => {}}
            titleText={" "}
            // selectedValue={hostData?.drugOrder?.durationUnit}
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
          // selectedValue={hostData?.drugOrder?.uniformDosingType?.frequency}
          options={[]}
          // isDisabled={true}
        />
      </div>
      {/* {enableSchedule && ( 
          <div className="schedule-section">
            <Title text="Schedule(s)" isRequired={true} />
            <div className="inline-field" id="schedule">
              {Array.from(
                { length: enableSchedule?.frequencyPerDay },
                (_, index) =>
                  enable24HourTimers ? (
                    <div className="schedule-time" key={index}>
                      <TimePicker24Hour
                        key={index}
                        id={`schedule-${index}`}
                        defaultTime={schedules[index]}
                        onChange={(time) => {
                          handleSchedule(time, index);
                        }}
                        labelText=" "
                        width="70%"
                        invalidText={invalidTimeText24Hour}
                      />
                    </div>
                  ) : (
                    <div className="schedule-time" key={index}>
                      <TimePicker
                        key={index}
                        labelText=" "
                        defaultTime={schedules[index]}
                        onChange={(time) => {
                          handleSchedule(time, index);
                        }}
                        id={`schedule-${index}`}
                        invalidText={invalidTimeText12Hour}
                      />
                    </div>
                  )
              )}
            </div>
            {showScheduleOrderWarning && (
              <p className="time-error">
                <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_ORDER_WARNING"></FormattedMessage>
              </p>
            )}
            {showEmptyScheduleWarning && (
              <p className="time-error">
                <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_SCHEDULE_WARNING"></FormattedMessage>
              </p>
            )}
            {showSchedulePassedWarning.some(
              (showSchedulePassed) => showSchedulePassed === true
            ) && (
              <p className="time-warning">
                <FormattedMessage id="DRUG_CHART_MODAL_SCHEDULE_PASSED_WARNING"></FormattedMessage>
              </p>
            )}
          </div>
        )}
        {enableStartTime && (
          <div className="start-time">
            {enable24HourTimers ? (
              <>
                <TimePicker24Hour
                  data-modal-primary-focus
                  labelText={"Start Time"}
                  id={"start-time"}
                  onChange={(time) => handleStartTime(time)}
                  isRequired={true}
                  defaultTime={startTime}
                  width="80%"
                  invalidText={invalidTimeText24Hour}
                />
                {showStartTimePassedWarning && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_PASSED"></FormattedMessage>
                  </p>
                )}
                {showStartTimeBeyondNextDoseWarning && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_BEYOND_NEXT_DOSE"></FormattedMessage>
                  </p>
                )}
                {showEmptyStartTimeWarning && (
                  <p className="time-error">
                    <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_START_TIME_WARNING"></FormattedMessage>
                  </p>
                )}
              </>
            ) : (
              <>
                <TimePicker
                  id={"start-time"}
                  onChange={(time) => handleStartTime(time)}
                  defaultTime={startTime}
                  labelText={"Start Time"}
                  isRequired={true}
                  invalidText={invalidTimeText12Hour}
                />
                {showStartTimePassedWarning && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_PASSED"></FormattedMessage>
                  </p>
                )}
                {showStartTimeBeyondNextDoseWarning && (
                  <p className="time-warning">
                    <FormattedMessage id="DRUG_CHART_MODAL_START_TIME_BEYOND_NEXT_DOSE"></FormattedMessage>
                  </p>
                )}
                {showEmptyStartTimeWarning && (
                  <p className="time-error">
                    <FormattedMessage id="DRUG_CHART_MODAL_EMPTY_START_TIME_WARNING"></FormattedMessage>
                  </p>
                )}
              </>
            )}
          </div>
        )} */}
      <div className="instructions">
        <TextArea
          className="instruction"
          readOnly
          type="text"
          rows={1}
          // value={hostData?.drugOrder?.instructions}
          labelText="Instruction"
          // disabled
        />
      </div>
      <div className="additional-instructions">
        <TextArea
          className="additional-instruction"
          readOnly
          type="text"
          rows={1}
          // value={hostData?.drugOrder?.additionalInstructions}
          labelText="Additional Instruction"
          // disabled
        />
      </div>
      <div className="notes-sections">
        <TextArea
          data-testid="notes-section"
          className="notes-section"
          type="text"
          rows={3}
          // value={drugChartNotes}
          // onChange={(e) => setDrugChartNotes(e.target.value)}
          labelText="Notes"
        />
      </div>
    </SideBarPanel>
  );
};

DrugChartSlider.propTypes = {
  title: PropTypes.string.isRequired,
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
};

export default DrugChartSlider;
