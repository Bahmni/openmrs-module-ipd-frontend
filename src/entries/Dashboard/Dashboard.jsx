import React, { useState, useRef, Suspense, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  Header,
  HeaderMenuButton,
  Loading,
  SideNav,
  SideNavItems,
  SideNavLink,
} from "carbon-components-react";
import { ArrowLeft } from "@carbon/icons-react/next";
import { componentMapping } from "./componentMapping";
import "./Dashboard.scss";
import PropTypes from "prop-types";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import { getDashboardConfig } from "../../utils/CommonUtils";
import { PatientHeader } from "../../features/DisplayControls/PatientHeader/components/PatientHeader";
import RefreshDisplayControl from "../../context/RefreshDisplayControl";
import { SliderContext } from "../../context/SliderContext";
import { IPDContext } from "../../context/IPDContext";
import { AllMedicationsContextProvider } from "../../context/AllMedications";
import { FormattedMessage } from "react-intl";

export default function Dashboard(props) {
  const { hostData, hostApi } = props;
  const { patient, visitUuid ,location, provider, isReadMode=false, visitSummary } = hostData;
  const [sliderContentModified, setSliderContentModified] = useState({
    treatments: false,
    nursingTasks: false,
    emergencyTasks: false,
  });
  const [isSliderOpen, updateSliderOpen] = useState({
    treatments: false,
    nursingTasks: false,
    emergencyTasks: false,
  });
  const [sections, setSections] = useState([]);
  const [isSideNavExpanded, updateSideNav] = useState(true);
  const [selectedTab, updateSelectedTab] = useState(null);
  const refs = useRef([]);
  const [windowWidth, updateWindowWidth] = useState(window.outerWidth);
  const [dashboardConfig, setDashboardConfig] = useState({});
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  const noConfigDataMessage = (
    <FormattedMessage
      id="NO_CONFIG_MESSAGE"
      defaultMessage={"Please specify IPD Dashboard configurations"}
    />
  );
  window.addEventListener("resize", () => {
    updateWindowWidth(window.outerWidth);
  });
  useEffect(() => {
    updateSideNav(window.outerWidth > 1024);
  }, [windowWidth]);

  const fetchConfig = async () => {
    const configData = await getDashboardConfig();
    const config = configData.data || {};
    setDashboardConfig(config);
    setIsConfigLoaded(true);
    const { sections = [] } = config;
    const updatedSections = sections
      .filter((sec) => componentMapping[sec.componentKey])
      .sort((a, b) => a.displayOrder - b.displayOrder);
    updateSelectedTab(updatedSections[0].componentKey);
    setSections(updatedSections);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const onClickSideNavExpand = () => {
    updateSideNav((oldState) => !oldState);
  };

  const scrollToSection = (key) => {
    updateSelectedTab(key);
    window.scrollTo({
      top: refs.current[key].offsetTop - 60,
      behavior: "smooth",
    });
  };

  const checkSliderStatus = () => {
    return Object.values(isSliderOpen).includes(true);
  };

  const handleVisitSummaryNavigation = () => {
    hostApi?.navigation?.visitSummary?.();
  };

  const refreshDisplayControl = (componentKeyArray) => {
    const updatedSections = sections.map((el) => {
      return componentKeyArray.includes(el.componentKey)
        ? { ...el, refreshKey: Math.random() }
        : el;
    });
    setSections(updatedSections);
  };

  return (
    <>
      {!isConfigLoaded ? (
        <Loading withOverlay={true} />
      ) : isConfigLoaded && dashboardConfig?.sections?.length === 0 ? (
        <div style={{ paddingLeft: "10px" }}>{noConfigDataMessage}</div>
      ) : (
        <SliderContext.Provider
          value={{
            isSliderOpen,
            updateSliderOpen,
            sliderContentModified,
            setSliderContentModified,
            provider: hostData.provider,
            visitUuid: hostData.visitUuid,
            visitSummary: hostData.visitSummary,
          }}
        >
          <IPDContext.Provider
            value={{
              patient,
              visit: visitUuid,
              location,
              provider,
              config: dashboardConfig,
              isReadMode, 
              visitSummary
            }}
          >
            <main className="ipd-page">
              <Header
                className="border-bottom-0 header-bg-color"
                aria-label="IBM Platform Name"
              >
                <HeaderMenuButton
                  aria-label="Open menu"
                  className="header-nav-toggle-btn"
                  onClick={onClickSideNavExpand}
                  isActive={isSideNavExpanded}
                />
                <SideNav
                  aria-label="Side navigation"
                  className="navbar-border"
                  isPersistent={true}
                  expanded={isSideNavExpanded}
                >
                  <SideNavItems>
                    {sections?.map((el) => {
                      return (
                        <SideNavLink
                          className="cursor-pointer"
                          isActive={el.componentKey === selectedTab}
                          key={el.componentKey}
                          onClick={() => scrollToSection(el.componentKey)}
                        >
                          {el.title}
                        </SideNavLink>
                      );
                    })}
                  </SideNavItems>
                </SideNav>
              </Header>

              <section
                className={checkSliderStatus() ? "main-with-slider" : "main"}
              >
                <div className={"navigation-buttons"}>
                  <ArrowLeft
                    data-testid={"Back button"}
                    size={20}
                    onClick={() => window.history.back()}
                  />
                </div>
                <PatientHeader
                  patientId={patient?.uuid}
                  openVisitSummary={handleVisitSummaryNavigation}
                />
                <Accordion className={"accordion"}>
                  <AllMedicationsContextProvider>
                    {sections?.map((el) => {
                      const DisplayControl = componentMapping[el.componentKey];
                      return (
                        <section
                          key={el.componentKey}
                          ref={(ref) => (refs.current[el.componentKey] = ref)}
                          style={{ marginBottom: "40px" }}
                        >
                          <Suspense fallback={<p>Loading...</p>}>
                            <AccordionItem open title={el.title}>
                              <I18nProvider>
                                <RefreshDisplayControl.Provider
                                  value={refreshDisplayControl}
                                >
                                  <DisplayControl
                                    key={el.refreshKey}
                                    patientId={patient?.uuid}
                                  />
                                </RefreshDisplayControl.Provider>
                              </I18nProvider>
                            </AccordionItem>
                          </Suspense>
                        </section>
                      );
                    })}
                  </AllMedicationsContextProvider>
                </Accordion>
              </section>
            </main>
          </IPDContext.Provider>
        </SliderContext.Provider>
      )}
    </>
  );
}
Dashboard.propTypes = {
  hostData: PropTypes.object.isRequired,
  hostApi: PropTypes.object.isRequired,
};
