import { lazy } from "react";

export const componentMapping = {
  DG: lazy(() =>
    import("../../features/DisplayControls/Diagnosis/components/Diagnosis")
  ),
  TR: lazy(() =>
    import("../../features/DisplayControls/Treatments/components/Treatments")
  ),
  AL: lazy(() =>
    import("../../features/DisplayControls/Allergies/components/Allergies")
  ),
};
