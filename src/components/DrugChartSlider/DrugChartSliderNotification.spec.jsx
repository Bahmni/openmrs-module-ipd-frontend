import React from "react";
import { render } from "@testing-library/react";
import DrugChartSliderNotification from "./DrugChartSliderNotification";
import { mockNotificationKind } from "./DrugChartSliderTestUtils";

describe("DrugChartSliderNotification", () => {
  it("Component renders successfully", async () => {
    const { container } = render(
      <DrugChartSliderNotification
        hostData={{ notificationKind: mockNotificationKind }}
        hostApi={{}}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
