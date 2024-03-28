import React from "react";
import AdministeredIcon from "../../icons/administered.svg";
import AdministeredLateIcon from "../../icons/administered-late.svg";
import LateIcon from "../../icons/late.svg";
import NotAdministeredIcon from "../../icons/not-administered.svg";
import PendingIcon from "../../icons/pending.svg";
import "./DrugChartLegend.scss";
import { FormattedMessage } from "react-intl";

export default function DrugChartLegend() {
  return (
    <div className={"drug-chart-legend"}>
      <div>
        <PendingIcon />
        <FormattedMessage id="PENDING" defaultMessage={"Pending"} />
      </div>
      <div>
        <LateIcon />
        <FormattedMessage id="LATE" defaultMessage={"Late"} />
      </div>
      <div>
        <AdministeredIcon />
        <FormattedMessage id="COMPLETED" defaultMessage={"COMPLETED"} />
      </div>
      <div>
        <AdministeredLateIcon />
        <FormattedMessage
          id="ADMINISTERED_LATE"
          defaultMessage={"Administered Late"}
        />
      </div>
      <div>
        <NotAdministeredIcon />
        <FormattedMessage
          id="NOT_ADMINISTERED"
          defaultMessage={"Not Administered"}
        />
      </div>
    </div>
  );
}
