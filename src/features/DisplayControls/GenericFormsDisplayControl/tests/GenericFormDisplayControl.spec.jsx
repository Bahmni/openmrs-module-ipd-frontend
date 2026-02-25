/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { render, waitFor } from "@testing-library/react";
import GenericFormsDisplayControl from "../components/GenericFormsDisplayControl";
import { IntlProvider } from "react-intl";
import { IPDContext } from "../../../../context/IPDContext";
import {
  allFormsFilledInVisitMock,
  allFormsSummaryMock,
  mockFormConcepts,
  mockFormTranslations,
} from "./GenericFormDisplayControlMock";

jest.mock("../utils/GenericFormsDisplayControlUtils", () => {
  const originalModule = jest.requireActual(
    "../utils/GenericFormsDisplayControlUtils"
  );
  return {
    ...originalModule,
    fetchAllConceptsForForm: jest.fn(() => {
      return Promise.resolve(mockFormConcepts);
    }),
    fetchFormTranslations: jest.fn(() => {
      return Promise.resolve(mockFormTranslations);
    }),
  };
});
describe("Generic Form Display Control", () => {
  it("should match snapshot", async () => {
    const config = {
      formName: "Test Form",
    };
    const { container, getAllByText } = render(
      <IPDContext.Provider
        value={{
          allFormsSummary: allFormsSummaryMock,
          allFormsFilledInCurrentVisit: allFormsFilledInVisitMock,
          config: { enable24HourTime: true },
          isAllFormSummaryLoading: false,
          isAllFormsFilledInCurrentVisitLoading: false,
        }}
      >
        <IntlProvider locale={"en"}>
          <GenericFormsDisplayControl config={config} />
        </IntlProvider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getAllByText("Mock Provider")).toBeTruthy();
    });
    expect(container).toMatchSnapshot();
  });
});
