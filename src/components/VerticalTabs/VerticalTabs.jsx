/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React, { useState } from "react";

import "./VerticalTabs.scss";

const VerticalTabs = (props) => {
  const { tabData } = props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  return (
    <div className="vertical-tabs-parent">
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
      <div className="tab-content-parent">
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
