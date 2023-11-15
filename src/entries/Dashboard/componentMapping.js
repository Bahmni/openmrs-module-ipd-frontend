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
  [componentKeys.NURSING_TASKS]: lazy(() =>
    import(
      "../../features/DisplayControls/NursingTasks/components/NursingTasks"
    )
  ),
};
