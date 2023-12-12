import React from "react";
import { render, waitFor } from "@testing-library/react";
import { ScheduleSection } from "../components/ScheduleSection"; // Replace 'YourComponent' with the actual file name

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
    const { container } = render(<ScheduleSection {...props} />);

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
  it("renders ScheduleSection component when firstday slots  missed is 0", async () => {
    const { container } = render(
      <ScheduleSection {...props} firstDaySlotsMissed={0} />
    );

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
