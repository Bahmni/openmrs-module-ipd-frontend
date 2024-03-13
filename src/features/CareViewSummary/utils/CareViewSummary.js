import axios from "axios";
import {
  GET_SLOTS_FOR_PATIENTS_URL,
  LIST_OF_WARDS_URL,
  WARD_SUMMARY_URL,
} from "../../../constants";

const fetchWards = async () => {
  try {
    return await axios.get(LIST_OF_WARDS_URL);
  } catch (e) {
    return e;
  }
};

const fetchSlots = async (url) => {
  try {
    return await axios.get(url);
  } catch (e) {
    return e;
  }
};

export const getColumnData = (slot, startTime, endTime) => {
  const columnData = [];
  slot.currentSlots.forEach((slotItem) => {
    if (slotItem.startTime >= startTime && slotItem.startTime < endTime) {
      columnData.push(slotItem);
    }
  });
  return columnData;
};

export const fetchWardSummary = async (wardId) => {
  try {
    return await axios.get(WARD_SUMMARY_URL.replace("{wardId}", wardId));
  } catch (e) {
    return e;
  }
};
export const getSlotsForPatients = async (
  patientUuids,
  startTime,
  endTime,
  includePreviousSlot = true,
  includeSlotDuration = true
) => {
  const patientUuidParams = patientUuids
    .map((uuid) => `patientUuids=${uuid}`)
    .join("&");
  const FETCH_SLOTS_URL = `${GET_SLOTS_FOR_PATIENTS_URL}?${patientUuidParams}&startTime=${startTime}&endTime=${endTime}&includePreviousSlot=${includePreviousSlot}&includeSlotDuration=${includeSlotDuration}`;
  const response = await fetchSlots(FETCH_SLOTS_URL);
  if (response.status === 200) {
    return response.data;
  }
  return [];
};

export const getWardDetails = async () => {
  const response = await fetchWards();
  if (response.status === 200) {
    return response.data.results;
  }
  return [];
};

export const getSlidesPerView = (isMobileView, isTabletView) => {
  if (isMobileView) {
    return 2;
  } else if (isTabletView) {
    return Math.floor((window.outerWidth * 0.9) / 142);
  }
};
