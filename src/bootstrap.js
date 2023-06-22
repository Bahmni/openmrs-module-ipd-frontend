import React from "react";
import * as ReactDOM from "react-dom";
import Dashboard from "./Dashboard";

const devContainer = document.getElementById("dev-bahmni-ipd");
if (devContainer) {
  const options = {
    patient: { uuid: "3ae1ee52-e9b2-4934-876d-30711c0e3e2f" },
  };
  ReactDOM.render(<Dashboard options={options} />, devContainer);
}
