import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

let appRoot;

export const mountIpd = (el, options) => {
  ReactDOM.render(<App options={options} />, el);
  appRoot = el;
  // appRoot = createRoot(el);
  // appRoot.render(<App options={options} />);
};

export const unmount = () => {
  // appRoot.unmount();
  ReactDOM.unmountComponentAtNode(appRoot);
};

const devContainer = document.getElementById("dev-bahmni-ipd");
if (devContainer)
  [
    mountIpd(devContainer, {
      patient: { uuid: "3ae1ee52-e9b2-4934-876d-30711c0e3e2f" },
    }),
  ];
