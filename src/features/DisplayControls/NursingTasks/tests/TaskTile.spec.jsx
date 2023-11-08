import React from "react";
import { render, waitFor } from "@testing-library/react";
import TaskTile from "../Components/TaskTile";
import {
  mockTaskTileData,
  mockTaskTileDataForGroupedTask,
} from "./NursingTasksUtilsMockData";

describe("TaskTile", () => {
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
