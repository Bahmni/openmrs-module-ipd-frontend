import React from "react";
import {
  DatePicker,
  DatePickerInput,
  TextInput,
} from "carbon-components-react";
import {
  NumberInputCarbon,
  DropdownCarbon,
  DatePickerCarbon,
} from "bahmni-carbon-ui";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { formatDate } from "../../../utils/DateTimeUtils";
import { INTRADAY_SLOTS } from "../../DisplayControls/Treatments/utils/TreatmentsUtils";

const RouteField = ({ hostData, intl }) => (
  <div className="route">
    <DropdownCarbon
      id={"Dropdown"}
      onChange={() => {}}
      titleText={intl.formatMessage({ id: "ROUTE_COLUMN_HEADER", defaultMessage: "Route" })}
      selectedValue={hostData?.drugOrder?.route}
      options={[]}
      isDisabled={true}
    />
  </div>
);

const DurationField = ({ hostData, intl }) => (
  <div className="duration-field-with-units">
    <NumberInputCarbon
      id={"Dropdown"}
      onChange={() => {}}
      label={intl.formatMessage({ id: "DRUG_CHART_MODAL_DURATION", defaultMessage: "Duration" })}
      value={
        hostData?.drugOrder?.durationDisplayValue ??
        hostData?.drugOrder?.drugOrder?.duration
      }
      isDisabled={true}
    />
    <DropdownCarbon
      id={"Dropdown"}
      onChange={() => {}}
      titleText={" "}
      selectedValue={
        hostData?.drugOrder?.durationDisplayUnits ||
        hostData?.drugOrder?.drugOrder?.durationUnits
      }
      options={[]}
      isDisabled={true}
    />
  </div>
);

const StartDateField = ({ hostData, intl }) => (
  <DatePickerCarbon
    id={"Dropdown"}
    onChange={() => {}}
    titleText={intl.formatMessage({ id: "TREATMENTS_DATE_COLUMN_HEADER", defaultMessage: "Start Date" })}
    title={intl.formatMessage({ id: "TREATMENTS_DATE_COLUMN_HEADER", defaultMessage: "Start Date" })}
    dateFormat={"d M Y"}
    placeholder="DD MM YYYY"
    value={formatDate(hostData?.drugOrder?.drugOrder?.scheduledDate)}
    isDisabled={true}
  />
);

export const DrugDetails = ({ hostData, intradayFrequencyName }) => {
  const intl = useIntl();
  const intradayDose = hostData?.drugOrder?.intradayDose;

  return (
    <>
      <TextInput
        id="drug-name"
        className="drug-name"
        type="text"
        value={
           hostData?.drugOrder?.drugOrder?.drugNonCoded ?
           hostData?.drugOrder?.drugOrder?.drugNonCoded :
           hostData?.drugOrder?.drugOrder?.drug?.name
          }
        labelText={intl.formatMessage({ id: "TREATMENTS_DRUG_COLUMN_HEADER", defaultMessage: "Drug Name" })}
        disabled
      />
      {intradayDose ? (
        <>
          <div className="inline-field">
            <div className="dose-field-with-units intraday-dose-field">
              {INTRADAY_SLOTS.filter((slot) => intradayDose[slot] != null).map((slot, index) => (
                <NumberInputCarbon
                  key={slot}
                  id={`intraday-dose-${slot}`}
                  onChange={() => {}}
                  label={index === 0 ? intl.formatMessage({ id: "DOSE_LABEL", defaultMessage: "Dose" }) : " "}
                  value={intradayDose[slot]}
                  isDisabled={true}
                />
              ))}
              <DropdownCarbon
                id={"DoseUnits"}
                onChange={() => {}}
                titleText={" "}
                selectedValue={hostData?.drugOrder?.uniformDosingType?.doseUnits}
                options={[]}
                isDisabled={true}
              />
            </div>
          </div>
          <div className="inline-field intraday-route-duration">
            <RouteField hostData={hostData} intl={intl} />
            <DurationField hostData={hostData} intl={intl} />
          </div>
          <div className="inline-field">
            <div className="intraday-start-date">
              <StartDateField hostData={hostData} intl={intl} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="inline-field">
            <div className="dose-field-with-units">
              <NumberInputCarbon
                id={"Dropdown"}
                onChange={() => {}}
                style={{ width: "50%" }}
                label={intl.formatMessage({ id: "DOSE_LABEL", defaultMessage: "Dose" })}
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
            <RouteField hostData={hostData} intl={intl} />
          </div>
          <div className="inline-field">
            <DurationField hostData={hostData} intl={intl} />
            <StartDateField hostData={hostData} intl={intl} />
          </div>
        </>
      )}
      <div className="frequency">
        <DropdownCarbon
          id={"DropdownFrequency"}
          onChange={() => {}}
          titleText={intl.formatMessage({ id: "DRUG_CHART_MODAL_FREQUENCY", defaultMessage: "Frequency" })}
          selectedValue={intradayFrequencyName || hostData?.drugOrder?.uniformDosingType?.frequency}
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
  intradayFrequencyName: PropTypes.string,
};

RouteField.propTypes = {
  hostData: PropTypes.object,
  intl: PropTypes.object,
};

DurationField.propTypes = {
  hostData: PropTypes.object,
  intl: PropTypes.object,
};

StartDateField.propTypes = {
  hostData: PropTypes.object,
  intl: PropTypes.object,
};
