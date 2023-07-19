import React from "react";
import PropTypes from "prop-types";
import "./Dashboard.scss";
import styles from "./Dashboard.module.scss";
import { TestComp } from "bahmni-carbon-ui";
import { Button } from "carbon-components-react";
import { I18nProvider } from "../features/i18n/I18nProvider";
import { FormattedMessage } from "react-intl";
import Calendar from "../features/Calendar/Calendar.jsx";
import { DrugChart } from "../features/DrugChart/DrugChart.jsx";

/**
 * NOTE: Currently there is nothing in this dashboard, all debugging items
 */
export default function Dashboard(props) {
  const { hostData, hostApi } = props;
  return (
    <>
      <I18nProvider>
        <h3>IPD Care and Monitoring Dashboard</h3>
        <div>
          <h4>DEBUG: Data received from host</h4>
          <p>
            <b className="sub-text">Patient UUID:</b> {hostData?.patient?.uuid}
          </p>
        </div>
        <hr />
        <div>
          <h4>
            DEBUG: Following line has scoped styles applied via css-module
          </h4>
          <p className={styles.scopedParagraphStyle}>
            This should be in bold, red-color and underlined
          </p>
        </div>

        <div>
          <h4>
            DEBUG: following is a content switcher from{" "}
            <code>bahmni-carbon-ui</code> library
          </h4>
          <TestComp />
        </div>
        <hr />

        <div>
          <h4>
            DEBUG: following is a component from{" "}
            <code>carbon-components-react</code> library
          </h4>
          <Button
            kind="primary"
            onClick={() => hostApi.onConfirm?.("event-from-ipd")}
          >
            Click to send event to host appliation
          </Button>
        </div>

        <div>
          <h4>DEBUG: Translations</h4>
          <p>
            <FormattedMessage id="IPD_HEADER" />
          </p>
        </div>
        <Calendar
          calendarData={[
            {
              6: {
                minutes: "00",
                status: "Administered",
                administrationInfo: "Administered by: Dr. John Doe",
              },
              12: { minutes: "30", status: "Administered-Late" },
              16: { minutes: "15", status: "Pending" },
            },
            {
              4: { minutes: "00", status: "Administered" },
              10: { minutes: "30", status: "Not-Administered" },
              13: { minutes: "15", status: "Pending" },
            },
            {
              7: { minutes: "00", status: "Administered" },
              15: { minutes: "30", status: "Not-Administered" },
              18: { minutes: "15", status: "Pending" },
            },
            {
              9: { minutes: "00", status: "Administered" },
              20: { minutes: "30", status: "Not-Administered" },
              23: { minutes: "15", status: "Late" },
            },
          ]}
        />
        <DrugChart patientId="dummyid" />
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
