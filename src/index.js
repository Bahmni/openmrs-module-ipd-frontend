import React from "react";
import * as ReactDOM from "react-dom";
// import Dashboard from "./entries/Dashboard";
import Dashboard from "./components/Dashboard/Dashboard";
import "bahmni-carbon-ui/styles.css";

const devContainer = document.getElementById("dev-bahmni-ipd");
if (devContainer) {
  // const hostData = {
  //   patient: { uuid: "3ae1ee52-e9b2-4934-876d-30711c0e3e2f" },
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
    // <Dashboard hostData={hostData} />,
    <Dashboard />,
    devContainer
  );
}
