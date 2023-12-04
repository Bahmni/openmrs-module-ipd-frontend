import React, { useState } from "react";
import "carbon-components/css/carbon-components.min.css";

const VerticalTabs = (props) => {
  const { tabData } = props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: "20px",
        }}
      >
        {Object.keys(tabData).map((key, index) => {
            return (
                <div
                onClick={() => handleTabChange(index)}
                style={{
                    cursor: "pointer",
                    marginBottom: "8px",
                    backgroundColor:
                    selectedTabIndex === index ? "#ececec" : "transparent",
                    padding: "8px",
                }}
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
                style={{
                    display: selectedTabIndex === index ? "block" : "none",
                }}
                >
                {tabData[key]}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default VerticalTabs;
