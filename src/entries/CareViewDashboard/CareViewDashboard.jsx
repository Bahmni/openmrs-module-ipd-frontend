import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Header, Link, Loading } from "carbon-components-react";
import { Home24 } from "@carbon/icons-react";
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
import { getDashboardConfig } from "../../utils/CommonUtils";
import { ProviderActions } from "../../components/ProvideActions/ProviderActions";

const CareViewDashboard = (props) => {
  const { hostApi, hostData } = props;
  const { onHome, onLogOut } = hostApi;
  const [selectedWard, setSelectedWard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshPatientList, setRefreshPatientList] = useState(false);
  const [wardSummary, setWardSummary] = useState({});
  const [careViewConfig, setCareViewConfig] = useState({});
  const [ipdConfig, setIpdConfig] = useState({});
  const getConfig = async () => {
    const config = await getConfigForCareViewDashboard();
    setCareViewConfig(config);
  };

  const handleRefreshPatientList = () => {
    setRefreshPatientList(!refreshPatientList);
  };

  const getIpdConfig = async () => {
    const configData = await getDashboardConfig();
    const config = configData.data || {};
    setIpdConfig(config);
  };

  useEffect(() => {
    getConfig();
    getIpdConfig();
  }, []);

  return (
    <I18nProvider>
      <main className="care-view-page">
        <Header
          className="border-bottom-0 header-bg-color care-view-header"
          aria-label="IBM Platform Name"
        >
          <Link href={homePageUrl} className={"home"}>
            <Home24 aria-label="home-button" />
          </Link>
          <ProviderActions onLogOut={onLogOut} />
        </Header>

        <section className="main">
          {isLoading && <Loading />}
          <CareViewContext.Provider
            value={{
              wardSummary,
              setWardSummary,
              selectedWard,
              provider: hostData.provider,
              setSelectedWard,
              refreshPatientList,
              handleRefreshPatientList,
              careViewConfig,
              ipdConfig,
            }}
          >
            <div className="care-view-navigations">
              <ArrowLeft
                data-testid={"Back button"}
                size={20}
                onClick={() => hostApi?.onHome()}
              />
              <Link className="ward-view-nav-link" onClick={onHome}>
                <FormattedMessage
                  id={"WARD_LIST_VIEW_TEXT"}
                  defaultMessage="Ward List View"
                />
              </Link>
            </div>
            <CareViewSummary callbacks={{ setIsLoading }} />
            {!_.isEmpty(careViewConfig) && (
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
