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
