import React from "react";
import { TextInput } from "carbon-components-react";
import {
  NumberInputCarbon,
  DropdownCarbon,
  DatePickerCarbon,
} from "bahmni-carbon-ui";
import PropTypes from "prop-types";
import moment from "moment";

export const DrugDetails = ({ hostData }) => {
  return (
    <>
      <TextInput
        id="drug-name"
        className="drug-name"
        type="text"
        value={hostData?.drugOrder?.drugOrder?.drug?.name}
        labelText="Drug Name"
        disabled
      />
      <div className="inline-field">
        <div className="dose-field-with-units">
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
            selectedValue={hostData?.drugOrder?.uniformDosingType?.doseUnits}
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
        <div className="duration-field-with-units">
          <NumberInputCarbon
            id={"Dropdown"}
            onChange={() => {}}
            label={"Duration"}
            value={hostData?.drugOrder?.drugOrder?.duration}
            isDisabled={true}
          />
          <DropdownCarbon
            id={"Dropdown"}
            onChange={() => {}}
            titleText={" "}
            selectedValue={hostData?.drugOrder?.drugOrder?.durationUnits}
            options={[]}
            isDisabled={true}
          />
        </div>
        <DatePickerCarbon
          id={"Dropdown"}
          onChange={() => {}}
          titleText={"Start Date"}
          title={"Start Date"}
          value={moment(hostData?.drugOrder?.drugOrder?.scheduledDate).format(
            "MM/DD/YYYY"
          )}
          isDisabled={true}
        />
      </div>
      <div className="frequency">
        <DropdownCarbon
          id={"DropdownFrequency"}
          onChange={() => {}}
          titleText={"Frequency"}
          selectedValue={hostData?.drugOrder?.uniformDosingType?.frequency}
          options={[]}
          isDisabled={true}
        />
      </div>
    </>
  );
};

DrugDetails.propTypes = {
  hostData: PropTypes.shape({
    drugOrder: PropTypes.shape({
      drug: PropTypes.shape({
        name: PropTypes.string,
      }),
      uniformDosingType: PropTypes.shape({
        dose: PropTypes.string,
        doseUnits: PropTypes.string,
        frequency: PropTypes.string,
      }),
      route: PropTypes.string,
      duration: PropTypes.string,
      durationUnit: PropTypes.string,
      scheduledDate: PropTypes.string,
    }),
  }),
};
