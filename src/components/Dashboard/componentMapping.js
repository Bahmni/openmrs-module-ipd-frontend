import { lazy } from "react";

export const componentMapping = {
  DG: lazy(() => import("../../features/DisplayControls/Diagnosis/Diagnosis")),
};
