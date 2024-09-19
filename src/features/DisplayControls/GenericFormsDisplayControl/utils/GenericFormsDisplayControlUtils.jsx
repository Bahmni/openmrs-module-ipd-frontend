import axios from "axios";
import { FETCH_FORM_DETAILS_URL } from "../../../../constants";
import { getFetchFormTranslationsUrl } from "../../../../utils/CommonUtils";
import { FormattedMessage } from "react-intl";

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
    header: (
      <FormattedMessage
        id={"DATE_COLUMN_HEADER"}
        defaultMessage={`Date`}
      />
    ),
  },
  {
    key: "Time",
    header: (
      <FormattedMessage
        id={"TIME_COLUMN_HEADER"}
        defaultMessage={`Time`}
      />
    ),
  },
  {
    key: "Provider",
    header: (
      <FormattedMessage
        id={"FORM_PROVIDER_COLUMN_HEADER"}
        defaultMessage={`Provider`}
      />
    ),
  },
  {
    key: "",
    header: "",
  },
];
