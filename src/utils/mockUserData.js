export const mockUserWithAllRequiredPrivileges = {
  username: "mockUserWithAllRequiredPrivileges",
  privileges: [
    {
      name: "app:adt",
      retired: false,
    },
    {
      name: "Edit Medication Tasks",
      retired: false,
    },
  ],
};

export const mockUserWithoutAnyPrivilege = {
  username: "mockUserWithoutADTPrivilege",
  privileges: [],
};
