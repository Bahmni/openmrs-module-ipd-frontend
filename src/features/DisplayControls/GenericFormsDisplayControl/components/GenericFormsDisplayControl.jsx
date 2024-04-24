import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IPDContext } from "../../../../context/IPDContext";
import {
  fetchAllConceptsForForm,
  fetchFormTranslations,
  fetchObservationsForConcepts,
} from "../utils/GenericFormsDisplayControlUtils";
import _ from "lodash";
import "../styles/GenericFormDisplayControl.scss";
import { Time20 } from "@carbon/icons-react";
import moment from "moment";

const GenericFormsDisplayControl = (props) => {
  const { config } = props;
  const { concepts, formName } = config;
  const ipdContext = useContext(IPDContext);
  const [observations, setObservations] = useState([]);
  const [groupedObsData, setGroupedObsData] = useState([]);
  const [formTemplate, setFormTemplate] = useState([]);
  const [formTranslations, setFormTranslations] = useState({});
  const {
    visitSummary: { uuid: visitUuid },
    allFormsSummary = [],
  } = ipdContext;
  const fetchObs = async () => {
    const response = await fetchObservationsForConcepts(concepts, visitUuid);
    setObservations(response);
  };
  const fetchFormConcepts = async (formUuid) => {
    const response = await fetchAllConceptsForForm(formUuid);
    if (response?.resources && response?.resources[0]?.value) {
      return JSON.parse(response?.resources[0]?.value);
    }
  };
  const restructureFormConcepts = (formConcepts) => {
    const form = [];
    formConcepts.map((formConcept) => {
      if (formConcept.type === "obsControl") {
        form.push({
          conceptName: formConcept.concept.name,
          translationKey: formConcept.label.translationKey,
          hasGroupMembers: false,
        });
      } else if (formConcept.type === "obsGroupControl") {
        form.push({
          conceptName: formConcept.concept.name,
          translationKey: formConcept.label.translationKey,
          hasGroupMembers: true,
          members: restructureFormConcepts(formConcept.controls),
        });
      }
    });
    return form;
  };
  useEffect(() => {
    fetchObs();
    const formUuid = allFormsSummary.find(
      (form) => form.name === formName
    )?.uuid;
    fetchFormConcepts(formUuid).then((response) => {
      const finalResponse = restructureFormConcepts(response.controls);
      setFormTemplate(finalResponse);
    });
    fetchFormTranslations(formName, formUuid).then((response) => {
      setFormTranslations(response.concepts);
    });
  }, []);
  useEffect(() => {
    const groupedSortedObsData = groupObsData(observations);
    const extractedObsData = groupSimilarObs(groupedSortedObsData);
    setGroupedObsData(extractedObsData);
  }, [observations]);
  const groupObsData = (observations) => {
    const groupedData = {};
    observations.forEach((observation) => {
      if (groupedData[observation.encounterDateTime]) {
        groupedData[observation.encounterDateTime].push(observation);
      } else {
        groupedData[observation.encounterDateTime] = [observation];
      }
    });
    return groupedData;
  };

  const groupSimilarObs = (groupedObs) => {
    const extractedObs = {};
    let provider = "";
    Object.keys(groupedObs).forEach((key) => {
      const obs = groupedObs[key];
      provider = obs[0]?.creatorName;
      extractedObs[key] = _.groupBy(obs, "concept.name");
    });
    const keyValueArray = Object.entries(extractedObs);
    keyValueArray.sort((a, b) => b[0] - a[0]);
    return keyValueArray.map(([key, value]) => ({ [key]: value, provider }));
  };
  const renderMembers = (form, level, obs) => {
    const heading = (
      <span style={{ display: "inline-block", width: "35%" }}>
        {Array(8 * level)
          .fill("\u00A0")
          .join("")}
        <span className={`${form.hasGroupMembers && "bold-text"} `}>
          {formTranslations[form.translationKey] &&
            formTranslations[form.translationKey][0]}
        </span>
      </span>
    );
    return (
      <>
        {!form.hasGroupMembers && obs[form.conceptName] && (
          <div style={{ padding: "16px 0", borderBottom: "1px solid grey" }}>
            {heading}
            {obs[form.conceptName]
              .map((value) => {
                return value.valueAsString;
              })
              .join(", ")}
          </div>
        )}
        {form.hasGroupMembers && (
          <div style={{ padding: "16px 0", borderBottom: "1px solid grey" }}>
            {heading}
          </div>
        )}
        {form.hasGroupMembers &&
          form.members.map((member, index) => {
            return (
              <span key={index}>{renderMembers(member, level + 1, obs)}</span>
            );
          })}
      </>
    );
  };
  return (
    <div style={{ margin: "10px" }}>
      {groupedObsData.map((group, index) => {
        const [date, obs] = Object.entries(group)[0];
        return (
          <>
            <div
              style={{ padding: "16px 0", borderBottom: "1px solid grey" }}
              key={index}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "600",
                }}
              >
                {moment(+date).format("DD-MM-YYYY")} | <Time20 />
                {moment(+date).format("HH:mm")} | {group.provider}
              </div>
            </div>
            <div>
              {formTemplate.map((form, index) => {
                return <div key={index}>{renderMembers(form, 0, obs)}</div>;
              })}
            </div>
            <br />
            <br />
          </>
        );
      })}
    </div>
  );
};

export default GenericFormsDisplayControl;

GenericFormsDisplayControl.propTypes = {
  patientId: PropTypes.string,
  config: PropTypes.object,
};
