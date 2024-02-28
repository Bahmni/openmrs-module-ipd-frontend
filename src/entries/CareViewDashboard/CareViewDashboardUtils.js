import { CARE_VIEW_DASHBOARD_CONFIG_URL } from "../../constants";
import axios from "axios";
export const getConfigForCareViewDashboard = async () => {
  try {
    const response = await axios.get(CARE_VIEW_DASHBOARD_CONFIG_URL, {
      withCredentials: true,
    });

    if (response.status !== 200) throw new Error(response.statusText);
    const dashboardConfig = response.data;
    if (dashboardConfig === undefined) {
      return {
        pageSizeOptions: [10, 20, 30, 40, 50],
        defaultPageSize: 10,
      };
    }
    return dashboardConfig;
  } catch (error) {
    return error;
  }
};
