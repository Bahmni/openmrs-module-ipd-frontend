/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


// mock the fetch global using jest
require("jest-fetch-mock").enableMocks();

// mock out i18n module with __mock__ based files
jest.mock("./features/i18n/utils");
