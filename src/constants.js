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
export const DRUG_ORDERS_CONFIG_URL =
  RESTWS_V1 + "/bahmnicore/config/drugOrders";
