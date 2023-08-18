import React from "react";
import PropTypes from "prop-types";
import "./Dashboard.scss";
import { I18nProvider } from "../features/i18n/I18nProvider";
import DrugChartWrapper from "../features/DrugChart/DrugChartWrapper/DrugChartWrapper.jsx";
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
        <DrugChartWrapper
          patientId={hostData?.patientId}
          viewDate={hostData?.forDate}
        />
      </I18nProvider>
    </>
  );
}
Dashboard.propTypes = {
  hostData: PropTypes.shape({
    patientId: PropTypes.string,
    forDate: PropTypes.instanceOf(Date),
  }).isRequired,
};
