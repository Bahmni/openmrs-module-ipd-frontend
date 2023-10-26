import React, { useState, useRef, Suspense, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Header,
  HeaderMenuButton,
  SideNav,
  SideNavItems,
  SideNavLink,
} from "carbon-components-react";
import { componentMapping } from "./componentMapping";
import "./Dashboard.scss";

export default function Dashboard(props) {
  const [sections, setSections] = useState([]);
  const [isSideNavExpanded, updateSideNav] = useState(true);
  const [selectedTab, updateSelectedTab] = useState(null);
  const refs = useRef([]);


  const fetchConfigJson = () => {
    fetch("./config.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const { config: { sections = [] } = {} } = data;
        const updatedSections = sections
          .filter((sec) => componentMapping[sec.component])
          .sort((a, b) => a.displayOrder - b.displayOrder);
        updateSelectedTab(updatedSections[0].component);
        setSections(updatedSections);
      })
      .catch((e) => {
        console.log("error -> ", e.message);
      });
  };

  useEffect(() => {
    fetchConfigJson();
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
          isCollapsible={true}
        />
        <SideNav
          aria-label="Side navigation"
          className="navbar-border"
          isPersistent={false}
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

      <section
        className="main"
        // style={{ marginLeft: isSideNavExpanded ? "16rem" : "0" }}
      >
        {sections?.map((el) => {
          console.log("hostdata in secionts ", hostData);
          const DisplayControl = componentMapping[el.component];
          return (
            <section
              key={el.component}
              ref={(ref) => (refs.current[el.component] = ref)}
              style={{ height: "1200px" }}
            >
              <Suspense fallback={<p>Loading...</p>}>
                <DisplayControl />
              </Suspense>
            </section>
          );
        })}
      </section>
    </main>
  );
}
// Dashboard.propTypes = {
//   hostData: PropTypes.shape({
//     patient: { uuid: PropTypes.string },
//   }).isRequired,
// };
