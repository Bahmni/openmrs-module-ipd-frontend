import React from "react";
import PropTypes from "prop-types";
import "./DrugChartModal.scss";
// import { TestComp } from "bahmni-carbon-ui";
// import { Button } from "carbon-components-react";
import { I18nProvider } from "../../features/i18n/I18nProvider";
// import { FormattedMessage } from "react-intl";

/**
 * NOTE: Currently there is nothing in this dashboard, all debugging items
 */
export default function DrugChartModal(props) {
  const { hostData, hostApi } = props;
  return (
    <>
      <I18nProvider>
        <h2>Add to Drug Chart</h2>
        <div>
          <h3>Hello</h3>
          <h3>{hostData ? "Yes" : "No"}</h3>
          <h3>{hostApi ? "Yes" : "No"}</h3>
        </div>
      </I18nProvider>
    </>
  );
}

DrugChartModal.propTypes = {
  hostData: PropTypes.shape({
    patient: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  hostApi: PropTypes.shape({
    onConfirm: PropTypes.func,
  }),
};
