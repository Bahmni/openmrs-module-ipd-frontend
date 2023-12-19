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
