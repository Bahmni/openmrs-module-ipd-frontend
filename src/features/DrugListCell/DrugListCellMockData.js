/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


export const testDrugInfo = {
  drugName: "Suxamethonium Chloride 100 mg/2 mL Ampoule (50 mg/mL )",
  drugRoute: "Intravenous",
  administrationInfo: [],
  duration: "4 Day(s)",
  dosage: 2,
  doseType: "mg",
};

export const testDrugInfoWithAdministeredLateStatus = {
  drugName: "Enalapril 5 mg Tablet",
  drugRoute: "Oral",
  administrationInfo: [
    {
      time: 8.45,
      kind: "Administered-Late",
    },
  ],
  duration: "4 Day(s)",
  dosage: 1,
  doseType: "Tablet(s)",
};

export const testDrugInfoWithAdministeredStatus = {
  drugName: "Enalapril 5 mg Tablet",
  drugRoute: "Oral",
  administrationInfo: [
    {
      time: 8.45,
      kind: "Administered",
    },
  ],
  duration: "4 Day(s)",
  dosage: 1,
  doseType: "Tablet(s)",
};
