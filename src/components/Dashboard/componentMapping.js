import { lazy } from "react";

export const componentMapping = {
  AL: lazy(() => import("../../features/DisplayControls/Allergies/Allergies")),
  TR: lazy(() =>
    import("../../features/DisplayControls/Treatments/components/Treatments")
  ),
  DG: lazy(() =>
    import("../../features/DisplayControls/Diagnosis/components/Diagnosis")
  ),
};
