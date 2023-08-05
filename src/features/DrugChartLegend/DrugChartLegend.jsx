import React from "react";
import AdministeredIcon from "../../icons/administered.svg";
import AdministeredLateIcon from "../../icons/administered-late.svg";
import LateIcon from "../../icons/late.svg";
import NotAdministeredIcon from "../../icons/not-administered.svg";
import PendingIcon from "../../icons/pending.svg";
import "./DrugChartLegend.scss";

export default function DrugChartLegend() {
  return (
    <div className={"drug-chart-legend"}>
      <div>
        <AdministeredIcon />
        Administered
      </div>
      <div>
        <NotAdministeredIcon />
        Not - Administered
      </div>
      <div>
        <LateIcon />
        Late
      </div>
      <div>
        <AdministeredLateIcon />
        Administered Late
      </div>
      <div>
        <PendingIcon />
        Pending
      </div>
    </div>
  );
}
