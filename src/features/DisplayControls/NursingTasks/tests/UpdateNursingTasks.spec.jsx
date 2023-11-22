import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import UpdateNursingTasks from "../components/UpdateNursingTasks";
import { mockMedicationTasks } from "./NursingTasksUtilsMockData";

describe("UpdateNursingTasksSlider", function () {
  it("should render UpdateNursingTasksSlider", function () {
    const { container } = render(
      <UpdateNursingTasks
        medicationTasks={mockMedicationTasks}
        updateNursingTasksSlider={jest.fn}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should enable save Button when atleast one task is selected", function () {
    const { container } = render(
      <UpdateNursingTasks
        medicationTasks={mockMedicationTasks}
        updateNursingTasksSlider={jest.fn}
      />
    );
    const saveButton = screen.getByText("Save");
    expect(saveButton.disabled).toEqual(true);
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);
    expect(saveButton.disabled).toEqual(false);
  });

  it("should show notes and time when toggle switch is On", function () {
    const { container } = render(
      <UpdateNursingTasks
        medicationTasks={mockMedicationTasks}
        updateNursingTasksSlider={jest.fn}
      />
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = container.querySelectorAll(
      ".bx--time-picker__input-field"
    )[0];
    expect(timePicker).toBeTruthy();
    const notes = container.querySelectorAll(".bx--text-area")[0];
    expect(notes).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it("should show warning for empty notes when time is updated", function () {
    const { container } = render(
      <UpdateNursingTasks
        medicationTasks={mockMedicationTasks}
        updateNursingTasksSlider={jest.fn}
      />
    );
    const toggleButton = container.querySelectorAll(".bx--toggle__switch")[0];
    fireEvent.click(toggleButton);

    const timePicker = screen.getAllByRole("textbox")[0];
    fireEvent.change(timePicker, { target: { value: "12:00" } });
    fireEvent.blur(timePicker);
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    expect(screen.getByText("Please enter notes")).toBeTruthy();
  });
});
