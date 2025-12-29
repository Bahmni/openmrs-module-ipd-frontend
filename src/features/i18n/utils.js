import { LS_LANG_KEY, IPD_CONFIG_URL, BASE_URL } from "../../constants";

const translationsBaseUrl = "i18n";

export function getLocale() {
  return localStorage.getItem(LS_LANG_KEY) || "en";
}

export const getTranslations = async (locale) => {
  const fileName = `locale_${locale}.json`;
  try {
    return await fetchTranslations(`${IPD_CONFIG_URL}/${fileName}`);
  } catch (error) {
    console.warn(
      `Primary translation file not found, falling back to secondary: ${error.message}`
    );
    return await fetchTranslations(
      `${BASE_URL}${translationsBaseUrl}/${fileName}`
    );
  }
};

async function fetchTranslations(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch translations from ${url}: ${response.statusText}`
    );
  }
  return response.json();
}
