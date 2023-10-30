import React from "react";
import {
  act,
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";

import Dashboard from "./Dashboard";

const hostData = {
  patient: {
    uuid: "patientUuid",
  },
};
describe("Dashboard", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<Dashboard hostData={hostData} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("renders the header", async () => {
    render(<Dashboard hostData={hostData} />);
    let header;
    await waitFor(() => {
      header = screen.getByRole("banner");
    });
    expect(header).toBeTruthy();
  });

  it.skip("renders the side navigation", () => {
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

  it.skip("should update window width on resize", () => {
    render(<Dashboard hostData={hostData} />);

    expect(window.innerWidth).toEqual(window.outerWidth);

    act(() => {
      window.innerWidth = 1200;
      window.dispatchEvent(new Event("resize"));
    });

    render(<Dashboard hostData={hostData} />);

    expect(window.innerWidth).toEqual(1200);
  });

  it.skip("should update sidenav on click of side nav expand", async () => {
    render(<Dashboard hostData={hostData} />);

    const menuButton = screen.getByLabelText("Open menu");

    fireEvent.click(menuButton);
    expect(screen.getByRole("navigation")).toBeTruthy();
  });
});
