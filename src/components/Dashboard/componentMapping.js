import { lazy } from "react";

export const componentMapping = {
  PS: lazy(() =>
    import("../../features/DisplayControls/PatientSummary/PatientSummary")
  ),
  VT: lazy(() => import("../../features/DisplayControls/Vitals/Vitals")),
  AL: lazy(() => import("../../features/DisplayControls/Allergies/Allergies")),
};
