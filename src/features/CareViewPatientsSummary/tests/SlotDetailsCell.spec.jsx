import { SlotDetailsCell } from "../components/SlotDetailsCell";
import { mockSlotsData } from "../../CareViewSummary/tests/CareViewSummaryMock";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { CareViewContext } from "../../../context/CareViewContext";
import { mockConfig } from "../../../utils/CommonUtils";
import "@testing-library/jest-dom/extend-expect";

const mockContext = {
  careViewConfig: { timeframeLimitInHours: 2 },
  ipdConfig: mockConfig,
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
});
