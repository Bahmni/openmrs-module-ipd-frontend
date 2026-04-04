/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import AdministeredIcon from "../../icons/completed.svg";

import AdministeredLateIcon from "../../icons/administered-late.svg";
import LateIcon from "../../icons/late.svg";
import NotAdministeredIcon from "../../icons/missed.svg";
import PendingIcon from "../../icons/pending.svg";
import StoppedIcon from "../../icons/stopped.svg";
import "./AdministrationLegend.scss";
import { FormattedMessage } from "react-intl";

export default function AdministrationLegend() {
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
        <FormattedMessage id="COMPLETED" defaultMessage={"Completed"} />
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
      <div>
        <StoppedIcon />
        <FormattedMessage id="STOPPED" defaultMessage={"Stopped"} />
      </div>
    </div>
  );
}
