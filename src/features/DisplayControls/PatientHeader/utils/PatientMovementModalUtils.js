/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import axios from "axios";
import {
  VISIT_SUMMARY_URL,
  PATIENT_MOVEMENT_URL,
  DISCHARGE_PATIENT_MOVEMENT_URL,
} from "../../../../constants";

export const fetchVisitSummary = async (visitUuid) => {
  const url = `${VISIT_SUMMARY_URL}?visitUuid=${visitUuid}`;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response;
  } catch (error) {
    return error;
  }
};

export const updatePatientMovement = async (payload) => {
  //Admit and Transfer Patient
  const url = `${PATIENT_MOVEMENT_URL}`;
  try {
    const response = await axios.post(url, payload, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const dischargePatient = async (payload) => {
  const url = `${DISCHARGE_PATIENT_MOVEMENT_URL}`;
  try {
    const response = await axios.post(url, payload, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const undoDischargePatient = async (encounterUuid, reason) => {
  const url = `${PATIENT_MOVEMENT_URL}/${encounterUuid}?reason=${reason}`;
  try {
    return await axios.delete(url, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
};
