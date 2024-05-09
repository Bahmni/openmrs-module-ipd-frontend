import React from "react";
import { TooltipCarbon } from "bahmni-carbon-ui";
import NoteIcon from "../../../../icons/note.svg";
import {
  defaultDateTimeFormat,
  BAHMNI_CORE_OBSERVATIONS_BASE_URL,
} from "../../../../constants";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import axios from "axios";

export const filterDataForRange = (
  data,
  timeConceptNames,
  startEndDates,
  visitStartDateTime
) => {
  return data.filter((obs) => {
    if (obs.visitStartDateTime === visitStartDateTime) {
      const timeConcept = obs.groupMembers.find((member) =>
        timeConceptNames?.includes(member?.concept?.name)
      );
      const obsTime = moment(timeConcept?.value).startOf("minute");
      const startTime = moment(startEndDates.startDate).startOf("minute");
      const endTime = moment(startEndDates.endDate).startOf("minute");
      return obsTime.isBetween(startTime, endTime, null, "[)");
    }
  });
};

export const getSortedObsData = (obsData, sortConceptNames) => {
  const sortedData = [...obsData].sort((a, b) => {
    const sortDataA = a.groupMembers.find((member) =>
      sortConceptNames?.includes(member?.concept?.name)
    );
    const sortDataB = b.groupMembers.find((member) =>
      sortConceptNames?.includes(member?.concept?.name)
    );

    if (sortDataA && sortDataB) {
      return (
        new Date(sortDataA.valueAsString) - new Date(sortDataB.valueAsString)
      );
    } else if (sortDataA) {
      return -1;
    } else if (sortDataB) {
      return 1;
    } else {
      return 0;
    }
  });
  return sortedData;
};

export const transformObsData = (obsData, config) => {
  const consolidatedIOData = {};
  const transformedData = [];
  let balance = 0.0;
  let quantityUnits = "";
  const totalIntakeMap = {};
  const totalOutputMap = {};
  obsData.forEach((obs) => {
    const dateTime = obs.groupMembers.find((member) =>
      config?.timeConceptNames?.includes(member?.concept?.name)
    );
    const intakeRoute = obs.groupMembers.find(
      (member) => member?.concept?.name === config.intakeRouteConcept
    );
    const intakeQuantity = obs.groupMembers.find(
      (member) => member?.concept?.name === config.intakeQuantityConcept
    );
    const outputRoute = obs.groupMembers.find(
      (member) => member?.concept?.name === config.outputRouteConcept
    );
    const outputQuantity = obs.groupMembers.find(
      (member) => member?.concept?.name === config.outputQuantityConcept
    );
    quantityUnits = intakeQuantity
      ? intakeQuantity?.concept?.units
      : outputQuantity?.concept?.units;
    const getBalance = () => {
      balance = caculateBalance(
        intakeQuantity?.value,
        outputQuantity?.value,
        balance
      );
      if (
        balance > config?.normalHighValue ||
        balance < config?.normalLowValue
      ) {
        return (
          <span className={"red-text"}>{balance + " " + quantityUnits}</span>
        );
      } else {
        return <span>{balance + " " + quantityUnits}</span>;
      }
    };
    transformedData.push({
      id: obs.uuid,
      dateTime: formatDate(dateTime?.value, defaultDateTimeFormat),
      intakeRoute: intakeRoute && getRoute(intakeRoute),
      intakeQuantity:
        intakeQuantity && getQuantity(intakeQuantity, quantityUnits),
      outputRoute: outputRoute && getRoute(outputRoute),
      outputQuantity:
        outputQuantity && getQuantity(outputQuantity, quantityUnits),
      balance: getBalance(),
    });
    let intakeGroup = totalIntakeMap[intakeRoute?.valueAsString];
    if (intakeRoute && intakeGroup) {
      intakeQuantity &&
        (intakeGroup.quantity += intakeQuantity && intakeQuantity?.value);
      totalIntakeMap[intakeRoute?.valueAsString] = intakeGroup;
    } else if (intakeRoute) {
      intakeGroup = {};
      intakeGroup.quantity = intakeQuantity && intakeQuantity?.value;
      intakeGroup.quantityUnits = quantityUnits;
      totalIntakeMap[intakeRoute.valueAsString] = intakeGroup;
    }
    let outputGroup = totalOutputMap[outputRoute?.valueAsString];
    if (outputRoute && outputGroup) {
      outputQuantity &&
        (outputGroup.quantity += outputQuantity && outputQuantity?.value);
      totalOutputMap[outputRoute?.valueAsString] = outputGroup;
    } else if (outputRoute) {
      outputGroup = {};
      outputGroup.quantity = outputQuantity && outputQuantity?.value;
      outputGroup.quantityUnits = quantityUnits;
      totalOutputMap[outputRoute.valueAsString] = outputGroup;
    }
  });
  consolidatedIOData.transformedData = transformedData;
  consolidatedIOData.totalIntakeMap = totalIntakeMap;
  consolidatedIOData.totalOutputMap = totalOutputMap;
  return consolidatedIOData;
};

export const caculateBalance = (input, output, balance) => {
  input && (balance += input);
  output && (balance -= output);
  return balance;
};

export const getRoute = (route) => {
  return (
    <div className="notes-icon-div">
      {route?.comment && route?.comment !== "" && (
        <TooltipCarbon
          className="notes-icon"
          icon={() => <NoteIcon />}
          content={route?.comment}
        />
      )}
      <span className={"concept-name"}>{route?.valueAsString}</span>
    </div>
  );
};

export const getQuantity = (quantity, quantityUnits) => {
  return (
    <div className="notes-icon-div">
      {quantity?.comment && quantity?.comment !== "" && (
        <TooltipCarbon
          className="notes-icon"
          icon={() => <NoteIcon />}
          content={quantity?.comment}
        />
      )}
      <span className={"concept-name"}>
        {quantity?.value?.toString() + " " + quantityUnits}
      </span>
    </div>
  );
};

export const intakeOutputHeaders = [
  {
    header: "Date and Time",
    key: "dateTime",
  },
  {
    header: "Intake Route",
    key: "intakeRoute",
  },
  {
    header: "Quantity",
    key: "intakeQuantity",
  },
  {
    header: "Output Route",
    key: "outputRoute",
  },
  {
    header: "Quantity",
    key: "outputQuantity",
  },
  {
    header: "Balance",
    key: "balance",
  },
];

export const currentPeriodRange = (date, periodConfig = {}) => {
  const currentDate = moment(date);
  const [hours, minutes] = periodConfig.startTime.split(":");
  const startDate = moment(date).clone().hour(hours).minute(minutes).second(0);
  const endDate = moment(startDate)
    .clone()
    .add(periodConfig.durationInHours, "hours");
  const currentRange = {};
  if (currentDate.isBetween(startDate, endDate, null, "[]")) {
    currentRange.startDateTime = startDate;
    currentRange.endDateTime = endDate;
  } else if (currentDate.isSameOrBefore(startDate)) {
    currentRange.startDateTime = moment(startDate)
      .clone()
      .subtract(periodConfig.durationInHours, "hours");
    currentRange.endDateTime = moment(currentRange.startDateTime)
      .clone()
      .add(periodConfig.durationInHours, "hours");
  }
  return currentRange;
};

export const NotCurrentPeriodMessage = (
  <FormattedMessage
    id={"NOT_CURRENT_PERIOD_MESSAGE"}
    defaultMessage={"You're not viewing the current period"}
  />
);

export const NoDataForSelectedPeriod = (
  <FormattedMessage
    id={"NO_IO_DATA_MESSAGE"}
    defaultMessage={
      "No intake output data is available for the patient in this period"
    }
  />
);

export const isCurrentPeriod = (startEndDates, periodConfig = {}) => {
  const currentPeriod = currentPeriodRange(new Date(), periodConfig);
  return (
    moment(currentPeriod.startDateTime)
      .startOf("minute")
      .isSame(moment(startEndDates.startDate).startOf("minute")) &&
    moment(currentPeriod.endDateTime)
      .startOf("minute")
      .isSame(moment(startEndDates.endDate).startOf("minute"))
  );
};

export const fetchFormData = async (
  patientUuid,
  conceptNames,
  numberOfVisits
) => {
  const conceptParams = conceptNames
    .map((concept) => `concept=${concept.replace(" ", "+")}`)
    .join("&");
  const INTAKE_OUTPUT_URL = `${BAHMNI_CORE_OBSERVATIONS_BASE_URL}${conceptParams}&numberOfVisits=${numberOfVisits}&patientUuid=${patientUuid}`;
  try {
    const response = await axios.get(INTAKE_OUTPUT_URL, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data;
  } catch (error) {
    return error;
  }
};
