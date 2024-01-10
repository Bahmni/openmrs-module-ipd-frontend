import React from "react";
import {
  PRESCRIBED_AND_ACTIVE_DRUG_ORDERS_URL,
  CLINICAL_CONFIG_URL,
  ALL_DRUG_ORDERS_URL,
} from "../../../../constants";
import { getLocale } from "../../../i18n/utils";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import NotesIcon from "../../../../icons/notes.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";

export const treatmentHeaders = [
  {
    header: "Start Date",
    key: "startDate",
    isSortable: true,
  },
  {
    header: "Drug Name",
    key: "drugName",
    isSortable: false,
  },
  {
    header: "Dosage Details",
    key: "dosageDetails",
    isSortable: false,
  },
  {
    header: "Status",
    key: "status",
    isSortable: false,
  },
  {
    header: "Provider Name",
    key: "providerName",
    isSortable: true,
  },
  {
    header: "Actions",
    key: "actions",
    isSortable: false,
  },
];

export const getAllDrugOrders = async (visitUuid) => {
  try {
    const response = await axios.get(ALL_DRUG_ORDERS_URL(visitUuid), {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getConfigsForTreatments = async () => {
  try {
    const response = await axios.get(CLINICAL_CONFIG_URL, {
      withCredentials: true,
    });

    if (response.status !== 200) throw new Error(response.statusText);
    const treatmentConfig = {
      enable24HourTimers: response.data.config.enable24HourTimers,
      startTimeFrequencies: response.data.config.drugChartStartTimeFrequencies,
      scheduleFrequencies: response.data.config.drugChartScheduleFrequencies,
    };
    return treatmentConfig;
  } catch (error) {
    return error;
  }
};

export const updateDrugOrderList = (drugOrderList) => {
  drugOrderList.ipdDrugOrders.forEach((ipdDrugOrder) => {
    ipdDrugOrder.uniformDosingType = {
      dose: ipdDrugOrder.drugOrder.dosingInstructions.dose,
      doseUnits: ipdDrugOrder.drugOrder.dosingInstructions.doseUnits,
      frequency: ipdDrugOrder.drugOrder.dosingInstructions.frequency,
    };
    ipdDrugOrder.route = ipdDrugOrder.drugOrder.dosingInstructions.route;
    ipdDrugOrder.durationUnit = ipdDrugOrder.drugOrder.durationUnits;
    const administrationInstructions = JSON.parse(
      ipdDrugOrder.drugOrder.dosingInstructions.administrationInstructions
    );
    ipdDrugOrder.instructions = administrationInstructions.instructions
      ? administrationInstructions.instructions
      : "";
    ipdDrugOrder.additionalInstructions =
      administrationInstructions.additionalInstructions
        ? administrationInstructions.additionalInstructions
        : "";
  });
  return drugOrderList;
};

export const AddToDrugChart = (
  <FormattedMessage
    id={"ADD_TO_DRUG_CHART"}
    defaultMessage={"Add to Drug Chart"}
  />
);

export const EditDrugChart = (
  <FormattedMessage id={"EDIT_DRUG_CHART"} defaultMessage={"Edit Drug Chart"} />
);

export const NoTreatmentsMessage = (
  <FormattedMessage
    id={"NO_TREATMENTS_MESSAGE"}
    defaultMessage={"No IPD Medication is prescribed for this patient yet"}
  />
);

export const isIPDDrugOrder = (drugOrderObject) => {
  return drugOrderObject.drugOrder.careSetting === "INPATIENT";
};

export const setDosingInstructions = (drugOrder) => {
  return (
    <div className={drugOrder.dateStopped && "strike-through"}>
      {drugOrder.dosingInstructions.dose +
        " " +
        drugOrder.dosingInstructions.doseUnits +
        " - " +
        drugOrder.dosingInstructions.route +
        " - " +
        drugOrder.dosingInstructions.frequency +
        " - for " +
        drugOrder.duration +
        " " +
        drugOrder.durationUnits}
    </div>
  );
};

export const getDrugName = (drugOrderObject) => {
  const drugOrder = drugOrderObject.drugOrder;
  if (
    drugOrder.drug &&
    (drugOrderObject.instructions || drugOrderObject.additionalInstructions)
  ) {
    return (
      <div className="notes-icon-div">
        <NotesIcon className="notes-icon" />
        <span
          className={`treatments-drug-name ${
            drugOrder.dateStopped && "strike-through"
          }`}
        >
          {drugOrder.drug.name}
          <span>
            <DisplayTags drugOrder={drugOrder.dosingInstructions} />
          </span>
        </span>
      </div>
    );
  } else if (drugOrder.drug) return drugOrder.drug.name;
  return drugOrder.freeTextAnswer;
};
