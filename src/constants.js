// Pick up output.publicPath from webpack.config.js. Maps to the proxy setting when using the micro-frontend capability
import { __webpack_public_path__ } from "./webpack-public-path";

export const BASE_URL = __webpack_public_path__;
console.log("BASE_URL", BASE_URL);

export const LS_LANG_KEY = "NG_TRANSLATE_LANG_KEY";
