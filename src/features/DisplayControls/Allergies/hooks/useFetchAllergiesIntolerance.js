/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchAllergiesData } from "../utils/AllergiesUtils";

export const useFetchAllergiesIntolerance = (patientUuid) => {
  const [allergiesData, setAllergiesData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const callFetchAllergiesIntollerance = async () => {
    try {
      const response = await fetchAllergiesData(patientUuid);
      setAllergiesData(response.data);
    } catch (e) {
      return e;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    callFetchAllergiesIntollerance();
  }, []);
  return {
    isLoading,
    allergiesData: allergiesData,
  };
};
useFetchAllergiesIntolerance.propTypes = {
  patientId: PropTypes.string.isRequired,
};
