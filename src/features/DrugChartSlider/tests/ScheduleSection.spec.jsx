import React from "react";
import { render, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { ScheduleSection } from "../components/ScheduleSection";

describe("ScheduleSection", () => {
  const props = {
    enableSchedule: { frequencyPerDay: 3 },
    firstDaySlotsMissed: 2,
    firstDaySchedules: ["08:00", "12:00", "16:00"],
    schedules: ["09:00", "13:00", "17:00"],
    finalDaySchedules: ["10:00", "14:00"],
    handleFirstDaySchedule: jest.fn(),
    handleSubsequentDaySchedule: jest.fn(),
    handleFinalDaySchedule: jest.fn(),
    showFirstDayScheduleOrderWarning: false,
    showEmptyFirstDayScheduleWarning: false,
    showFirstDaySchedulePassedWarning: [false, false, false],
    showScheduleOrderWarning: false,
    showEmptyScheduleWarning: false,
    showFinalDayScheduleOrderWarning: false,
    showEmptyFinalDayScheduleWarning: false,
    showSchedulePassedWarning: [false, false, false],
    enable24HourTimers: true,
  };

  it("renders ScheduleSection component when firstday slots are missed", async () => {
    const { container } = render(
      <IntlProvider locale="en">
        <ScheduleSection {...props} />
      </IntlProvider>
    );

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
  it("renders ScheduleSection component when firstday slots  missed is 0", async () => {
    const { container } = render(
      <IntlProvider locale="en">
        <ScheduleSection {...props} firstDaySlotsMissed={0} />
      </IntlProvider>
    );

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
