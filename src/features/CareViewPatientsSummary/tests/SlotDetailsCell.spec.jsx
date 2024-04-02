import { SlotDetailsCell } from "../components/SlotDetailsCell";
import {
  mockSlotsData,
  mockNonMedicationData,
} from "../../CareViewSummary/tests/CareViewSummaryMock";
import React from "react";
import { render, waitFor, within } from "@testing-library/react";
import { CareViewContext } from "../../../context/CareViewContext";
import { mockConfig } from "../../../utils/CommonUtils";
import "@testing-library/jest-dom/extend-expect";

const mockContext = {
  careViewConfig: { timeframeLimitInHours: 2 },
  ipdConfig: mockConfig,
};

const mockFilterValue = {
  id: "allTasks",
};

const mockNonMedicationValue = {
  id: "nonMedicationTasks",
};

describe("SlotDetailsCell", () => {
  it("should render slotDetailsCell", () => {
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <SlotDetailsCell
          uuid={"3ab51ec0-4650-4400-9aaa-75f30ece0208"}
          slotDetails={mockSlotsData}
          timeframeLimitInHours={2}
          navHourEpoch={{
            startHourEpoch: 1672575400,
            endHourEpoch: 1710511200,
          }}
          filterValue={mockFilterValue}
        />
      </CareViewContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders slot details correctly", async () => {
    const { queryAllByText, queryAllByTestId } = render(
      <CareViewContext.Provider value={mockContext}>
        <SlotDetailsCell
          uuid={"3ab51ec0-4650-4400-9aaa-75f30ece0208"}
          slotDetails={mockSlotsData}
          timeframeLimitInHours={2}
          navHourEpoch={{
            startHourEpoch: 1672575400,
            endHourEpoch: 1710511200,
          }}
          filterValue={mockFilterValue}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(
        queryAllByText("Amoxicillin/Clavulanic Acid 1000 mg Tablet")
      ).toBeTruthy();
      expect(queryAllByTestId("drug-details")[0]).toHaveTextContent(
        "2Tablet(s) | Oral"
      );
    });
  });

  it("should not render slotDetails data if provided uuid is not present in slotDetails Array", async () => {
    const { queryAllByText, queryAllByTestId } = render(
      <CareViewContext.Provider value={mockContext}>
        <SlotDetailsCell
          uuid={"98a4a9c5-c26e-46a1-8efc-ae6df95842bf"}
          slotDetails={mockSlotsData}
          timeframeLimitInHours={2}
          navHourEpoch={{
            startHourEpoch: 1672575400,
            endHourEpoch: 1710511200,
          }}
          filterValue={mockFilterValue}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(
        queryAllByText("Amoxicillin/Clavulanic Acid 1000 mg Tablet")
      ).toEqual([]);
      expect(queryAllByTestId("drug-details")).toEqual([]);
    });
  });

  it("should render non medication tasks data with different status", async () => {
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <SlotDetailsCell
          uuid={"98a4a9c5-c26e-46a1-8efc-ae6df95842bf"}
          slotDetails={mockSlotsData}
          timeframeLimitInHours={2}
          navHourEpoch={{
            startHourEpoch: 1711384200,
            endHourEpoch: 1711395000,
          }}
          nonMedicationDetails={mockNonMedicationData}
          filterValue={mockNonMedicationValue}
        />
      </CareViewContext.Provider>
    );

    const tasksData = [
      {
        startTime: "16:30",
        name: "Non Medication Task 1",
        creator: "superman",
        status: "REQUESTED",
      },
      {
        startTime: "16:30",
        name: "Non Medication Task 2",
        creator: "Nurse One",
        status: "COMPLETED",
      },
    ];
    await waitFor(() => {
      const slotDetails = container.querySelectorAll(".slot-details");
      slotDetails.forEach((slot, idx) => {
        expect(within(slot).getByText(tasksData[idx].startTime)).toBeTruthy();
        expect(within(slot).getByText(tasksData[idx].name)).toBeTruthy();
        expect(within(slot).getByText(tasksData[idx].creator)).toBeTruthy();
        expect(within(slot).getByTestId(tasksData[idx].status)).toBeTruthy();
      });
    });
  });
});
