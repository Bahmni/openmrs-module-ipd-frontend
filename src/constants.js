// Pick up output.publicPath from webpack.config.js. Maps to the proxy setting when using the micro-frontend capability
/* global __webpack_public_path__:writable */
export const BASE_URL =
  typeof __webpack_public_path__ !== "undefined"
    ? __webpack_public_path__
    : "/";
export const LS_LANG_KEY = "NG_TRANSLATE_LANG_KEY";

export const enableScheduleFrequencies = [
  {
    name: "Twice a day",
    frequencyPerDay: 2,
  },
  {
    name: "Thrice a day",
    frequencyPerDay: 3,
  },
  {
    name: "Four times a day",
    frequencyPerDay: 4,
  },
];

export const enableStartTimeFrequencies = [
  "Every Hour",
  "Every 2 hours",
  "Every 3 hours",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "Once a day",
];
