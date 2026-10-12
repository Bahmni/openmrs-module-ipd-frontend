import React from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import Dashboard from "./entries/Dashboard/Dashboard";
import "bahmni-carbon-ui/styles.css";

// Dev sandbox only (yarn dev:sandbox). Mimics the hostData/hostApi that the
// clinical app (visitController.js) passes, using the logged-in OpenMRS session.
// Usage: log in at https://localhost, then open
//   http://localhost:8080/?patient=<patientUuid>[&visit=<visitUuid>]
const REST = "/openmrs/ws/rest/v1";

const loadHostData = async () => {
  const params = new URLSearchParams(window.location.search);
  const patientUuid = params.get("patient");
  if (!patientUuid) {
    throw new Error(
      "Add ?patient=<patientUuid>[&visit=<visitUuid>] to the URL"
    );
  }

  // returns user (with privileges), currentProvider and sessionLocation
  const { data: session } = await axios.get(`${REST}/session`);
  if (!session.authenticated) {
    throw new Error("Not logged in: log in at https://localhost first");
  }

  let visitUuid = params.get("visit");
  if (!visitUuid) {
    const { data } = await axios.get(`${REST}/visit`, {
      params: {
        patient: patientUuid,
        includeInactive: false,
        v: "custom:(uuid)",
      },
    });
    visitUuid = data.results[0]?.uuid;
    if (!visitUuid)
      throw new Error("Patient has no active visit; pass &visit=");
  }

  const { data: visitSummary } = await axios.get(
    `${REST}/bahmnicore/visit/summary`,
    { params: { visitUuid } }
  );

  const currentUser = {
    ...session.user,
    provider: session.currentProvider,
    currentLocation: session.sessionLocation?.display,
  };
  return {
    patient: { uuid: patientUuid },
    visitSummary,
    forDate: new Date().toUTCString(),
    provider: session.currentProvider,
    currentUser,
    visitUuid,
    isReadMode: params.get("readMode") === "true",
    source: params.get("source") || undefined,
    privileges: session.user.privileges || [],
  };
};

const hostApi = {
  navigation: {
    visitSummary: () => console.log("[sandbox] navigation.visitSummary"),
  },
  onLogOut: () => (window.location.href = "https://localhost/bahmni/home"),
  handleAuditEvent: (...args) => {
    console.log("[sandbox] handleAuditEvent", ...args);
    return Promise.resolve();
  },
};

const devContainer = document.getElementById("dev-bahmni-ipd");
if (devContainer) {
  const root = createRoot(devContainer);
  loadHostData()
    .then((hostData) =>
      root.render(<Dashboard hostData={hostData} hostApi={hostApi} />)
    )
    .catch((error) =>
      root.render(<pre style={{ padding: 16 }}>[sandbox] {String(error)}</pre>)
    );
}
