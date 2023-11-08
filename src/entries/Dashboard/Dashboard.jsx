import React, { useState, useRef, Suspense, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import {
  Accordion,
  AccordionItem,
  Header,
  HeaderMenuButton,
  SideNav,
  SideNavItems,
  SideNavLink,
  Link,
} from "carbon-components-react";
import { ArrowLeft } from "@carbon/icons-react/next";
import { componentMapping } from "./componentMapping";
import "./Dashboard.scss";
import data from "../../utils/config.json";
import PropTypes from "prop-types";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import { getPatientDashboardUrl } from "../../utils/DashboardUtils/DashboardUtils";

export default function Dashboard(props) {
  const { hostData } = props;
  const { patient } = hostData;
  const [sections, setSections] = useState([]);
  const [isSideNavExpanded, updateSideNav] = useState(true);
  const [selectedTab, updateSelectedTab] = useState(null);
  const refs = useRef([]);
  const [windowWidth, updateWindowWidth] = useState(window.outerWidth);

  window.addEventListener("resize", () => {
    updateWindowWidth(window.outerWidth);
  });
  useEffect(() => {
    updateSideNav(window.outerWidth > 1024);
  }, [windowWidth]);

  const fetchConfig = () => {
    const { config: { sections = [] } = {} } = data;
    const updatedSections = sections
      .filter((sec) => componentMapping[sec.component])
      .sort((a, b) => a.displayOrder - b.displayOrder);
    updateSelectedTab(updatedSections[0].component);
    setSections(updatedSections);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const onClickSideNavExpand = () => {
    updateSideNav((oldState) => !oldState);
  };

  const scrollToSection = (index) => {
    updateSelectedTab(index);
    window.scrollTo({
      top: refs.current[index].offsetTop,
      behavior: "smooth",
    });
  };

  return (
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
                  isActive={el.component === selectedTab}
                  key={el.component}
                  onClick={() => scrollToSection(el.component)}
                >
                  {el.name}
                </SideNavLink>
              );
            })}
          </SideNavItems>
        </SideNav>
      </Header>

      <section className="main">
        <div className={"navigation-buttons"}>
          <ArrowLeft
            data-testid={"Back button"}
            size={20}
            onClick={() => window.history.back()}
          />
          <Link
            onClick={() => {
              window.location.href = getPatientDashboardUrl(patient?.uuid);
            }}
          >
            <FormattedMessage
              id={"VIEW_CLINICAL_DASHBOARD"}
              defaultMessage={"View Clinical Dashboard"}
            />
          </Link>
        </div>
        <Accordion className={"accordion"}>
          {sections?.map((el) => {
            const DisplayControl = componentMapping[el.component];
            return (
              <section
                key={el.component}
                ref={(ref) => (refs.current[el.component] = ref)}
                style={{ marginBottom: "40px" }}
              >
                <Suspense fallback={<p>Loading...</p>}>
                  <AccordionItem open title={el.name}>
                    <I18nProvider>
                      <DisplayControl patientId={patient?.uuid} />
                    </I18nProvider>
                  </AccordionItem>
                </Suspense>
              </section>
            );
          })}
        </Accordion>
      </section>
    </main>
  );
}
Dashboard.propTypes = {
  hostData: PropTypes.object.isRequired,
};
