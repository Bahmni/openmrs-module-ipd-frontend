import { fetchObservationsForEncounter } from "../../../../utils/CommonUtils";

export const fetchEncounterObs = (encounterUuid) =>
  fetchObservationsForEncounter(encounterUuid);

export const extractInstructionsFromObs = (
  observations,
  configuredConcepts
) => {
  const results = [];
  if (!observations || !configuredConcepts || configuredConcepts.length === 0) {
    return results;
  }

  const searchObs = (obsList) => {
    obsList.forEach((obs) => {
      if (
        obs.concept &&
        obs.concept.name &&
        configuredConcepts.includes(obs.concept.name)
      ) {
        results.push({
          conceptName: obs.concept.name,
          value:
            obs.value != null
              ? typeof obs.value === "object"
                ? obs.value.display ?? obs.value.name ?? ""
                : String(obs.value)
              : "",
        });
      }
      if (obs.groupMembers && obs.groupMembers.length > 0) {
        searchObs(obs.groupMembers);
      }
    });
  };

  searchObs(observations);
  return results;
};
