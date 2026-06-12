import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import Clock from "../../../../icons/clock.svg";
import "../styles/DrugListCell.scss";
import { TooltipDefinition, Tooltip, Tag } from "carbon-components-react";
import NoteIcon from "../../../../icons/note.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import { IPDContext } from "../../../../context/IPDContext";
import { timeFormatFor12Hr, timeFormatFor24Hr } from "../../../../constants";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { fhirDosageToDisplayStage } from "../../../../utils/FhirDosingUtils";

export default function DrugListCell(props) {
  const {
    dosingInstructions,
    duration,
    name,
    slots,
    notes,
    orderReasonText,
    isVariableDose,
    fhirDosages,
    stageSchedules,
  } = props.drugInfo;
  const { instructions, dosage, doseUnits, route } = dosingInstructions;
  const { config } = useContext(IPDContext);
  const { enable24HourTime = {} } = config;
  const noteIconRef = useRef(null);
  const [tooltipDirection, setTooltipDirection] = useState("bottom");

  const vdpStages = isVariableDose
    ? (fhirDosages || []).map(fhirDosageToDisplayStage)
    : [];
  const hasLoadingDose = vdpStages.some((s) => s.isLoadingDose);
  const loadingDoseStageName = vdpStages.find((s) => s.isLoadingDose)?.stageName;
  const totalDays = vdpStages.reduce((sum, s) => sum + s.durationDays, 0);

  const buildStageTooltipContent = () => {
    if (!fhirDosages || fhirDosages.length === 0) return null;
    const sections = fhirDosages
      .map((dosage, i) => ({ dosage, stage: vdpStages[i] }))
      .reverse()
      .map(({ dosage, stage }) => {
        const stageStatus = stageSchedules?.find(
          (s) => s.variableDosageSequence === dosage.sequence
        );
        const hasContent =
          stage.instructions ||
          stage.rate ||
          stage.additives ||
          stage.additionalInstructions ||
          stageStatus?.notes;
        if (!hasContent) return null;
        const stageLabel = stage.isLoadingDose
          ? stage.stageName
          : `Stage ${dosage.sequence - (hasLoadingDose ? 1 : 0)}`;
        return (
          <div key={dosage.sequence} className="vdp-tooltip-stage">
            <div className="vdp-tooltip-stage-header">{stageLabel}:</div>
            {stage.instructions && (
              <>Instructions:&nbsp;{stage.instructions}</>
            )}
            {stage.rate && (
              <>
                <div className="tooltip-content-separater" />
                <>Rate (ml/hr):&nbsp;{stage.rate} ml/hr</>
              </>
            )}
            {stage.additives && (
              <>
                <div className="tooltip-content-separater" />
                <>Additives:&nbsp;{stage.additives}</>
              </>
            )}
            {stage.additionalInstructions && (
              <>
                <div className="tooltip-content-separater" />
                <>Additional Instructions:&nbsp;{stage.additionalInstructions}</>
              </>
            )}
            {stageStatus?.notes && (
              <>
                <div className="tooltip-content-separater" />
                <>Notes:&nbsp;{stageStatus.notes}</>
              </>
            )}
          </div>
        );
      })
      .filter(Boolean);
    return sections.length > 0 ? <div>{sections}</div> : null;
  };

  const stageTooltipContent = isVariableDose ? buildStageTooltipContent() : null;

  const showInstructionsIcon = isVariableDose
    ? stageTooltipContent !== null
    : instructions?.instructions ||
      instructions?.additionalInstructions ||
      instructions?.rate ||
      instructions?.additives ||
      notes ||
      orderReasonText;

  useEffect(() => {
    if (!showInstructionsIcon) return;
    const updateDirection = () => {
      if (!noteIconRef.current) return;
      const rect = noteIconRef.current.getBoundingClientRect();
      const next =
        rect.top > window.innerHeight - rect.bottom ? "top" : "bottom";
      setTooltipDirection((prev) => (prev !== next ? next : prev));
    };
    updateDirection();
    window.addEventListener("scroll", updateDirection, true);
    return () => window.removeEventListener("scroll", updateDirection, true);
  }, [showInstructionsIcon]);

  const administrationInfo = [];
  slots.forEach((slot) => {
    if (
      ["Administered", "Administered-Late"].includes(
        slot.administrationSummary.status
      )
    ) {
      administrationInfo.push({
        kind: slot.administrationSummary.status,
        time: enable24HourTime
          ? formatDate(slot.startTime * 1000, timeFormatFor24Hr)
          : formatDate(slot.startTime * 1000, timeFormatFor12Hr),
      });
    }
  });
  const toolTipContent = (
    <div>
      {dosingInstructions?.instructions?.instructions && (
        <>Instructions:&nbsp;{dosingInstructions?.instructions?.instructions}</>
      )}
      {dosingInstructions?.instructions?.additionalInstructions && (
        <>
          {dosingInstructions?.instructions?.instructions && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Additional Instructions:&nbsp;
          {dosingInstructions?.instructions?.additionalInstructions}
        </>
      )}
      {dosingInstructions?.instructions?.rate && (
        <>
          {(dosingInstructions?.instructions?.instructions ||
            dosingInstructions?.instructions?.additionalInstructions) && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Rate:&nbsp;{dosingInstructions?.instructions?.rate} ml/hr
        </>
      )}
      {dosingInstructions?.instructions?.additives && (
        <>
          {(dosingInstructions?.instructions?.instructions ||
            dosingInstructions?.instructions?.additionalInstructions ||
            dosingInstructions?.instructions?.rate) && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Additives:&nbsp;{dosingInstructions?.instructions?.additives}
        </>
      )}
      {orderReasonText && (
        <>
          {(dosingInstructions?.instructions?.instructions ||
            dosingInstructions?.instructions?.additionalInstructions) && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Stopped Notes:&nbsp;{orderReasonText}
        </>
      )}
      {notes && (
        <>
          <br />
          <div className="tooltip-content-separater" />
          Notes:&nbsp;
          {notes}
        </>
      )}
    </div>
  );
  const getMedicationName = () => {
    return (
      <div className="drug-name-container">
        <TooltipDefinition tooltipText={name} className={"name-tooltip"}>
          <div className={"drug-chart-drug-name"}>{name}</div>
        </TooltipDefinition>
        &nbsp;
        {showInstructionsIcon && (
          <div ref={noteIconRef} className="note-icon-container">
            <Tooltip
              direction={tooltipDirection}
              align="start"
              renderIcon={() => <NoteIcon />}
            >
              {isVariableDose ? stageTooltipContent : toolTipContent}
            </Tooltip>
          </div>
        )}
      </div>
    );
  };
  const getToolTipTextForAdministeredTime = () => {
    let administeredTimes = [];
    administrationInfo.map((adminInfo) => {
      let adminInfoTime = adminInfo.time;
      if (adminInfoTime && !enable24HourTime) {
        const [hours, minutes] = adminInfoTime.split(":");
        const hours12 = hours % 12 || 12;
        adminInfoTime = `${hours12}:${minutes}`;
      }
      administeredTimes.push(adminInfoTime);
    });
    return administeredTimes.join(", ");
  };
  return (
    <div className="drug-order-details">
      <div className="order-details">
        {getMedicationName()}
        <div>
          {isVariableDose ? (
            <>
              {hasLoadingDose && loadingDoseStageName && <span>{`${loadingDoseStageName} + `}</span>}
              <FormattedMessage
                id="VARIABLE_DOSE_STAGES_DAYS"
                defaultMessage="{stages} Stages - {days} Days"
                values={{ stages: vdpStages.filter((s) => !s.isLoadingDose).length, days: totalDays }}
              />
            </>
          ) : (
            <>
              {dosage}
              {doseUnits && ` - ${doseUnits}`}
              {route && ` - ${route}`}
              {duration && ` -  ${duration}`}
            </>
          )}
        </div>
        <div>
          {administrationInfo.length >= 1 && (
            <div className={"administration-details"}>
              <TooltipDefinition
                tooltipText={getToolTipTextForAdministeredTime()}
                className={"administration-details-tooltip"}
                direction="top"
              >
                <div className={"administration-time-info"}>
                  <Clock className={"clock-icon"} />
                  {administrationInfo.map((adminInfo, index) => {
                    let adminInfoTime = adminInfo.time;
                    if (adminInfoTime && !enable24HourTime) {
                      const [hours, minutes] = adminInfoTime.split(":");
                      const hours12 = hours % 12 || 12;
                      adminInfoTime = `${hours12}:${minutes}`;
                    }
                    if (adminInfo.kind === "Administered-Late") {
                      return (
                        <span style={{ color: "#FF0000" }} key={index}>
                          {adminInfoTime}
                          {index !== administrationInfo.length - 1 && (
                            <span style={{ color: "#525252" }}>, </span>
                          )}
                        </span>
                      );
                    } else {
                      return (
                        <span style={{ color: "#525252" }} key={index}>
                          {adminInfoTime}
                          {index !== administrationInfo.length - 1 && (
                            <span>, </span>
                          )}
                        </span>
                      );
                    }
                  })}
                </div>
              </TooltipDefinition>
            </div>
          )}
        </div>
      </div>
      <div className="medication-tags">
        {isVariableDose ? (
          <Tag type="blue" size="sm">
            <FormattedMessage
              id="VARIABLE_DOSAGE"
              defaultMessage="Variable Dosage"
            />
          </Tag>
        ) : (
          <DisplayTags drugOrder={dosingInstructions} />
        )}
      </div>
    </div>
  );
}
DrugListCell.propTypes = {
  drugInfo: PropTypes.object.isRequired,
};
