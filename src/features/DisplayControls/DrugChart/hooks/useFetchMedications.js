import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchMedications } from "../utils/DrugChartUtils";

export const useFetchMedications = (patientUuid, forDate) => {
  const [drugChartData, setDrugChartData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const callFetchMedications = async () => {
    try {
      const response = await fetchMedications(patientUuid, forDate);
      setDrugChartData(response.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    callFetchMedications();
  }, []);
  return {
    isLoading,
    drugChartData,
    error,
  };
};
useFetchMedications.propTypes = {
  patientId: PropTypes.string.isRequired,
  viewDate: PropTypes.instanceOf(Date),
};
