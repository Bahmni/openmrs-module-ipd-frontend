import { getColumnData } from "../../CareViewSummary/utils/CareViewSummary";
import React, { useContext } from "react";
import Clock from "../../../icons/clock.svg";
import { epochTo24HourTimeFormat } from "../../../utils/DateTimeUtils";
import { getAdministrationStatus } from "../../../utils/CommonUtils";
import SVGIcon from "../../SVGIcon/SVGIcon";
import { CareViewContext } from "../../../context/CareViewContext";
import propTypes from "prop-types";

export const SlotDetailsCell = ({
  uuid,
  slotDetails,
  timeframeLimitInHours,
  navHourEpoch,
}) => {
  const columns = [];
  const { ipdConfig } = useContext(CareViewContext);

  const patientSlotDetail = slotDetails?.find(
    (slotDetail) => slotDetail.patientUuid === uuid
  );

  for (let i = 0; i < timeframeLimitInHours; i++) {
    const startTime = navHourEpoch.startHourEpoch + i * 3600;
    if (startTime < navHourEpoch.endHourEpoch) {
      const endTime = startTime + 3600;

      if (patientSlotDetail) {
        const columnData = patientSlotDetail.prescribedOrderSlots.flatMap(
          (slot) => getColumnData(slot, startTime, endTime)
        );
        columns.push({ startTime, endTime, columnData });
      } else {
        columns.push({ startTime, endTime, columnData: [] });
      }
    }
  }

  const renderStatusIcon = (slot) => {
    const { drugChart = {} } = ipdConfig;
    const { startTime, status, medicationAdministration } = slot;
    let administrationStatus = getAdministrationStatus(
      medicationAdministration,
      status,
      startTime,
      drugChart,
      slot
    );
    return (
      <div className="status-icon">
        <SVGIcon iconType={administrationStatus} />
      </div>
    );
  };

  const renderColumnData = (columnData) => {
    columnData.sort((a, b) => a.startTime - b.startTime);

    return columnData.map((slotItem) => {
      const { dose, doseUnits, route } = slotItem.order;
      return (
        <div className="slot-details" key={`${slotItem.uuid}`}>
          <div className="logo">
            {renderStatusIcon(slotItem)}
            <Clock className="clock-icon" />
          </div>
          <span>{epochTo24HourTimeFormat(slotItem.startTime)}</span>
          <div className="drug-details-wrapper">
            <span>{slotItem.order.drug.display}</span>
            <div className="drug-details" data-testid="drug-details">
              {dose && <span className="drug-detail">{dose}</span>}
              {doseUnits && (
                <span className="drug-detail">{doseUnits?.display}</span>
              )}
              {route && (
                <span className="drug-detail">
                  {route?.display && `  |  ${route.display}`}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return columns.map(({ columnData }, index) => (
    <td className="slot-details-container" key={index}>
      {renderColumnData(columnData)}
    </td>
  ));
};

SlotDetailsCell.propTypes = {
  uuid: propTypes.string.isRequired,
  slotDetails: propTypes.object.isRequired,
  timeframeLimitInHours: propTypes.number.isRequired,
  navHourEpoch: propTypes.object.isRequired,
};
