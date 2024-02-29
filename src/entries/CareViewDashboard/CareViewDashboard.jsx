import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Header, Link, Loading } from "carbon-components-react";
import { Home20 } from "@carbon/icons-react";
import { ArrowLeft } from "@carbon/icons-react/next";
import _ from "lodash";
import "./CareViewDashboard.scss";
import { CareViewSummary } from "../../features/CareViewSummary/components/CareViewSummary";
import { CareViewPatients } from "../../features/CareViewPatients/components/CareViewPatients";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import { homePageUrl } from "../../constants";
import { CareViewContext } from "../../context/CareViewContext";
import { getConfigForCareViewDashboard } from "./CareViewDashboardUtils";

const CareViewDashboard = (props) => {
  const { hostApi } = props;
  const [selectedWard, setSelectedWard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [wardSummary, setWardSummary] = useState({});
  const [dashboardConfig, setDashboardConfig] = useState({});
  const getConfig = async () => {
    const config = await getConfigForCareViewDashboard();
    setDashboardConfig(config);
  };
  useEffect(() => {
    getConfig();
  }, []);
  return (
    <I18nProvider>
      <main className="care-view-page">
        <Header
          className="border-bottom-0 header-bg-color"
          aria-label="IBM Platform Name"
        >
          <Link href={homePageUrl}>
            <Home20 className="home" aria-label="home-button" />
          </Link>
        </Header>

        <section className="main">
          {isLoading && <Loading />}
          <CareViewContext.Provider
            value={{
              wardSummary,
              setWardSummary,
              selectedWard,
              setSelectedWard,
              dashboardConfig,
            }}
          >
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
                <FormattedMessage
                  id={"WARD_LIST_VIEW_TEXT"}
                  defaultMessage="Ward List View"
                />
              </Link>
            </div>
            <CareViewSummary callbacks={{ setIsLoading }} />
            {!_.isEmpty(dashboardConfig) && (
              <CareViewPatients callbacks={{ setIsLoading }} />
            )}
          </CareViewContext.Provider>
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
