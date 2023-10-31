// Pick up output.publicPath from webpack.config.js. Maps to the proxy setting when using the micro-frontend capability
/* global __webpack_public_path__:writable */
export const BASE_URL =
  typeof __webpack_public_path__ !== "undefined"
    ? __webpack_public_path__
    : "/";
export const LS_LANG_KEY = "NG_TRANSLATE_LANG_KEY";

const hostUrl = localStorage.getItem("host")
  ? "https://" + localStorage.getItem("host")
  : "";
const RESTWS_V1 = hostUrl + "/openmrs/ws/rest/v1";
const FHIR2_R4 = hostUrl + "/openmrs/ws/fhir2/R4";
export const MEDICATIONS_BASE_URL = RESTWS_V1 + "/ipd/schedule/type/medication";
export const PRESCRIBED_AND_ACTIVE_DRUG_ORDERS_URL =
  RESTWS_V1 + "/bahmnicore/drugOrders/prescribedAndActive";
export const ALLERGIES_BASE_URL = FHIR2_R4 + "/AllergyIntolerance";
const BAHMNI_CORE = RESTWS_V1 + "/bahmnicore";
export const DIAGNOSIS_SEARCH_URL = BAHMNI_CORE + "/diagnosis/search";

export const medicationFrequency = {
  START_TIME_DURATION_FREQUENCY: "START_TIME_DURATION_FREQUENCY",
  FIXED_SCHEDULE_FREQUENCY: "FIXED_SCHEDULE_FREQUENCY",
};
