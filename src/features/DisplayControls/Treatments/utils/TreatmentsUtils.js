import {
  PRESCRIBED_AND_ACTIVE_DRUG_ORDERS_URL,
  CLINICAL_CONFIG_URL,
  ALL_DRUG_ORDERS_URL,
} from "../../../../constants";
import { getLocale } from "../../../i18n/utils";
import axios from "axios";

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

export const getPrescribedAndActiveDrugOrders = async (
  patientUuid,
  numberOfVisits,
  getOtherActive,
  visitUuids,
  startDate,
  endDate,
  getEffectiveOrdersOnly
) => {
  try {
    const params = {
      patientUuid: patientUuid,
      numberOfVisits: numberOfVisits || 15,
      getOtherActive: getOtherActive || true,
      visitUuids: visitUuids || null,
      startDate: startDate || null,
      endDate: endDate || null,
      getEffectiveOrdersOnly: getEffectiveOrdersOnly || false,
      preferredLocale: getLocale(),
    };
    const response = await axios.get(PRESCRIBED_AND_ACTIVE_DRUG_ORDERS_URL, {
      params: params,
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllDrugOrders = async (visitUuid) => {
  try {
    const response = await axios.get(ALL_DRUG_ORDERS_URL(visitUuid), {
      withCredentials: true,
    });
    console.log("response", response);
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
