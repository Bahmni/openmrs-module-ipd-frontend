import { lazy } from "react";

export const componentMapping = {
  PS: lazy(() =>
    import("../../features/DisplayControls/PatientSummary/PatientSummary")
  ),
  VT: lazy(() => import("../../features/DisplayControls/Vitals/Vitals")),
  TR: lazy(() =>
    import("../../features/DisplayControls/Treatments/components/Treatments")
  ),
  AL: lazy(() =>
    import("../../features/DisplayControls/Allergies/components/Allergies")
  ),
};
