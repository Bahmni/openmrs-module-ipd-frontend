import React from "react";
import { render, waitFor } from "@testing-library/react";
import MockDate from "mockdate";

import TaskTile from "../Components/TaskTile";
import {
  mockTaskTileData,
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
      <TaskTile medicationNursingTask={mockTaskTileData} />
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
});
