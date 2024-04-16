import axios from "axios";
import {
  MEDICATIONS_BASE_URL,
  ADMINISTERED_MEDICATIONS_BASE_URL,
  asNeededPlaceholderConceptName,
  NON_MEDICATION_BASE_URL,
} from "../../../../constants";
import moment from "moment";

export const fetchMedicationNursingTasks = async (
  patientUuid,
  startTime,
  endTime,
  visitUuid
) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&startTime=${startTime}&endTime=${endTime}&visitUuid=${visitUuid}`;
  try {
    const response = await axios.get(FETCH_MEDICATIONS_URL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchNonMedicationTasks = async (
  visitUuid,
  startTime,
  endTime
) => {
  const NON_MEDICATION_URL = `${NON_MEDICATION_BASE_URL}?visitUuid=${visitUuid}&startTime=${startTime}&endTime=${endTime}`;
  try {
    const response = await axios.get(NON_MEDICATION_URL);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetUTCEpochForDate = (viewDate) => moment.utc(viewDate).unix();

export const ExtractMedicationNursingTasksData = (
  medicationNursingTasksData,
  filterValue,
  isReadMode
) => {
  const extractedData = [],
    pendingExtractedData = [],
    prnExtractedData = [],
    completedExtractedData = [],
    stoppedExtractedData = [],
    skippedExtractedData = [],
    missedExtractedData = [];
  medicationNursingTasksData?.forEach((item) => {
    const { slots } = item;

    slots.forEach((slot) => {
      const { startTime, uuid, order, medicationAdministration, serviceType } =
        slot;
      const administeredDateTime =
        slot.status === "COMPLETED"
          ? medicationAdministration.administeredDateTime !== null
            ? medicationAdministration.administeredDateTime
            : ""
          : "";
      let drugName, drugRoute, duration, dosage, doseType, dosingInstructions;
      if (order) {
        drugName = order.drug.display;
        drugRoute = order.route?.display;
        if (order.duration) {
          duration = order.duration + " " + order.durationUnits.display;
        }
        if (
          order.doseUnits.display !== "ml" &&
          order.doseUnits.display !== "mg"
        ) {
          dosage = order.dose;
          doseType = order.doseUnits.display;
        } else {
          dosage = order.dose + order.doseUnits.display;
        }
        dosingInstructions = {
          asNeeded: order.asNeeded,
          frequency: order.frequency?.display,
        };
      }
      if (serviceType == "EmergencyMedicationRequest") {
        drugName = medicationAdministration.drug?.display;
        drugRoute = medicationAdministration.route?.display;
        dosage =
          medicationAdministration.dose +
          medicationAdministration.doseUnits?.display;
        dosingInstructions = { emergency: true };
      }
      const startTimeInDate = new Date(startTime * 1000);
      let administeredTimeInDate = "";
      if (administeredDateTime !== "")
        administeredTimeInDate = new Date(administeredDateTime * 1000);

      const slotInfo = {
        drugName,
        drugRoute,
        duration,
        dosage,
        doseType,
        uuid,
        startTimeInEpochSeconds: startTime,
        dosingInstructions: dosingInstructions,
        startTime: startTimeInDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
        orderId: order?.uuid,
        isDisabled: isReadMode
          ? true
          : !!administeredDateTime ||
            slot.status === "STOPPED" ||
            slot.status === "NOT_DONE" ||
            slot.status === "MISSED",
        serviceType,
      };

      if (filterValue.id === "prn" && slotInfo.dosingInstructions.asNeeded) {
        prnExtractedData.push(slotInfo);
      }

      if (
        (filterValue.id === "stopped" || filterValue.id === "allTasks") &&
        slot.status === "STOPPED"
      ) {
        stoppedExtractedData.push({
          ...slotInfo,
          stopTime: order?.dateStopped,
        });
      } else if (
        (filterValue.id === "skipped" || filterValue.id === "allTasks") &&
        slot.status === "NOT_DONE"
      ) {
        skippedExtractedData.push({ ...slotInfo, status: "Not Done" });
      } else if (
        (filterValue.id === "completed" || filterValue.id === "allTasks") &&
        slot.status === "COMPLETED"
      ) {
        completedExtractedData.push({
          ...slotInfo,
          administeredTimeInEpochSeconds: administeredDateTime,
          administeredTime:
            administeredTimeInDate !== ""
              ? administeredTimeInDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h23",
                })
              : "",
        });
      } else if (
        (filterValue.id === "pending" || filterValue.id === "allTasks") &&
        slot.status === "SCHEDULED" &&
        !slot.medicationAdministration
      ) {
        pendingExtractedData.push(slotInfo);
      } else if (
        (filterValue.id === "missed" || filterValue.id === "allTasks") &&
        slot.status === "MISSED"
      ) {
        missedExtractedData.push({ ...slotInfo, status: "missed" });
      }
    });
  });
  pendingExtractedData.sort(
    (a, b) => a.startTimeInEpochSeconds - b.startTimeInEpochSeconds
  );
  completedExtractedData.sort(
    (a, b) =>
      a.administeredTimeInEpochSeconds - b.administeredTimeInEpochSeconds
  );
  stoppedExtractedData.sort(
    (a, b) => a.startTimeInEpochSeconds - b.startTimeInEpochSeconds
  );
  missedExtractedData.sort(
    (a, b) => a.startTimeInEpochSeconds - b.startTimeInEpochSeconds
  );
  extractedData.push(...pendingExtractedData);

  const groupedData = [];
  let currentStartTime = null;
  let currentGroup = [];

  extractedData.forEach((item) => {
    if (item.serviceType == asNeededPlaceholderConceptName) {
      groupedData.push([item]);
    } else {
      if (item.startTime !== currentStartTime && !item.stopTime) {
        if (currentGroup.length > 0) {
          groupedData.push(currentGroup);
        }
        currentGroup = [item];
        currentStartTime = item.startTime;
      } else {
        currentGroup.push(item);
      }
    }
  });

  if (currentGroup.length > 0) {
    groupedData.push(currentGroup);
  }
  if (filterValue.id !== "pending") {
    groupedData.push(...completedExtractedData.map((item) => [item]));
    groupedData.push(...stoppedExtractedData.map((item) => [item]));
    groupedData.push(...skippedExtractedData.map((item) => [item]));
    groupedData.push(...prnExtractedData.map((item) => [item]));
    groupedData.push(...missedExtractedData.map((item) => [item]));
  }
  return groupedData;
};

export const saveAdministeredMedication = async (administeredMedication) => {
  try {
    return await axios.post(
      ADMINISTERED_MEDICATIONS_BASE_URL,
      administeredMedication
    );
  } catch (error) {
    console.error(error);
  }
};

export const updateNonMedicationTask = async (updateNonMedicationPayload) => {
  try {
    return await axios.put(NON_MEDICATION_BASE_URL, updateNonMedicationPayload);
  } catch (error) {
    return (error);
  }
};

const timeToEpoch = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const specificTime = new Date();
  specificTime.setHours(hours, minutes, 0, 0);
  return Math.floor(specificTime.getTime() / 1000);
};

export const isTimeWithinAdministeredWindow = (
  taskTime,
  scheduledStartTime,
  nursingTasks
) => {
  const enteredTimeInEpochSeconds = timeToEpoch(taskTime);
  const timeWithinWindowInEpochSeconds =
    timeToEpoch(scheduledStartTime) +
    nursingTasks.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate * 60;
  return enteredTimeInEpochSeconds <= timeWithinWindowInEpochSeconds;
};

export const disableTaskTilePastNextSlotTime = (
  medicationNursingTasks,
  index
) => {
  if (index < medicationNursingTasks.length - 1) {
    const currentTask = medicationNursingTasks[index][0];
    const upcomingTask = medicationNursingTasks[index + 1][0];
    const upcomingTaskTimeInEpoch = upcomingTask.startTimeInEpochSeconds;
    const currentTimeInEpoch = moment().unix();
    if (upcomingTaskTimeInEpoch <= currentTimeInEpoch) {
      currentTask.isDisabled = currentTask.taskType === "nursing_activity";
    }
  }
};

export const getTimeInSeconds = (days) => days * 86400;

export const sortNursingTasks = (medicationNursingTasks) => {
  medicationNursingTasks.sort((a, b) => {
    const aTime =
      a &&
      (a[0]?.startTimeInEpochSeconds ??
        a[0]?.administeredTimeInEpochSeconds ??
        a[0]?.executionEndTime);
    const bTime =
      b &&
      (b[0]?.startTimeInEpochSeconds ??
        b[0]?.administeredTimeInEpochSeconds ??
        b[0]?.executionEndTime);
    return aTime - bTime;
  });
};

export const ExtractNonMedicationTasks = (
  nonMedicationTasks,
  filterValue,
  isReadMode
) => {
  const extractedData = [];
  const groupedData = [],
    completedExtractedData = [],
    pendingExtractedData = [],
    skippedExtractedData = [];
  nonMedicationTasks?.forEach((nonMedicationTask) => {
    const {
      name,
      partOf,
      requestedStartTime,
      status,
      uuid,
      token,
      taskType,
      creator,
      executionStartTime,
      executionEndTime,
    } = nonMedicationTask;
    const startTimeInDate = new Date(requestedStartTime);
    const taskInfo = {
      drugName: name,
      uuid,
      startTimeInEpochSeconds: requestedStartTime / 1000,
      startTime: startTimeInDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }),
      partOf,
      isDisabled: isReadMode
        ? true
        : !!executionEndTime || status === "REJECTED",
      administeredTime: executionStartTime,
      administeredTimeInEpochSeconds: executionStartTime / 1000,
      isDisabled: isReadMode ? true : !!executionStartTime,
      status,
      isANonMedicationTask: true,
      token,
      taskType,
      creator,
    };

    if (
      (filterValue.id === "pending" || filterValue.id === "allTasks") &&
      taskInfo.status === "REQUESTED"
    ) {
      pendingExtractedData.push(taskInfo);
    } else if (
      (filterValue.id === "skipped" || filterValue.id === "allTasks") &&
      taskInfo.status === "REJECTED"
    ) {
      skippedExtractedData.push({ ...taskInfo, status: "Not Done" });
    } else if (
      (filterValue.id === "completed" || filterValue.id === "allTasks") &&
      taskInfo.status === "COMPLETED"
    ) {
      completedExtractedData.push(taskInfo);
    }
  });
  extractedData.push(...pendingExtractedData);
  extractedData.push(...skippedExtractedData);
  extractedData.push(...completedExtractedData);
  // grouping pending non-medication tasks together
    const nursingActivityTask = pendingExtractedData.filter(
      (data) => data.taskType?.display === "nursing_activity"
    );
    const systemGeneratedTasks = pendingExtractedData.filter(
      (data) => data.taskType?.display !== "nursing_activity"
    );
    const extractedNursingActivityTask = groupTasks(
      nursingActivityTask,
      groupedData
    );
    const extractedSystemGeneratedTasks = groupTasks(
      systemGeneratedTasks,
      groupedData
    );
    if (extractedNursingActivityTask.length > 0) {
      groupedData.push(extractedNursingActivityTask);
    }
    if (extractedSystemGeneratedTasks.length > 0) {
      groupedData.push(extractedSystemGeneratedTasks);
    }

    groupedData.push(...completedExtractedData.map((item) => [item]));
    groupedData.push(...skippedExtractedData.map((item) => [item]));
  return groupedData;
};

const groupTasks = (extractedData, groupedData) => {
  let currentGroup = [];
  let currentStartTime = null;
  extractedData.forEach((item) => {
    if (item.startTime !== currentStartTime && !item.stopTime) {
      if (currentGroup.length > 0) {
        groupedData.push(currentGroup);
      }
      currentGroup = [item];
      currentStartTime = item.startTime;
    } else {
      currentGroup.push(item);
    }
  });
  return currentGroup;
};

export const disableDoneTogglePostNextTaskTime = (
  medicationTask,
  groupSlotsByOrderId
) => {
  const filteredSlots = groupSlotsByOrderId[medicationTask.orderId];
  const taskWithJustGreaterTime = filteredSlots.find(
    (slot) =>
      medicationTask.startTimeInEpochSeconds < slot.startTimeInEpochSeconds
  );

  const currentTimeInEpoch = moment().unix();

  return (
    taskWithJustGreaterTime &&
    currentTimeInEpoch >= taskWithJustGreaterTime.startTimeInEpochSeconds
  );
};
