import { render } from "@testing-library/react";
import React from "react";
import VerticalTabs from "./VerticalTabs";

const tabData = {
  tab1: {
    data: "data1",
    additionalData: ["additionalData1"],
  },
  tab2: {
    data: "data2",
    additionalData: ["additionalData2"],
  },
};

describe("VerticalTabs", () => {
  it("should render VerticalTabs", () => {
    render(<VerticalTabs tabData={{}} />);
  });

  it("should render VerticalTabs with tabData", () => {
    const { getByText } = render(<VerticalTabs tabData={tabData} />);
    expect(getByText("tab1")).toBeTruthy();
    expect(getByText("tab2")).toBeTruthy();
    expect(getByText("data1")).toBeTruthy();
    expect(getByText("data2")).toBeTruthy();
    expect(getByText("additionalData1")).toBeTruthy();
    expect(getByText("additionalData2")).toBeTruthy();
  });

  it("should render tabData2 with click on tab2", () => {
    const { getByText } = render(<VerticalTabs tabData={tabData} />);
    getByText("tab2").click();
    expect(getByText("data2")).toBeTruthy();
    expect(getByText("additionalData2")).toBeTruthy();
  });
});
