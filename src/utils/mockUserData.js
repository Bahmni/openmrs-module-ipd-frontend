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
