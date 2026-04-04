/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import { PRIVILEGE_CONSTANTS } from "../constants";

export const mockUserWithAllRequiredPrivileges = {
  username: "mockUserWithAllRequiredPrivileges",
  privileges: [
    {
      name: PRIVILEGE_CONSTANTS.ADT,
      retired: false,
    },
    {
      name: PRIVILEGE_CONSTANTS.EDIT_MEDICATION_TASKS,
      retired: false,
    },
    {
      name: PRIVILEGE_CONSTANTS.ADD_TASKS,
      retired: false,
    },
    {
      name: PRIVILEGE_CONSTANTS.EDIT_ADHOC_MEDICATION_TASKS,
      retired: false,
    },
    {
      name: PRIVILEGE_CONSTANTS.EDIT_TASKS,
      retired: false,
    },
    {
      name: PRIVILEGE_CONSTANTS.EDIT_MEDICATION_ADMINISTRATION,
      retired: false,
    },
  ],
};

export const mockUserWithoutAnyPrivilege = {
  username: "mockUserWithoutADTPrivilege",
  privileges: [],
};
