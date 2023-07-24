import React from "react";
import PropTypes from "prop-types";
import "./Dashboard.scss";
import { I18nProvider } from "../features/i18n/I18nProvider";
import DrugChart from "../features/DrugChart/DrugChart.jsx";

/**
 * NOTE: Currently there is nothing in this dashboard, all debugging items
 */
export default function Dashboard(props) {
  const { hostData } = props;
  return (
    <>
      <I18nProvider>
        {/* <Button
            kind="primary"
            onClick={() => hostApi.onConfirm?.("event-from-ipd")}
          >
            Click to send event to host appliation
          </Button> */}

        <DrugChart patientId={hostData?.patient?.uuid} />
      </I18nProvider>
    </>
  );
}

Dashboard.propTypes = {
  hostData: PropTypes.shape({
    patient: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  hostApi: PropTypes.shape({
    onConfirm: PropTypes.func,
  }),
};
