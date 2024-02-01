import React from "react";
import PropTypes from "prop-types";
import { Header, Link } from "carbon-components-react";
import { Home20, ListBulleted24 } from "@carbon/icons-react";
import { ArrowLeft } from "@carbon/icons-react/next";
import "./CareViewDashboard.scss";
import { CareViewSummary } from "../../features/CareViewSummary/components/CareViewSummary";
import { CareViewPatients } from "../../features/CareViewPatients/components/CareViewPatients";
import { goToHome } from "./CareViewDashboardUtils";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../features/i18n/I18nProvider";

const CareViewDashboard = (props) => {
  const { hostData, hostApi } = props;
  console.log("hostData", hostData);
  return (
    <I18nProvider>
      <main className="care-view-page">
        <Header
          className="border-bottom-0 header-bg-color"
          aria-label="IBM Platform Name"
        >
          <Link onClick={() => goToHome()}>
            <Home20 className="home" aria-label="home-button" />
          </Link>
        </Header>

        <section className="main">
          <div className="care-view-navigations">
            <ArrowLeft
              data-testid={"Back button"}
              size={20}
              onClick={() => hostApi?.onHome()}
            />
            <Link
              className="ward-view-nav-link"
              onClick={() => hostApi?.onHome()}
            >
              <ListBulleted24 data-testid={"List button"} size={20} />
              <FormattedMessage
                id={"WARD_LIST_VIEW_TEXT"}
                defaultMessage="Ward List View"
              />
            </Link>
          </div>
          <CareViewSummary />
          <CareViewPatients />
        </section>
      </main>
    </I18nProvider>
  );
};

export default CareViewDashboard;

CareViewDashboard.propTypes = {
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
};
