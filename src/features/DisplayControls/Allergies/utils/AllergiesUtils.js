/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import axios from "axios";
import { ALLERGIES_BASE_URL } from "../../../../constants";

export const fetchAllergiesData = async (patientUuid) => {
  const FETCH_ALLERGIES_URL = `${ALLERGIES_BASE_URL}?patient=${patientUuid}&_summary=data`;
  try {
    const response = await axios.get(FETCH_ALLERGIES_URL);
    return response;
  } catch (error) {
    return error;
  }
};
