import {
  epochTo12HourTimeFormat,
  epochTo24HourTimeFormat,
} from "../../../utils/DateTimeUtils";
import React, { useContext } from "react";
import propTypes from "prop-types";
import { CareViewContext } from "../../../context/CareViewContext";
import { TASK_FILTER_HEADER } from "../../../constants";
import { ContentSwitcher, Switch } from "carbon-components-react";
import { useIntl } from "react-intl";

export const Header = ({ timeframeLimitInHours, navHourEpoch }) => {
  const {
    ipdConfig,
    taskFilterType = TASK_FILTER_HEADER.ALL,
    setTaskFilterType,
  } = useContext(CareViewContext);
  const { enable24HourTime = {} } = ipdConfig;
  const intl = useIntl();
  const taskFilterTypes = [
    TASK_FILTER_HEADER.ALL,
    TASK_FILTER_HEADER.NEW,
    TASK_FILTER_HEADER.PENDING,
  ];
  const selectedTaskFilterIndex = taskFilterTypes.indexOf(taskFilterType);
  return (
    <tr className="patient-row-container">
      <td
        className="patient-details-container"
        key="patient-details-header"
        data-testid="patient-details-header"
      >
        <ContentSwitcher
          onChange={(e) => setTaskFilterType && setTaskFilterType(e.name)}
          selectedIndex={
            selectedTaskFilterIndex >= 0 ? selectedTaskFilterIndex : 0
          }
          className="task-filter-switcher"
          data-testid="task-filter-switcher"
          size="sm"
        >
          <Switch
            name={TASK_FILTER_HEADER.ALL}
            text={intl.formatMessage({
              id: TASK_FILTER_HEADER.ALL,
              defaultMessage: "All",
            })}
            data-testid="filter-tab-all"
          />
          <Switch
            name={TASK_FILTER_HEADER.NEW}
            text={intl.formatMessage({
              id: TASK_FILTER_HEADER.NEW,
              defaultMessage: "New",
            })}
            data-testid="filter-tab-new"
          />
          <Switch
            name={TASK_FILTER_HEADER.PENDING}
            text={intl.formatMessage({
              id: TASK_FILTER_HEADER.PENDING,
              defaultMessage: "Pending",
            })}
            data-testid="filter-tab-pending"
          />
        </ContentSwitcher>
      </td>
      {Array.from({ length: timeframeLimitInHours }, (_, i) => {
        const startTime = navHourEpoch.startHourEpoch + i * 3600;
        if (startTime < navHourEpoch.endHourEpoch) {
          let headerKey = `slot-details-header-${i}`;
          return (
            <td
              className="slot-details-header"
              key={headerKey}
              data-testid={headerKey}
            >
              <div className="time" data-testid={`time-frame-${i}`}>
                {enable24HourTime
                  ? epochTo24HourTimeFormat(startTime, true)
                  : epochTo12HourTimeFormat(startTime, true)}
              </div>
            </td>
          );
        }
      })}
    </tr>
  );
};

Header.propTypes = {
  timeframeLimitInHours: propTypes.number.isRequired,
  navHourEpoch: propTypes.object.isRequired,
};
