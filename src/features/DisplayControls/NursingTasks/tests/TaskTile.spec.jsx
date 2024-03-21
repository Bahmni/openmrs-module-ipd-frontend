import React from "react";
import { render, waitFor } from "@testing-library/react";
import MockDate from "mockdate";
import TaskTile from "../components/TaskTile";
import {
  mockCompletedTaskTileData,
  mockPendingTaskTileData,
  mockTaskTileDataForGroupedTask,
  mockCompletedPRNTaskTileData,
  mockPendingPRNTaskTileData,
  mockNonMedicationTileData,
} from "./NursingTasksUtilsMockData";
import {
  mockConfig,
  mockConfigFor12HourFormat,
} from "../../../../utils/CommonUtils";
import { IPDContext } from "../../../../context/IPDContext";

describe("TaskTile", () => {
  beforeEach(() => {
    MockDate.set("2023-08-11");
  });

  afterEach(() => {
    MockDate.reset();
  });
  it("should match the snapshot for non grouped task", () => {
    const { asFragment } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <TaskTile medicationNursingTask={mockCompletedTaskTileData} />
      </IPDContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should match the snapshot for grouped task", async () => {
    const { asFragment, getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <TaskTile medicationNursingTask={mockTaskTileDataForGroupedTask} />
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
      expect(getByText("(1 more)")).toBeTruthy();
    });
  });

  it("should disable tile when task is completed", () => {
    const { container, getByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <TaskTile medicationNursingTask={mockCompletedTaskTileData} />
      </IPDContext.Provider>
    );

    const completedTile = container.querySelector(".disabled-tile");
    const administeredIcon = getByTestId("Administered");

    expect(completedTile).toBeTruthy();
    expect(administeredIcon).toBeTruthy();
  });

  it("should render pending icon when task is not administered", () => {
    const { getByTestId } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <TaskTile medicationNursingTask={mockPendingTaskTileData} />
      </IPDContext.Provider>
    );

    const pendingIcon = getByTestId("Pending");

    expect(pendingIcon).toBeTruthy();
  });

  it("should render placeholder Rx- PRN task with pending icon", () => {
    const { getByTestId, getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <TaskTile medicationNursingTask={mockPendingPRNTaskTileData} />
      </IPDContext.Provider>
    );
    const pendingIcon = getByTestId("Pending");
    expect(pendingIcon).toBeTruthy();
    expect(getByText("Rx-PRN")).toBeTruthy();
  });

  it("should render administered PRN task with time and Rx-PRN tag", () => {
    const { getByTestId, getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig }}>
        <TaskTile medicationNursingTask={mockCompletedPRNTaskTileData} />
      </IPDContext.Provider>
    );
    const administeredIcon = getByTestId("Administered");
    expect(administeredIcon).toBeTruthy();
    expect(getByText("Rx-PRN")).toBeTruthy();
    expect(getByText("16:38")).toBeTruthy();
  });

  it("should render administered PRN task with time and Rx-PRN tag when time in 12 hour format", () => {
    const { getByTestId, getByText } = render(
      <IPDContext.Provider value={{ config: mockConfigFor12HourFormat }}>
        <TaskTile medicationNursingTask={mockCompletedPRNTaskTileData} />
      </IPDContext.Provider>
    );
    const administeredIcon = getByTestId("Administered");
    expect(administeredIcon).toBeTruthy();
    expect(getByText("Rx-PRN")).toBeTruthy();
    expect(getByText("04:38 PM")).toBeTruthy();
  });

  it("should dislay provider name in the non-medication task tile", () => {
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfigFor12HourFormat }}>
        <TaskTile medicationNursingTask={mockNonMedicationTileData} />
      </IPDContext.Provider>
    );
    expect(getByText("bailly.rurangirwa")).toBeTruthy();
  });
});
