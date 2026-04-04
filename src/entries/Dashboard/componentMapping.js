/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import { lazy } from "react";
import { componentKeys } from "../../constants";

export const componentMapping = {
  [componentKeys.DIAGNOSIS]: lazy(() =>
    import("../../features/DisplayControls/Diagnosis/components/Diagnosis")
  ),
  [componentKeys.TREATMENTS]: lazy(() =>
    import("../../features/DisplayControls/Treatments/components/Treatments")
  ),
  [componentKeys.ALLERGIES]: lazy(() =>
    import("../../features/DisplayControls/Allergies/components/Allergies")
  ),
  [componentKeys.VITALS]: lazy(() =>
    import("../../features/DisplayControls/Vitals/components/Vitals")
  ),
  [componentKeys.NURSING_TASKS]: lazy(() =>
    import(
      "../../features/DisplayControls/NursingTasks/components/NursingTasks"
    )
  ),
  [componentKeys.DRUG_CHART]: lazy(() =>
    import("../../features/DisplayControls/DrugChart/components/DrugChartView")
  ),
  [componentKeys.INTAKE_OUTPUT]: lazy(() =>
    import(
      "../../features/DisplayControls/IntakeOutput/components/IntakeOutput"
    )
  ),
  [componentKeys.NUTRITION_ADVICE_FORM]: lazy(() =>
    import(
      "../../features/DisplayControls/GenericFormsDisplayControl/components/GenericFormsDisplayControl"
    )
  ),
  [componentKeys.PATIENT_FEEDING_RECORD]: lazy(() =>
    import(
      "../../features/DisplayControls/PatientFeedingRecord/components/PatientFeedingRecord"
    )
  ),
};
