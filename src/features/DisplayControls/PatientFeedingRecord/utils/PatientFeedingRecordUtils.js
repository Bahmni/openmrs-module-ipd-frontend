import React from "react";
import {
  defaultDateTimeFormat,
} from "../../../../constants";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { FormattedMessage } from "react-intl";

export const patientFeedingRecordHeaders = [
  {
    key: "dateAndTime",
    header: "Date and Time",
  },
  {
    key: "shift",
    header: "Shift",
  },
  {
    key: "route",
    header: "Route",
  },
  {
    key: "feedType",
    header: "Feed Type",
  },
  {
    key: "amount",
    header: "Amount",
  },
];

export const transformObsData = (obsData, config) => {
  const transformedData = [];
  let quantityUnits = "";
  obsData.forEach((obs) => {
    const dateTime = obs.groupMembers.find((member) =>
      config?.timeConceptNames?.includes(member?.concept?.name)
    );
    const shiftValue = obs.groupMembers.find(
      (member) => member?.concept?.name === config?.shiftValueConcept
    );
    const routeValue = obs.groupMembers.find(
      (member) => member?.concept?.name === config?.routeValueConcept
    );
    const feedTypeValue = obs.groupMembers.find(
      (member) => member?.concept?.name === config?.feedTypeConcept
    );
    const amountValue = obs.groupMembers.find(
      (member) => member?.concept?.name === config?.amountValueConcept
    );
    quantityUnits = amountValue?.concept?.units;
    transformedData.push({
      id: obs.uuid,
      dateAndTime: formatDate(dateTime?.value, defaultDateTimeFormat),
      shift: shiftValue && shiftValue.valueAsString,
      route: routeValue && routeValue.valueAsString,
      feedType: feedTypeValue && feedTypeValue.valueAsString,
      amount: amountValue && amountValue.value + " " + quantityUnits,
    });
  });
  return transformedData;
};

export const NoDataForSelectedPeriod = (
  <FormattedMessage
    id={"NO_PFR_DATA_MESSAGE"}
    defaultMessage={
      "No patient feeding record data is available for the patient in this period"
    }
  />
);