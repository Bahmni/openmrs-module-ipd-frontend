/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import { render } from "@testing-library/react";
import { DrugDetails } from "../components/DrugDetails";

const mockHostData = {
  drugOrder: {
    drug: {
      name: "drugName",
    },
    uniformDosingType: {
      dose: "dose",
      doseUnits: "doseUnits",
    },
    route: "route",
    duration: "duration",
  },
};

describe("DrugDetails", () => {
  it("should match snapshot", () => {
    const { container } = render(<DrugDetails hostData={mockHostData} />);
    expect(container).toMatchSnapshot();
  });
});
