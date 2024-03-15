import { TooltipCarbon } from "bahmni-carbon-ui";
import NoteIcon from "../../../../icons/note.svg";
import { defaultDateTimeFormat } from "../../../../constants";
import { formatDate, getDateWithHoursAndMinutes } from "../../../../utils/DateTimeUtils";
import { FormattedMessage } from "react-intl";

export const filterDataForRange = (data, timeConceptNames, startEndDates) => {
    return (data.filter((obs) => {
        const timeConcept = obs.groupMembers.find(member => timeConceptNames?.includes(member?.concept?.name));
        const obsTime = getDateWithHoursAndMinutes(new Date(timeConcept?.value));
        const startTime = getDateWithHoursAndMinutes(startEndDates.startDate);
        const endTime = getDateWithHoursAndMinutes(startEndDates.endDate);
        return obsTime.getTime() >= startTime.getTime() && obsTime.getTime() < endTime.getTime();
    }));
};

export const getSortedObsData = (obsData, sortConceptNames) => {
    const sortedData = [...obsData].sort((a, b) => {
        const sortDataA = a.groupMembers.find(member => sortConceptNames?.includes(member?.concept?.name));
        const sortDataB = b.groupMembers.find(member => sortConceptNames?.includes(member?.concept?.name));

        if (sortDataA && sortDataB) {
            return new Date(sortDataA.valueAsString) - new Date(sortDataB.valueAsString);
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
        const dateTime = obs.groupMembers.find(member => config?.timeConceptNames?.includes(member?.concept?.name));
        const intakeRoute = obs.groupMembers.find(member => member?.concept?.name === config.intakeRouteConcept);
        const intakeQuantity = obs.groupMembers.find(member => member?.concept?.name === config.intakeQuantityConcept);
        const outputRoute = obs.groupMembers.find(member => member?.concept?.name === config.outputRouteConcept);
        const outputQuantity = obs.groupMembers.find(member => member?.concept?.name === config.outputQuantityConcept);
        quantityUnits = intakeQuantity ? intakeQuantity?.concept?.units : outputQuantity?.concept?.units;
        const getBalance = () => {
            balance = caculateBalance(intakeQuantity?.value, outputQuantity?.value, balance);
            if (balance > config?.normalHighValue || balance < config?.normalLowValue) {
              return (
                <span className={"red-text"}>{balance + " " + quantityUnits}</span>
              );
            } else {
              return (
                <span>{balance + " " + quantityUnits}</span>
              );
            }
        };
        transformedData.push({
            id: obs.uuid,
            dateTime: formatDate(dateTime?.value, defaultDateTimeFormat),
            intakeRoute: intakeRoute && getRoute(intakeRoute),
            intakeQuantity: intakeQuantity && getQuantity(intakeQuantity, quantityUnits),
            outputRoute: outputRoute && getRoute(outputRoute),
            outputQuantity: outputQuantity && getQuantity(outputQuantity, quantityUnits),
            balance: getBalance()
        });
        let intakeGroup = totalIntakeMap[intakeRoute?.valueAsString];
        if (intakeRoute && intakeGroup) {
            intakeQuantity && (intakeGroup.quantity += intakeQuantity && intakeQuantity?.value);
            totalIntakeMap[intakeRoute?.valueAsString] = intakeGroup;
        } else if (intakeRoute) {
            intakeGroup = {};
            intakeGroup.quantity = intakeQuantity && intakeQuantity?.value;
            intakeGroup.quantityUnits = quantityUnits;
            totalIntakeMap[intakeRoute.valueAsString] = intakeGroup;
        }
        let outputGroup = totalOutputMap[outputRoute?.valueAsString];
        if (outputRoute && outputGroup) {
            outputQuantity && (outputGroup.quantity += outputQuantity && outputQuantity?.value);
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
    return (<div className="notes-icon-div">
        {route?.comment && route?.comment !== "" && <TooltipCarbon className="notes-icon" icon={() => <NoteIcon />} content={route?.comment} />}
        <span className={"concept-name"}>{route?.valueAsString}</span>
    </div>);
};

export const getQuantity = (quantity, quantityUnits) => {
    return (<div className="notes-icon-div">
        {quantity?.comment && quantity?.comment !== "" && <TooltipCarbon className="notes-icon" icon={() => <NoteIcon />} content={quantity?.comment} />}
        <span className={"concept-name"}>{quantity?.value?.toString() + " " + quantityUnits}</span>
    </div>);
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
    const currentDate = new Date(date);
    const [hours, minutes] = periodConfig.startTime.split(':');
    const startDate = new Date(date);
    startDate.setHours(hours);
    startDate.setMinutes(minutes);
    startDate.setSeconds(0);
    const endDate = new Date(startDate.getTime() + periodConfig.durationInHours * 60 * 60 * 1000);
    const currentRange = {};
    if (currentDate.getTime() >= startDate.getTime() && currentDate.getTime() <= endDate.getTime()) {
        currentRange.startDateTime = startDate;
        currentRange.endDateTime = endDate;
    } else if (currentDate.getTime() <= startDate.getTime()) {
        currentRange.startDateTime = new Date(startDate.getTime() - periodConfig.durationInHours * 60 * 60 * 1000);
        currentRange.endDateTime = new Date(currentRange.startDateTime.getTime() + periodConfig.durationInHours * 60 * 60 * 1000);
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
        defaultMessage={"No Intake Output Data is available for the patient in this period"}
    />
);

export const isCurrentPeriod = (startEndDates, periodConfig = {}) => {
    const currentPeriod = currentPeriodRange(new Date(), periodConfig);
    const tolerance = 1000;
    return (
        Math.abs(startEndDates.startDate.getTime() - currentPeriod.startDateTime.getTime()) <= tolerance &&
        Math.abs(startEndDates.endDate.getTime() - currentPeriod.endDateTime.getTime()) <= tolerance
    );
};
