/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import { render } from "@testing-library/react";
import React from "react";
import AdministrationLegend from "./AdministrationLegend";

describe("AdministrationLegend", () => {
  it("should render without crashing", () => {
    const { container } = render(<AdministrationLegend />);
    expect(container).toMatchSnapshot();
  });
  it("should render legends", () => {
    const { getByText } = render(<AdministrationLegend />);
    expect(getByText("Pending")).toBeTruthy();
    expect(getByText("Late")).toBeTruthy();
    expect(getByText("Completed")).toBeTruthy();
    expect(getByText("Administered Late")).toBeTruthy();
    expect(getByText("Not Administered")).toBeTruthy();
  });
});
