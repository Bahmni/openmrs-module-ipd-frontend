import axios from "axios";
import {
  BAHMNI_CORE_OBSERVATIONS_BASE_URL,
  OBSERVATIONS_BATCH_URL,
  FHIR_TASK_URL,
  defaultDateTimeFormat12Hrs,
} from "../../../../constants";
import { formatTime } from "../../../../utils/DateTimeUtils";

const OBSERVATIONS_URL = BAHMNI_CORE_OBSERVATIONS_BASE_URL.replace(/\?$/, "");

export const serializeParams = (params) =>
  Object.entries(params)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((paramValue) => `${key}=${encodeURIComponent(paramValue)}`)
        : [`${key}=${encodeURIComponent(value)}`]
    )
    .join("&");

export const fetchCareInstructionsObs = async (visitUuid, conceptNames) => {
  try {
    const response = await axios.get(OBSERVATIONS_URL, {
      params: { visitUuid, concept: conceptNames, filterObsWithOrders: false },
      paramsSerializer: serializeParams,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const fetchTasksByObservationUuids = async (observationUuids) => {
  if (!observationUuids || observationUuids.length === 0) return [];
  try {
    // No status filter: task existence (any status) indicates acknowledgement,
    // because creating a task is the acknowledgement action in this workflow.
    // &_count=500 avoids silent truncation at the default 10-result page size
    // when called with all-patients observation UUIDs from the care view summary.
    const url = `${FHIR_TASK_URL}?focus=${observationUuids
      .map((uuid) => `Observation/${uuid}`)
      .join(",")}&_count=500`;

    const response = await axios.get(url, { withCredentials: true });
    const entries = response.data?.entry || [];
    return entries.map((entry) => ({
      observationUuid: entry.resource?.focus?.reference?.split("/").pop(),
      uuid: entry.resource?.id,
    }));
  } catch (error) {
    console.error("Failed to fetch tasks by observation UUIDs", error);
    return [];
  }
};

export const fetchAcknowledgedObservationUuids = async (obsUuids) => {
  const tasks = await fetchTasksByObservationUuids(obsUuids);
  return new Set(tasks.map((task) => task.observationUuid).filter(Boolean));
};

export const fetchBatchObservations = async (visitUuids, concepts, filterObsWithOrders = false) => {
  try {
    const request = {
      visitUuids,
      concept: concepts,
      filterObsWithOrders,
    };

    const response = await axios.post(OBSERVATIONS_BATCH_URL, request, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch observations batch", error);
    return [];
  }
};

const extractObsValue = (value) => {
  if (value == null) return "";
  if (typeof value === "object") return value.display ?? value.name ?? "";
  return String(value);
};

export const mapObservationsToInstructions = (observations, formConcepts) => {
  if (!observations || !formConcepts || formConcepts.length === 0) {
    return [];
  }

  const formConceptsMap = new Map(
    formConcepts.map((formConcept) => [
      formConcept.formName,
      formConcept.concepts,
    ])
  );

  return observations.reduce((result, obs) => {
    if (!obs.formFieldPath) return result;

    const formName = obs.formFieldPath.split(".")[0];
    const allowedConcepts = formConceptsMap.get(formName);

    if (
      !allowedConcepts ||
      !obs.concept?.name ||
      !allowedConcepts.includes(obs.concept.name)
    ) {
      return result;
    }

    let instruction = extractObsValue(obs.value);
    if (obs.type === "Datetime" || obs.concept?.dataType === "Datetime") {
      instruction = formatTime(
        obs.value,
        "YYYY-MM-DD HH:mm:ss",
        defaultDateTimeFormat12Hrs
      );
    }

    result.push({
      observationUuid: obs.uuid,
      orderUuid: obs.orderUuid ?? null,
      encounterUuid: obs.encounterUuid,
      encounterDateTime: obs.encounterDateTime,
      form: formName,
      instructionType: obs.concept.name,
      instruction,
      providerName: obs.providers?.[0]?.name ?? "",
      previousVersionUuid: obs.previousVersionUuid ?? null,
      action: "",
    });

    return result;
  }, []);
};

// Filters instructions from previous shifts.
export const filterPreviousShiftInstructions = (
  instructions,
  currentShiftStartTime
) => {
  if (!instructions || instructions.length === 0) {
    return [];
  }

  return instructions.filter(
    (instruction) => instruction.encounterDateTime < currentShiftStartTime
  );
};
