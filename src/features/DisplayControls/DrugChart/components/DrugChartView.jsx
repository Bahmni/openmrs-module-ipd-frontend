import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Button, Loading } from "carbon-components-react";
import { ChevronLeft16, ChevronRight16, Time16 } from "@carbon/icons-react";
import DrugChart from "./DrugChart";
import {
  fetchMedications,
  getDateTime,
  currentShiftHoursArray,
  getUpdatedShiftArray,
  getNextShiftDetails,
  getPreviousShiftDetails,
  transformDrugOrders,
  mapDrugOrdersAndSlots,
  isCurrentShift,
  NotCurrentShiftMessage,
  setCurrentShiftTimes,
  canAcknowledgeAmendment,
  prepareSlotData,
} from "../utils/DrugChartUtils";
import {
  convertDaystoSeconds,
  formatDate,
} from "../../../../utils/DateTimeUtils";
import { FormattedMessage } from "react-intl";
import { AllMedicationsContext } from "../../../../context/AllMedications";
import "../styles/DrugChartView.scss";
import { IPDContext } from "../../../../context/IPDContext";
import { SliderContext } from "../../../../context/SliderContext";
import { DrugChartSlotContext } from "../../../../context/DrugChartSlotContext";
import {
  ForbiddenErrorMessage,
  GenericErrorMessage,
  displayShiftTimingsFormat,
  errorCodes,
  timeFormatFor12Hr,
  componentKeys,
  sliderTypes,
} from "../../../../constants";
import WarningIcon from "../../../../icons/warning.svg";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import Notification from "../../../../components/Notification/Notification";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import DrugChartSlider from "./DrugChartSlider";

const NoMedicationTaskMessage = (
  <FormattedMessage
    id={"NO_MEDICATION_DRUG_CHART_MESSAGE"}
    defaultMessage={"No Medication has been scheduled in this shift"}
  />
);

const SCROLL_TO_SECTION_DELAY_MS = 700;
const DEEP_LINK_BUFFER_MILLISECONDS = 5;

export default function DrugChartWrapper(props) {
  const { patientId } = props;
  const {
    config,
    isReadMode,
    visitSummary,
    visit,
    deepLinkParams,
    privileges,
    scrollToSection,
  } = useContext(IPDContext);
  const {
    isSliderOpen,
    updateSliderOpen,
    sliderContentModified,
    setSliderContentModified,
  } = useContext(SliderContext);
  const {
    shiftDetails: shiftConfig = {},
    drugChart = {},
    enable24HourTime = {},
  } = config;
  const [drugChartData, setDrugChartData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [drugOrders, setDrugOrders] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [startEndDates, updatedStartEndDates] = useState({
    startDate: isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    endDate: isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
  });
  const [errorMessage, setErrorMessage] = useState("");
  const allMedications = useContext(AllMedicationsContext);
  const shiftDetails = currentShiftHoursArray(
    isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    shiftConfig
  );
  const allowedForthShfts =
    getDateTime(new Date(), shiftDetails.currentShiftHoursArray[0]) / 1000 +
    convertDaystoSeconds(2);
  const [nextShiftMaxHour] = useState(
    isReadMode ? visitSummary.stopDateTime / 1000 : allowedForthShfts
  );
  const [isShiftButtonsDisabled, setIsShiftButtonsDisabled] = useState({
    previous: false,
    next: isReadMode ? true : false,
  });

  const [currentShiftArray, updateShiftArray] = useState(
    shiftDetails.currentShiftHoursArray
  );

  const shiftRangeArray = shiftDetails.rangeArray;
  const [shiftIndex, updateShiftIndex] = useState(shiftDetails.shiftIndex);
  const [notCurrentShift, setNotCurrentShift] = useState(false);
  const [selectedSlotData, setSelectedSlotData] = useState(null);
  const [showAmendmentWarning, setShowAmendmentWarning] = useState(false);
  const [showAcknowledgementWarning, setShowAcknowledgementWarning] =
    useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPrivilegeWarning, setShowPrivilegeWarning] = useState(false);
  const refreshDisplayControl = useContext(RefreshDisplayControl);

  const updateAmendmentSlider = (value) => {
    updateSliderOpen((prev) => {
      return {
        ...prev,
        drugChartNoteAmendment: value,
      };
    });
  };

  const updateAcknowledgementSlider = (value) => {
    updateSliderOpen((prev) => {
      return {
        ...prev,
        drugChartNoteAcknowledgement: value,
      };
    });
  };

  const updateHistoryViewer = (value) => {
    updateSliderOpen((prev) => {
      return {
        ...prev,
        drugChartNoteHistory: value,
      };
    });
  };

  const sliderCloseActions = {
    onCancel: () => {
      setShowAmendmentWarning(false);
      updateAmendmentSlider(false);
    },
    onClose: () => {
      setShowAmendmentWarning(false);
    },
  };

  const amendmentSliderActions = {
    onModalClose: () => {
      sliderContentModified.drugChartNoteAmendment
        ? setShowAmendmentWarning(true)
        : updateAmendmentSlider(false);
    },
    onModalCancel: () => {
      sliderContentModified.drugChartNoteAmendment
        ? setShowAmendmentWarning(true)
        : updateAmendmentSlider(false);
    },
    onModalSave: () => {
      updateAmendmentSlider(false);
      setSuccessMessage("NOTE_AMENDMENT_SAVED_SUCCESS");
      setShowSuccessNotification(true);
      callFetchMedications(startEndDates.startDate, startEndDates.endDate);
    },
  };

  const acknowledgementSliderCloseActions = {
    onCancel: () => {
      setShowAcknowledgementWarning(false);
      updateAcknowledgementSlider(false);
    },
    onClose: () => {
      setShowAcknowledgementWarning(false);
    },
  };

  const acknowledgementSliderActions = {
    onModalClose: () => {
      sliderContentModified.drugChartNoteAcknowledgement
        ? setShowAcknowledgementWarning(true)
        : updateAcknowledgementSlider(false);
    },
    onModalCancel: () => {
      sliderContentModified.drugChartNoteAcknowledgement
        ? setShowAcknowledgementWarning(true)
        : updateAcknowledgementSlider(false);
    },
    onModalSave: () => {
      updateAcknowledgementSlider(false);
      setSuccessMessage("NOTE_ACKNOWLEDGEMENT_SAVED_SUCCESS");
      setShowSuccessNotification(true);
      callFetchMedications(startEndDates.startDate, startEndDates.endDate);
    },
  };

  const notesHistorySliderActions = {
    onModalClose: () => {
      updateHistoryViewer(false);
    },
  };

  const clearDeepLinkParams = () => {
    const url = new URL(window.location.href);
    const hash = url.hash.split("?")[0];
    window.history.replaceState(null, "", url.origin + url.pathname + hash);
  };

  const handleSlotClick = (slot, rowData) => {
    const clickableStatuses = [
      "Administered",
      "Administered-Late",
      "Not-Administered",
    ];
    if (!clickableStatuses.includes(slot.administrationSummary?.status)) {
      return;
    }

    const action = slot.clickAction || slot.originalSlot?.clickAction;
    setSelectedSlotData(prepareSlotData(slot, rowData, enable24HourTime));

    if (action === "acknowledge") {
      setSliderContentModified((prevState) => ({
        ...prevState,
        drugChartNoteAcknowledgement: false,
      }));
      updateAcknowledgementSlider(true);
    } else if (action === "amend") {
      setSliderContentModified((prevState) => ({
        ...prevState,
        drugChartNoteAmendment: false,
      }));
      updateAmendmentSlider(true);
    } else if (action === "viewHistory") {
      updateHistoryViewer(true);
    } else {
      const hasAmendment =
        slot?.medicationAdministration?.amendedNotes?.length > 0 &&
        slot?.medicationAdministration?.amendedNotes.some(
          (note) => note?.amendedText && note?.approvalStatus === "PENDING"
        );

      if (hasAmendment) {
        setSliderContentModified((prevState) => ({
          ...prevState,
          drugChartNoteAcknowledgement: false,
        }));
        updateAcknowledgementSlider(true);
      } else {
        setSliderContentModified((prevState) => ({
          ...prevState,
          drugChartNoteAmendment: false,
        }));
        updateAmendmentSlider(true);
      }
    }

    if (slot.clickAction) delete slot.clickAction;
    if (slot.originalSlot?.clickAction) delete slot.originalSlot.clickAction;
  };

  const callFetchMedications = async (startDateTime, endDateTime) => {
    const startDateTimeInSeconds = startDateTime / 1000;
    const endDateTimeInSeconds = endDateTime / 1000 - 60;
    try {
      const response = await fetchMedications(
        patientId,
        startDateTimeInSeconds,
        endDateTimeInSeconds,
        visit
      );
      if (response?.error) {
        if (response.error.response.status === errorCodes.FORBIDDEN) {
          setErrorMessage(ForbiddenErrorMessage);
        } else {
          setErrorMessage(GenericErrorMessage);
        }
      } else {
        setDrugChartData(response.data);
        setIsShiftButtonsDisabled({
          previous:
            (isReadMode && response.data.length === 0) ||
            response.data[0].startDate > startDateTimeInSeconds,
          next:
            startDateTimeInSeconds >= nextShiftMaxHour ||
            endDateTimeInSeconds >= nextShiftMaxHour,
        });
      }
    } catch (e) {
      return e;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setTransformedData(
      mapDrugOrdersAndSlots(drugChartData, drugOrders, drugChart)
    );
  }, [drugChartData, drugOrders]);

  useEffect(() => {
    const orders = allMedications.data;
    if (orders) {
      setDrugOrders(transformDrugOrders(orders));
    }
  }, [allMedications.data]);

  useEffect(() => {
    const [startDateTime, endDateTime] = setCurrentShiftTimes(
      shiftDetails,
      isReadMode,
      visitSummary
    );
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  }, []);

  // Handle deep link to open acknowledgement slider
  useEffect(() => {
    const handleDeepLink = async () => {
      if (
        !deepLinkParams?.openAcknowledge ||
        !deepLinkParams?.medicationAdministrationNoteUUID ||
        !deepLinkParams?.medicationAdministrationEpoch
      ) {
        return;
      }

      const deepLinkKey =
        deepLinkParams.medicationAdministrationNoteUUID +
        "-" +
        deepLinkParams.medicationAdministrationEpoch;
      if (window.__processedDeepLink === deepLinkKey) {
        return;
      }

      try {
        const epochTime =
          Number(deepLinkParams.medicationAdministrationEpoch) / 1000;
        const response = await fetchMedications(
          patientId,
          epochTime - DEEP_LINK_BUFFER_MILLISECONDS,
          epochTime + DEEP_LINK_BUFFER_MILLISECONDS,
          visit
        );

        if (response?.error) {
          if (response.error.response?.status === errorCodes.FORBIDDEN) {
            setErrorMessage(ForbiddenErrorMessage);
          } else {
            setErrorMessage(GenericErrorMessage);
          }
          return;
        }

        const medicationData = response.data;
        if (!medicationData || medicationData.length === 0) {
          return;
        }

        const transformedMedications = mapDrugOrdersAndSlots(
          medicationData,
          drugOrders,
          drugChart
        );

        let foundSlot = null;
        let foundRowData = null;
        for (const medication of transformedMedications) {
          const slot = medication.slots?.find((s) =>
            s.medicationAdministration?.notes?.some(
              (note) =>
                note.uuid === deepLinkParams.medicationAdministrationNoteUUID
            )
          );
          if (slot) {
            foundSlot = slot;
            foundRowData = medication;
            break;
          }
        }

        if (!foundSlot || !foundRowData) {
          return;
        }

        window.__processedDeepLink = deepLinkKey;
        if (!canAcknowledgeAmendment(privileges)) {
          setShowPrivilegeWarning(true);
          clearDeepLinkParams();
          return;
        }

        setSelectedSlotData(
          prepareSlotData(foundSlot, foundRowData, enable24HourTime)
        );

        setSliderContentModified((prevState) => ({
          ...prevState,
          drugChartNoteAcknowledgement: false,
        }));
        updateAcknowledgementSlider(true);

        if (scrollToSection) {
          setTimeout(() => {
            scrollToSection(componentKeys.DRUG_CHART);
          }, SCROLL_TO_SECTION_DELAY_MS);
        }

        clearDeepLinkParams();
      } catch (e) {
        console.error("Error handling deep link:", e);
      }
    };

    handleDeepLink();
  }, [deepLinkParams, drugOrders]);

  const handlePrevious = () => {
    const { startDateTime, endDateTime, previousShiftIndex } =
      getPreviousShiftDetails(
        shiftRangeArray,
        shiftIndex,
        startEndDates.startDate,
        startEndDates.endDate
      );
    const previousShiftRange = shiftRangeArray[previousShiftIndex];
    const previousShiftArray = getUpdatedShiftArray(previousShiftRange);
    isCurrentShift(shiftDetails, startDateTime, endDateTime)
      ? setNotCurrentShift(false)
      : setNotCurrentShift(true);
    updateShiftArray(previousShiftArray);
    updateShiftIndex(previousShiftIndex);
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  const handleNext = () => {
    const { startDateTime, endDateTime, nextShiftIndex } = getNextShiftDetails(
      shiftRangeArray,
      shiftIndex,
      startEndDates.startDate,
      startEndDates.endDate
    );
    const nextShiftRange = shiftRangeArray[nextShiftIndex];
    const nextShiftArray = getUpdatedShiftArray(nextShiftRange);
    isCurrentShift(shiftDetails, startDateTime, endDateTime)
      ? setNotCurrentShift(false)
      : setNotCurrentShift(true);
    updateShiftArray(nextShiftArray);
    updateShiftIndex(nextShiftIndex);
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  const handleCurrent = () => {
    const shiftDetailsObj = currentShiftHoursArray(
      isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
      shiftConfig
    );
    const currentShift = shiftDetailsObj.currentShiftHoursArray;
    const updatedShiftIndex = shiftDetailsObj.shiftIndex;
    const [start, end] =
      shiftDetails.rangeArray[shiftDetails.shiftIndex].split("-");
    const [startHour, startMinute] = start.split(":");
    const [endHour, endMinute] = end.split(":");
    const firstHour = `${startHour}:${startMinute}`;
    const lastHour = `${endHour}:${endMinute}`;
    let startDateTime = getDateTime(new Date(), firstHour);
    let endDateTime = getDateTime(new Date(), lastHour);
    if (lastHour < firstHour) {
      const d = new Date();
      const currentHour = d.getHours();
      if (currentHour > 12) {
        d.setDate(d.getDate() + 1);
        endDateTime = getDateTime(d, lastHour);
      } else {
        d.setDate(d.getDate() - 1);
        startDateTime = getDateTime(d, firstHour);
      }
    }
    setNotCurrentShift(false);
    updateShiftArray(currentShift);
    updateShiftIndex(updatedShiftIndex);
    setLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    callFetchMedications(startDateTime, endDateTime);
  };

  const shiftTiming = () => {
    let shiftStartDateTime = formatDate(
      startEndDates.startDate,
      displayShiftTimingsFormat
    );
    let shiftEndDateTime = formatDate(
      startEndDates.endDate - 60,
      displayShiftTimingsFormat
    );
    const [shiftStartDate, shiftStartTime] = shiftStartDateTime.split(" | ");
    const [shiftEndDate, shiftEndTime] = shiftEndDateTime.split(" | ");

    const formattedShiftStartTime = enable24HourTime
      ? shiftStartTime
      : formatDate(startEndDates.startDate, timeFormatFor12Hr);

    const formattedShiftEndTime = enable24HourTime
      ? shiftEndTime
      : formatDate(startEndDates.endDate - 60, timeFormatFor12Hr);

    if (shiftStartDate === shiftEndDate) {
      return (
        <div className="shift-timing">
          {notCurrentShift && (
            <div className="not-current-shift-message-div">
              <WarningIcon />
              <span className="not-current-shift-message">
                {NotCurrentShiftMessage}
              </span>
            </div>
          )}
          <div className="shift-time">
            {shiftStartDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftStartTime} <span className="to-text">to</span>{" "}
            <Time16 /> {formattedShiftEndTime}
          </div>
        </div>
      );
    } else {
      return (
        <div className="shift-timing">
          {notCurrentShift && (
            <div className="not-current-shift-message-div">
              <WarningIcon />
              <span className="not-current-shift-message">
                {NotCurrentShiftMessage}
              </span>
            </div>
          )}
          <div className="shift-time">
            {shiftStartDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftStartTime} <span className="to-text">to</span>{" "}
            {shiftEndDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftEndTime}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="drugchart-parent-container display-container">
      <div className="drugchart-shift-header">
        <Button
          kind="tertiary"
          isExpressive
          size="small"
          onClick={handleCurrent}
          className="margin-right-10"
          data-testid="currentShift"
          disabled={isReadMode}
        >
          <FormattedMessage
            id={"CURRENT_SHIFT"}
            defaultMessage={"Current Shift"}
          />
        </Button>
        <Button
          renderIcon={ChevronLeft16}
          kind="tertiary"
          isExpressive
          hasIconOnly
          size="sm"
          onClick={handlePrevious}
          className="margin-right-6"
          data-testid="previousButton"
          disabled={isShiftButtonsDisabled.previous}
        />
        <Button
          renderIcon={ChevronRight16}
          kind="tertiary"
          isExpressive
          hasIconOnly
          size="sm"
          onClick={handleNext}
          className="margin-right-10"
          data-testid="nextButton"
          disabled={isShiftButtonsDisabled.next}
        />
        {shiftTiming()}
      </div>
      {isLoading ? (
        <div className="loading-parent" data-testid="loading-icon">
          <Loading withOverlay={false} />
        </div>
      ) : transformedData && transformedData.length === 0 ? (
        <div className="no-nursing-tasks">
          {errorMessage ? errorMessage : NoMedicationTaskMessage}
        </div>
      ) : (
        <DrugChartSlotContext.Provider value={{ onSlotClick: handleSlotClick }}>
          <DrugChart
            drugChartData={transformedData}
            currentShiftArray={currentShiftArray}
            selectedDate={startEndDates.startDate}
            shiftIndex={shiftIndex}
          />
        </DrugChartSlotContext.Provider>
      )}
      {isSliderOpen?.drugChartNoteAmendment && (
        <DrugChartSlider
          hostData={selectedSlotData}
          hostApi={amendmentSliderActions}
          sliderType={sliderTypes.AMENDMENT}
        />
      )}
      {showAmendmentWarning && (
        <SideBarPanelClose
          className="warning-notification"
          open={true}
          message={
            <FormattedMessage
              id="AMENDMENT_WARNING_TEXT"
              defaultMessage="You will lose the details entered. Do you want to continue?"
            />
          }
          label={""}
          primaryButtonText={<FormattedMessage id="NO" defaultMessage="No" />}
          secondaryButtonText={
            <FormattedMessage id="YES" defaultMessage="Yes" />
          }
          onSubmit={sliderCloseActions.onClose}
          onSecondarySubmit={sliderCloseActions.onCancel}
          onClose={sliderCloseActions.onClose}
        />
      )}
      {showSuccessNotification && (
        <Notification
          hostData={{
            notificationKind: "success",
            messageId: successMessage,
          }}
          hostApi={{
            onClose: () => {
              setShowSuccessNotification(false);
              refreshDisplayControl([
                componentKeys.NURSING_TASKS,
                componentKeys.DRUG_CHART,
              ]);
            },
          }}
        />
      )}

      {isSliderOpen?.drugChartNoteAcknowledgement && (
        <DrugChartSlider
          hostData={selectedSlotData}
          hostApi={acknowledgementSliderActions}
          sliderType={sliderTypes.ACKNOWLEDGEMENT}
        />
      )}
      {showAcknowledgementWarning && (
        <SideBarPanelClose
          className="warning-notification"
          open={true}
          message={
            <FormattedMessage
              id="ACKNOWLEDGEMENT_WARNING_TEXT"
              defaultMessage="You will lose the details entered. Do you want to continue?"
            />
          }
          label={""}
          primaryButtonText={<FormattedMessage id="NO" defaultMessage="No" />}
          secondaryButtonText={
            <FormattedMessage id="YES" defaultMessage="Yes" />
          }
          onSubmit={acknowledgementSliderCloseActions.onClose}
          onSecondarySubmit={acknowledgementSliderCloseActions.onCancel}
          onClose={acknowledgementSliderCloseActions.onClose}
        />
      )}
      {showSuccessNotification && (
        <Notification
          hostData={{
            notificationKind: "success",
            messageId: successMessage,
          }}
          hostApi={{
            onClose: () => {
              setShowSuccessNotification(false);
              refreshDisplayControl([
                componentKeys.NURSING_TASKS,
                componentKeys.DRUG_CHART,
              ]);
            },
          }}
        />
      )}
      {isSliderOpen?.drugChartNoteHistory && (
        <DrugChartSlider
          hostData={selectedSlotData}
          hostApi={notesHistorySliderActions}
          sliderType={sliderTypes.HISTORY}
        />
      )}
      {showPrivilegeWarning && (
        <Notification
          hostData={{
            notificationKind: "warning",
            messageId: "INSUFFICIENT_PRIVILEGE_TO_ACKNOWLEDGE",
            defaultMessage:
              "You do not have sufficient privileges to acknowledge medication notes",
          }}
          hostApi={{
            onClose: () => {
              setShowPrivilegeWarning(false);
            },
          }}
        />
      )}
    </div>
  );
}
DrugChartWrapper.propTypes = {
  patientId: PropTypes.string.isRequired,
  visitId: PropTypes.string.isRequired,
};
