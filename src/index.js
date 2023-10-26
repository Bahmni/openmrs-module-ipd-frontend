import React from "react";
import * as ReactDOM from "react-dom";
// import Dashboard from "./entries/Dashboard";
import Dashboard from "./entries/Dashboard/Dashboard";
import "bahmni-carbon-ui/styles.css";

const devContainer = document.getElementById("dev-bahmni-ipd");
if (devContainer) {
  // const hostData = {
  //   patient: { uuid: "c6184658-2149-40c9-b2d2-96621c93f74a" },
  // };
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
    <Dashboard />,
    devContainer
  );
}
