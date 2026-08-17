import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { ScheduleSection } from "../components/ScheduleSection";

describe("ScheduleSection", () => {
  const props = {
    enableSchedule: { frequencyPerDay: 3 },
    firstDaySlotsMissed: 2,
    firstDaySchedules: ["08:00", "12:00", "16:00"],
    subsequentDaySchedules: ["09:00", "13:00", "17:00"],
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

  it("shows next-day warning when subsequentDayMidnightCrossingSlots has true value", async () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <ScheduleSection
          {...props}
          firstDaySlotsMissed={0}
          subsequentDaySchedules={["09:00", "21:00", "00:00"]}
          subsequentDayMidnightCrossingSlots={[false, false, true]}
        />
      </IntlProvider>
    );
    await waitFor(() => {
      expect(
        getByText(
          "Updated timing causes highlighted doses to cross midnight and appear on the next day."
        )
      ).toBeInTheDocument();
    });
  });

  it("renders toggle when firstDaySlotsMissed > 0 and duration > 1", async () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <ScheduleSection
          {...props}
          duration={5}
          onApplyToAllDaysToggle={jest.fn()}
        />
      </IntlProvider>
    );
    await waitFor(() => {
      expect(getByText("Update Complete Schedule")).toBeInTheDocument();
    });
  });

  it("does not render toggle when duration is 1", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <ScheduleSection
          {...props}
          duration={1}
          onApplyToAllDaysToggle={jest.fn()}
        />
      </IntlProvider>
    );
    await waitFor(() => {
      expect(queryByText("Update Complete Schedule")).not.toBeInTheDocument();
    });
  });

  it("calls onApplyToAllDaysToggle when toggle is clicked", async () => {
    const mockToggle = jest.fn();
    const { getByRole } = render(
      <IntlProvider locale="en">
        <ScheduleSection
          {...props}
          duration={5}
          isToggleEnabled={true}
          onApplyToAllDaysToggle={mockToggle}
        />
      </IntlProvider>
    );
    await waitFor(() => {
      const toggle = getByRole("checkbox");
      fireEvent.click(toggle);
      expect(mockToggle).toHaveBeenCalled();
      expect(mockToggle.mock.calls[0][0]).toBe(true);
    });
  });

  it("does not render toggle when firstDaySlotsMissed is 0", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <ScheduleSection
          {...props}
          firstDaySlotsMissed={0}
          duration={5}
          onApplyToAllDaysToggle={jest.fn()}
        />
      </IntlProvider>
    );
    await waitFor(() => {
      expect(queryByText("Update Complete Schedule")).not.toBeInTheDocument();
    });
  });

  it("shows next-day warning in firstDay section when firstDayMidnightCrossingSlots has true value", async () => {
    const { getByText } = render(
      <IntlProvider locale="en">
        <ScheduleSection
          {...props}
          firstDaySlotsMissed={1}
          firstDayMidnightCrossingSlots={[false, false, true]}
        />
      </IntlProvider>
    );
    await waitFor(() => {
      expect(
        getByText(
          "Updated timing causes highlighted doses to cross midnight and appear on the next day."
        )
      ).toBeInTheDocument();
    });
  });

  it("shows only first-day warning when both first-day and subsequent have midnight crossings", async () => {
    const { getAllByText } = render(
      <IntlProvider locale="en">
        <ScheduleSection
          {...props}
          firstDaySlotsMissed={1}
          firstDayMidnightCrossingSlots={[false, false, true]}
          subsequentDayMidnightCrossingSlots={[false, false, true]}
        />
      </IntlProvider>
    );
    await waitFor(() => {
      const warnings = getAllByText(
        "Updated timing causes highlighted doses to cross midnight and appear on the next day."
      );
      expect(warnings).toHaveLength(1);
    });
  });
});
