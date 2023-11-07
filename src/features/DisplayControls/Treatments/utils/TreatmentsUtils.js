import {
  PRESCRIBED_AND_ACTIVE_DRUG_ORDERS_URL,
  CLINICAL_CONFIG_URL,
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
    header: "Prescribed By",
    key: "prescribedBy",
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
  drugOrderList.visitDrugOrders.forEach((visitDrugOrder) => {
    visitDrugOrder.uniformDosingType = {
      dose: visitDrugOrder.dosingInstructions.dose,
      doseUnits: visitDrugOrder.dosingInstructions.doseUnits,
      frequency: visitDrugOrder.dosingInstructions.frequency,
    };
    visitDrugOrder.route = visitDrugOrder.dosingInstructions.route;
    visitDrugOrder.additionalInstructions = JSON.stringify(
      visitDrugOrder.dosingInstructions.additionalInstructions
    );
  });
  return drugOrderList;
};
