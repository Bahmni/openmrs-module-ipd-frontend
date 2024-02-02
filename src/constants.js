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
export const EDIT_MEDICATIONS_BASE_URL =
  RESTWS_V1 + "/ipd/schedule/type/medication/edit";
export const ADMINISTERED_MEDICATIONS_BASE_URL =
  RESTWS_V1 + "/ipd/scheduledMedicationAdministrations";
export const EMERGENCY_MEDICATIONS_BASE_URL =
  RESTWS_V1 + "/ipd/adhocMedicationAdministrations";
export const PATIENT_URL = RESTWS_V1 + "/patient";

export const DIAGNOSIS_SEARCH_URL = BAHMNI_CORE + "/diagnosis/search";
export const ALL_DRUG_ORDERS_URL = (visitUuid) =>
  RESTWS_V1 + `/ipdVisit/${visitUuid}/medication?includes=emergencyMedications`;
export const ALLERGIES_BASE_URL = FHIR2_R4 + "/AllergyIntolerance";
export const PATIENT_VITALS_URL = BAHMNI_CORE + "/diseaseSummaryData";
export const CLINICAL_CONFIG_URL =
  hostUrl + "/bahmni_config/openmrs/apps/clinical/app.json";
export const DASHBORAD_CONFIG_URL =
  hostUrl + "/bahmni_config/openmrs/apps/ipdDashboard/app.json";
export const PATIENT_PROFILE = RESTWS_V1 + "/patientprofile";
export const MEDICATION_CONFIG_URL =
  hostUrl + "/bahmni_config/openmrs/apps/clinical/medication.json";
export const DRUG_ORDERS_CONFIG_URL = BAHMNI_CORE + "/config/drugOrders";
export const GET_ALL_PROVIDERS_URL =
  RESTWS_V1 + "/provider?v=custom:(person,uuid,retired)";
export const SEARCH_DRUG_URL =
  RESTWS_V1 +
  "/drug?q={queryString}&s=ordered&v=custom:(uuid,strength,name,dosageForm)";

export const VISIT_SUMMARY_URL = BAHMNI_CORE + "/visit/summary";
export const CONFIG_BAHMNIENCOUNTER_URL =
  BAHMNI_CORE + "/config/bahmniencounter";
export const PATIENT_MOVEMENT_URL = BAHMNI_CORE + "/bahmniencounter";
export const DISCHARGE_PATIENT_MOVEMENT_URL = BAHMNI_CORE + "/discharge ";

export const FSN_DISPOSITION_VALUE = "Disposition";
export const BY_FSN_VALUE = "byFullySpecifiedName";
export const FSN_ADT_NOTES_VALUE = "Adt Notes";
export const BAHMNI_VALUE = "bahmni";
export const CUSTOM_OUTPUT_VALUE =
  "custom:(uuid,name,answers:(uuid,name,mappings))";
export const SEARCH_CONCEPT_URL = RESTWS_V1 + "/concept";

export const medicationFrequency = {
  START_TIME_DURATION_FREQUENCY: "START_TIME_DURATION_FREQUENCY",
  FIXED_SCHEDULE_FREQUENCY: "FIXED_SCHEDULE_FREQUENCY",
};
export const BAHMNI_ENCOUNTER_URL = RESTWS_V1 + "/bahmnicore/bahmniencounter";
export const ENCOUNTER_TYPE_URL = RESTWS_V1 + "/encountertype/{encounterType}";

export const defaultDateFormat = "DD MMM YYYY";
export const defaultDateTimeFormat = "DD MMM YYYY hh:mm a";
export const dateFormat = "DD/MM/YYYY";
export const displayShiftTimingsFormat = "DD MMM YYYY | HH:mm";

export const componentKeys = {
  ALLERGIES: "AL",
  VITALS: "VT",
  DIAGNOSIS: "DG",
  TREATMENTS: "TR",
  NURSING_TASKS: "NT",
  DRUG_CHART: "DC",
};

export const performerFunction = "Performer";
export const requesterFunction = "Witness";
export const verifierFunction = "Verifier";
