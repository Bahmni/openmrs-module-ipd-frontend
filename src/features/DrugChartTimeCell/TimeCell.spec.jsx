/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import TimeCell from "./TimeCell";
import { render } from "@testing-library/react";

describe("TimeCell", () => {
  it("should render icon on left side of cell if minutes is less than 30", () => {
    const component = render(<TimeCell minutes="20" status="Pending" />);
    expect(component.getByTestId("left-icon")).toBeTruthy();
  });

  it("should render icon on right side of cell if minutes is less than 30", () => {
    const component = render(<TimeCell minutes="40" status="Administered" />);
    expect(component.getByTestId("right-icon")).toBeTruthy();
  });
});
