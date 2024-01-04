import React from "react";
import { render, waitFor } from "@testing-library/react";
import MockDate from "mockdate";

import TaskTile from "../components/TaskTile";
import {
  mockCompletedTaskTileData,
  mockPendingTaskTileData,
  mockTaskTileDataForGroupedTask,
} from "./NursingTasksUtilsMockData";

describe("TaskTile", () => {
  beforeEach(() => {
    MockDate.set("2023-08-11");
  });

  afterEach(() => {
    MockDate.reset();
  });
  it("should match the snapshot for non grouped task", () => {
    const { asFragment } = render(
      <TaskTile medicationNursingTask={mockCompletedTaskTileData} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should match the snapshot for grouped task", async () => {
    const { asFragment, getByText } = render(
      <TaskTile medicationNursingTask={mockTaskTileDataForGroupedTask} />
    );

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
      expect(getByText("(1 more)")).toBeTruthy();
    });
  });

  it("should disable tile when task is completed", () => {
    const { container, getByTestId } = render(
      <TaskTile medicationNursingTask={mockCompletedTaskTileData} />
    );

    const completedTile = container.querySelector(".disabled-tile");
    const administeredIcon = getByTestId("Administered");

    expect(completedTile).toBeTruthy();
    expect(administeredIcon).toBeTruthy();
  });

  it("should render pending icon when task is not administered", () => {
    const { getByTestId } = render(
      <TaskTile medicationNursingTask={mockPendingTaskTileData} />
    );

    const pendingIcon = getByTestId("Pending");

    expect(pendingIcon).toBeTruthy();
  });
});
