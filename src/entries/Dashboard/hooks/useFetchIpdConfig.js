import { useEffect, useState } from "react";
import { fetchConfigData } from "../../../utils/CommonUtils";

export const useFetchIpdConfig = () => {
  const [configData, setConfigData] = useState();
  const [isConfigLoading, setConfigLoading] = useState(true);
  const fetchConfig = async () => {
    try {
      const response = await fetchConfigData();
      setConfigData(response.data);
    } catch (e) {
      return e;
    } finally {
      setConfigLoading(false);
    }
  };
  useEffect(() => {
    fetchConfig();
  }, []);
  return {
    isConfigLoading,
    configData,
  };
};
