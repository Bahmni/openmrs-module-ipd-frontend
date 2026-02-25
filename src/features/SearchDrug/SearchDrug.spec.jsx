/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import SearchDrug from "./SearchDrug";
import { searchDrugMockData } from "../DisplayControls/NursingTasks/tests/AddEmergencyTasksMockData";

const mockSearchDrug = jest.fn();
jest.mock("../../utils/CommonUtils", () => {
  return {
    searchDrugsByName: () => mockSearchDrug(),
  };
});
describe("Search Drug", function () {
  it("Should allow drug search", async () => {
    mockSearchDrug.mockReturnValue(searchDrugMockData);
    const { getByText, container } = render(
      <SearchDrug onChange={jest.fn()} />
    );
    const drugNameSearch = container.querySelector(".bx--text-input");
    const targetDrug = "Paracetamol 250 mg Suppository";
    fireEvent.change(drugNameSearch, { target: { value: "Para" } });

    await waitFor(() => {
      expect(
        container.querySelector(".bx--list-box__menu-item__option")
      ).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    fireEvent.click(getByText(targetDrug));
  });
});
