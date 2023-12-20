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
const BAHMNI_CORE = RESTWS_V1 + "/bahmnicore";
export const ADDRESS_HEIRARCHY =
  hostUrl +
  "/openmrs/module/addresshierarchy/ajax/getOrderedAddressHierarchyLevels.form";
export const homePageUrl = "/bahmni/home/#/dashboard";

export const MEDICATIONS_BASE_URL = RESTWS_V1 + "/ipd/schedule/type/medication";
export const PATIENT_URL = RESTWS_V1 + "/patient";

export const DIAGNOSIS_SEARCH_URL = BAHMNI_CORE + "/diagnosis/search";
export const PRESCRIBED_AND_ACTIVE_DRUG_ORDERS_URL =
  BAHMNI_CORE + "/drugOrders/prescribedAndActive";

export const ALLERGIES_BASE_URL = FHIR2_R4 + "/AllergyIntolerance";
export const PATIENT_VITALS_URL = BAHMNI_CORE + "/diseaseSummaryData";
export const CLINICAL_CONFIG_URL =
  hostUrl + "/bahmni_config/openmrs/apps/clinical/app.json";
export const PATIENT_PROFILE = RESTWS_V1 + "/patientprofile";
export const MEDICATION_CONFIG_URL =
  hostUrl + "/bahmni_config/openmrs/apps/clinical/medication.json";
export const DRUG_ORDERS_CONFIG_URL = BAHMNI_CORE + "/config/drugOrders";
export const GET_ALL_PROVIDERS_URL =
  RESTWS_V1 + "/provider?v=custom:(person,uuid,retired)";
export const SEARCH_DRUG_URL =
  RESTWS_V1 +
  "/drug?q={queryString}&s=ordered&v=custom:(uuid,strength,name,dosageForm)";

export const medicationFrequency = {
  START_TIME_DURATION_FREQUENCY: "START_TIME_DURATION_FREQUENCY",
  FIXED_SCHEDULE_FREQUENCY: "FIXED_SCHEDULE_FREQUENCY",
};
export const defaultDateFormat = "DD MMM YYYY";
export const defaultDateTimeFormat = "DD MMM YYYY hh:mm a";
export const DDMMYYY_DATE_FORMAT = "DD/MM/YYYY";
export const dateFormat = "DD/MM/YYYY";

export const componentKeys = {
  ALLERGIES: "AL",
  VITALS: "VT",
  DIAGNOSIS: "DG",
  TREATMENTS: "TR",
  NURSING_TASKS: "NT",
  DRUG_CHART: "DC",
};

export const items = [
  { id: "allTasks", text: "All Tasks" },
  { id: "completed", text: "Completed" },
  { id: "pending", text: "Pending" },
];
