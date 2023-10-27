import React from "react";
import * as ReactDOM from "react-dom";
// import Dashboard from "./entries/Dashboard";
import Dashboard from "./components/Dashboard/Dashboard";
import "bahmni-carbon-ui/styles.css";

const devContainer = document.getElementById("dev-bahmni-ipd");
if (devContainer) {
  const hostData = {
    patient: { uuid: "82260304-0a02-4c27-a879-e697c2180a7d" },
  };
  // const hostInterface = {
  //   onConfirm(event) {
  //     console.log(
  //       "--- Simulating host interface: received onConfirm with ",
  //       event
  //     );
  //   },
  // };
  ReactDOM.render(
    // <Dashboard hostData={hostData} hostInterface={hostInterface} />,
    <Dashboard hostData={hostData} />,
    devContainer
  );
}
