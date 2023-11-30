import React from "react";
import PropTypes from "prop-types";
import { Header, Link } from "carbon-components-react";
import { Home24 } from "@carbon/icons-react";
import "./CareViewDashboard.scss";
import { CareViewSummary } from "../../features/CareViewSummary/components/CareViewSummary";
import { CareViewPatients } from "../../features/CareViewPatients/components/CareViewPatients";

export default function CareViewDashboard(props) {
  const { hostData, hostApi } = props;
  console.log("hostData", hostData);
  console.log("hostApi", hostApi);
  return (
    <main className="care-view-page">
      <Header
        className="border-bottom-0 header-bg-color"
        aria-label="IBM Platform Name"
      >
        <Link onClick={() => hostApi?.onHome()}>
          <Home24 className="home" aria-label="home-button" />
        </Link>
      </Header>

      <section className="main">
        <CareViewSummary />
        <CareViewPatients />
      </section>
    </main>
  );
}

CareViewDashboard.propTypes = {
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
};
