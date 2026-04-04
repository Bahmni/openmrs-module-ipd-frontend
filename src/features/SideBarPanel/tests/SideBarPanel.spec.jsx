/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import SideBarPanel from "../components/SideBarPanel";

describe("SideBarPanel", () => {
  it("Component renders successfully", () => {
    render(<SideBarPanel title="Add to Drug Chart" closeSideBar={{}} />);
    expect(screen.getByText("Add to Drug Chart")).toBeTruthy();
  });

  it("should call closeSideBar function when close icon is clicked", () => {
    const closeSideBar = jest.fn();
    render(
      <SideBarPanel title="Add to Drug Chart" closeSideBar={closeSideBar} />
    );
    const closeIcon = screen.getByLabelText("Close");
    fireEvent.click(closeIcon);
    expect(closeSideBar).toHaveBeenCalled();
  });
});
