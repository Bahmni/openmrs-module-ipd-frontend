/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import { render } from "@testing-library/react";
import React from "react";
import DiagnosisExpandableRow from "../components/DiagnosisExpandableRow";

describe("ExpandableRowData", () => {
  it("should render ExpandableRowData component", async () => {
    render(<DiagnosisExpandableRow data={[]} />);
  });
});
