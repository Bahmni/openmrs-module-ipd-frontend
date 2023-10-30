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
      console.log(e);
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
