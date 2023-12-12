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
};
