/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { render } from "@testing-library/react";
import CalendarHeader from "./CalendarHeader";
import { mockConfig } from "../../utils/CommonUtils";
import { IPDContext } from "../../context/IPDContext";

describe("CalendarHeader", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <CalendarHeader />
      </IPDContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it("should render 24 hours", () => {
    const { getAllByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <CalendarHeader />
      </IPDContext.Provider>
    );
    const hours = getAllByTestId("hour");
    expect(hours.length).toBe(24);
  });
});
