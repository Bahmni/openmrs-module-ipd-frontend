import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Loading, Modal, Tooltip } from "carbon-components-react";
import { Document20 } from "@carbon/icons-react";
import _ from "lodash";
import {
  fetchAllObservations,
  flattenObservations,
} from "../utils/ViewFormUtils";
import "../styles/ViewFormModal.scss";
import moment from "moment/moment";

export const ViewFormModal = (props) => {
  const { encounterUuid, callbacks, form, metadata } = props;
  const { formTemplate, formTranslations } = form;
  const { formName, encounterDateTime, provider } = metadata;
  const [observations, setObservations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    fetchAllObservations(encounterUuid).then((response) => {
      const flattenedObs = flattenObservations(response.observations);
      const groupedObs = _.groupBy(flattenedObs, "concept.name");
      setObservations(groupedObs);
      setIsLoading(false);
    });
  }, []);

  const renderMembers = (form, level, obs) => {
    const heading = (
      <span className={"observation-name"}>
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
          <div className={"observations-row"}>
            {heading}
            <span className={"observation-value"}>
              {obs[form.conceptName][0].comment && (
                <Tooltip
                  renderIcon={Document20}
                  autoOrientation={true}
                  className={"obs-note-icon"}
                >
                  {obs[form.conceptName][0].comment}
                </Tooltip>
              )}
              {obs[form.conceptName]
                .map((value) => {
                  return value.valueAsString;
                })
                .join(", ")}
            </span>
          </div>
        )}
        {form.hasGroupMembers && (
          <div className={"obs-group-heading"}>{heading}</div>
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
    <Modal
      open
      passiveModal
      onRequestClose={() => {
        callbacks.setModalValue(encounterUuid, false);
      }}
      className={"view-form-modal"}
    >
      <div className={"view-form-container"}>
        <div className={"view-form-header"}>
          {formName} | {moment(+encounterDateTime).format("DD-MM-YYYY HH:mm")} |{" "}
          {provider}
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          formTemplate.map((form, index) => {
            return (
              <Fragment key={index}>
                {renderMembers(form, 0, observations)}
              </Fragment>
            );
          })
        )}
      </div>
    </Modal>
  );
};

ViewFormModal.propTypes = {
  encounterUuid: PropTypes.string.isRequired,
  callbacks: PropTypes.object,
  form: PropTypes.object.isRequired,
  metadata: PropTypes.object.isRequired,
};
