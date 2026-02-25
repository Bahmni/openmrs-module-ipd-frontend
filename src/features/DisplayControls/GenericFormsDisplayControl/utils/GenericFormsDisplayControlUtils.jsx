/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import axios from "axios";
import { FETCH_FORM_DETAILS_URL } from "../../../../constants";
import { getFetchFormTranslationsUrl } from "../../../../utils/CommonUtils";

export const fetchAllConceptsForForm = async (formUuid) => {
  try {
    const response = await axios.get(
      FETCH_FORM_DETAILS_URL.replace("{formUuid}", formUuid),
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const fetchFormTranslations = async (formName, formUuid) => {
  try {
    const response = await axios.get(
      getFetchFormTranslationsUrl(formName.replace(" ", "+"), formUuid),
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const formDisplayControlHeaders = [
  {
    key: "Date",
    header: "Date",
  },
  {
    key: "Time",
    header: "Time",
  },
  {
    key: "Provider",
    header: "Provider",
  },
  {
    key: "",
    header: "",
  },
];
