/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { render } from "@testing-library/react";
import Notification from "./Notification";

describe("Notification", () => {
  it("should show success notification", () => {
    const { container } = render(
      <Notification
        hostData={{ notificationKind: "success" }}
        hostApi={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should show warning notification", () => {
    const { container } = render(
      <Notification
        hostData={{ notificationKind: "warning" }}
        hostApi={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
