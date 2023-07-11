// Pick up output.publicPath from webpack.config.js. Maps to the proxy setting when using the micro-frontend capability
// eslint-disable-next-line no-undef
export const BASE_URL = __webpack_public_path__ || "/";

export const LS_LANG_KEY = "NG_TRANSLATE_LANG_KEY";
