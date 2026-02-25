/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


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
        timeframeLimitInHours: 2,
      };
    }
    return dashboardConfig;
  } catch (error) {
    return error;
  }
};
