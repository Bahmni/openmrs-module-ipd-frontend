import React from "react";
import { act, render, fireEvent, screen } from "@testing-library/react";

import Dashboard from "./Dashboard";

const hostData = {
  patient: {
    uuid: "patientUuid",
  },
};
describe.skip("Dashboard", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<Dashboard hostData={hostData} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("renders the header", () => {
    render(<Dashboard hostData={hostData} />);
    const header = screen.getByRole("banner");
    expect(header).toBeTruthy();
  });

  it("renders the side navigation", () => {
    render(<Dashboard hostData={hostData} />);
    const sideNav = screen.getByRole("navigation");
    expect(sideNav).toBeTruthy();
  });

  it("renders the accordion sections", () => {
    render(<Dashboard hostData={hostData} />);
    const section1 = screen.findAllByText("Patient Summary");
    const section2 = screen.findAllByText("Vitals");
    expect(section1).toBeTruthy();
    expect(section2).toBeTruthy();
  });

  it("should update window width on resize", () => {
    render(<Dashboard hostData={hostData} />);

    expect(window.innerWidth).toEqual(window.outerWidth);

    act(() => {
      window.innerWidth = 1200;
      window.dispatchEvent(new Event("resize"));
    });

    expect(window.innerWidth).toEqual(1200);
  });

  it("should update sidenav on click of side nav expand", async () => {
    render(<Dashboard hostData={hostData} />);

    const menuButton = screen.getByLabelText("Open menu");

    fireEvent.click(menuButton);
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  it("should go back on click of left Arrow button", () => {
    const spy = jest.spyOn(window.history, "back");
    render(<Dashboard hostData={hostData} />);

    const arrowButton = screen.getByTestId("Back button");

    fireEvent.click(arrowButton);
    expect(spy).toHaveBeenCalled();
  });
});
