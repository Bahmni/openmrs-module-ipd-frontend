import axios from "axios";
import {
  BAHMNI_CORE_OBSERVATIONS_BASE_URL,
  FETCH_FORM_DETAILS_URL,
} from "../../../../constants";
import { getFetchFormTranslationsUrl } from "../../../../utils/CommonUtils";

export const fetchObservationsForConcepts = async (concepts, visitUuid) => {
  try {
    const conceptParams = concepts
      .map((concept) => `concept=${concept.replace(" ", "+")}`)
      .join("&");
    const url =
      BAHMNI_CORE_OBSERVATIONS_BASE_URL +
      `${conceptParams}&visitUuid=${visitUuid}`;
    const response = await axios.get(url, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

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
