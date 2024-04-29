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
