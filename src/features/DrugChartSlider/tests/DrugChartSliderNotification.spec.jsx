import React from "react";
import { render } from "@testing-library/react";
import DrugChartSliderNotification from "../components/DrugChartSliderNotification";

describe("DrugChartSliderNotification", () => {
  it("should show success notification", () => {
    const { container } = render(
      <DrugChartSliderNotification
        hostData={{ notificationKind: "success" }}
        hostApi={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should show warning notification", () => {
    const { container } = render(
      <DrugChartSliderNotification
        hostData={{ notificationKind: "warning" }}
        hostApi={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
