import { PRESCRIBED_AND_ACTIVE_DRUG_ORDERS_URL } from "../../../constants";
import { getLocale } from "../../i18n/utils";
import axios from "axios";

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
    console.error(error);
    return error;
  }
};
