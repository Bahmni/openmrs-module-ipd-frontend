import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DrugChartModal from "./DrugChartModal";
import { drugOrder } from "../test-utils/DrugChartModal/utils";
import "@testing-library/jest-dom";

describe("DrugChartModal", () => {
  it("Component renders successfully", async () => {
    render(<DrugChartModal hostData={{ drugOrder: drugOrder }} hostApi={{}} />);
    await waitFor(() => {
      expect(screen.getByText("Add to Drug Chart")).toBeTruthy();
    });
  });

  it("Drug name fields are disabled", async () => {
    render(
      <DrugChartModal
        hostData={{
          drugOrder: { uniformDosingType: { frequency: "someFrequency" } },
        }}
        hostApi={{}}
      />
    );
    await waitFor(() => {
      const inputElement = screen.getByLabelText("Drug Name");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toHaveStyle("cursor: pointer");
    });
  });

  it("Start time fields are enabled", async () => {
    render(<DrugChartModal hostData={{ drugOrder: drugOrder }} hostApi={{}} />);
    await waitFor(() => {
      const inputElement = screen.getByTestId("notes-section");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).not.toBeDisabled();
    });
  });

  it("Interaction with the component triggers the expected behavior", async () => {
    const mockFunction = jest.fn();
    render(
      <DrugChartModal
        hostData={{ drugOrder: drugOrder }}
        hostApi={{ onModalClose: mockFunction }}
      />
    );
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText("Close"));
      expect(mockFunction).toHaveBeenCalledWith("drug-chart-modal-close-event");
    });
  });
});
