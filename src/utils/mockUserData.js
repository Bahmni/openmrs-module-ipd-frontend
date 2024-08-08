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
    {
      name: "Add Tasks",
      retired: false,
    },
    {
      name: "Edit adhoc medication tasks",
      retired: false,
    },
  ],
};

export const mockUserWithoutAnyPrivilege = {
  username: "mockUserWithoutADTPrivilege",
  privileges: [],
};
