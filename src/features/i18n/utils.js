import { LS_LANG_KEY } from "../../constants";

const translationsBaseUrl = "/i18n";

export function getLocale() {
  return localStorage.getItem(LS_LANG_KEY) || "en";
}

export const getTranslations = async (locale) => {
  const fileName = `locale_${locale}.json`;
  return fetchTranslations(fileName);
};

async function fetchTranslations(fileName) {
  const response = await fetch(`${translationsBaseUrl}/${fileName}`);
  return response.json();
}
