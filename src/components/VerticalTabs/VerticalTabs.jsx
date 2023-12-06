import React, { useState } from "react";
import "carbon-components/css/carbon-components.min.css";
import "./VerticalTabs.scss";

const VerticalTabs = (props) => {
  const { tabData } = props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  console.log("tabData inside verticalTabs component", tabData);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div className="tabs-container">
        {Object.keys(tabData).map((key, index) => {
          return (
            <div
              onClick={() => handleTabChange(index)}
              className={`tab ${selectedTabIndex === index ? "active" : ""}`}
            >
              {key}
            </div>
          );
        })}
      </div>
      <div>
        {Object.keys(tabData).map((key, index) => {
          return (
            <div
              className={`tab-content ${
                selectedTabIndex === index && tabData[key]?.data !== ""
                  ? "active"
                  : ""
              }`}
            >
              {tabData[key]?.data}
              {tabData[key].additionalData?.map((data) => {
                return <div className="tab-additional-content">{data}</div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalTabs;
