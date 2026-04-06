import axios from "axios";
import { BAHMNI_CORE_OBSERVATIONS_BASE_URL } from "../../../../constants";

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
      params: { visitUuid, concept: conceptNames },
      paramsSerializer: serializeParams,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
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

    result.push({
      encounterUuid: obs.encounterUuid,
      encounterDateTime: obs.encounterDateTime,
      form: formName,
      instructionType: obs.concept.name,
      instruction: extractObsValue(obs.value),
      providerName: obs.providers?.[0]?.name ?? "",
      action: "",
    });

    return result;
  }, []);
};
