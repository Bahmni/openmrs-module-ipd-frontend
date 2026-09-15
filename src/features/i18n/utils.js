import {
  LS_LANG_KEY,
  BASE_URL,
  CONFIG_TRANSLATIONS_BASE,
  BUNDLED_TRANSLATIONS_BASE,
} from "../../constants";

export function getLocale() {
  return localStorage.getItem(LS_LANG_KEY) || "en";
}

export const getTranslations = async (locale) => {
  const fileName = `locale_${locale}.json`;
  const [bundled, config] = await Promise.all([
    fetchTranslationFile(`${BASE_URL}${BUNDLED_TRANSLATIONS_BASE}/${fileName}`),
    fetchTranslationFile(`${CONFIG_TRANSLATIONS_BASE}${fileName}`),
  ]);
  return { ...bundled, ...config };
};

async function fetchTranslationFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.status);
    return response.json();
  } catch (e) {
    console.error(`Failed to load translations from ${url}:`, e);
    return {};
  }
}
