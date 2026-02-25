/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import axios from "axios";
import { FETCH_ALL_OBSERVATIONS_IN_ENCOUNTER_URL } from "../../../../constants";

export const fetchAllObservations = async (encounterUuid) => {
  try {
    const response = await axios.get(
      FETCH_ALL_OBSERVATIONS_IN_ENCOUNTER_URL.replace(
        "{encounterUuid}",
        encounterUuid
      )
    );
    if (response.status === 200) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(error);
  }
};
export const flattenObservations = (observations) => {
  let flatObservations = [];
  observations.forEach((observation) => {
    flatObservations.push(observation);
    if (observation.groupMembers && observation.groupMembers.length > 0) {
      const flatGroupMembers = flattenObservations(observation.groupMembers);
      flatObservations = flatObservations.concat(flatGroupMembers);
    }
  });
  return flatObservations;
};
