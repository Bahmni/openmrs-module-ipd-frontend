/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { render } from "@testing-library/react";
import { StartTimeSection } from "../components/StartTimeSection";

const testProps = {
  startTime: "11:00",
  handleStartTime: jest.fn(),
  showEmptyStartTimeWarning: false,
  showStartTimeBeyondNextDoseWarning: false,
  showStartTimePassedWarning: false,
  enable24HourTimers: false,
};

describe("StartTimeSection", () => {
  it("should match snapshot", () => {
    const { container } = render(<StartTimeSection props={testProps} />);
    expect(container).toMatchSnapshot();
  });
});
