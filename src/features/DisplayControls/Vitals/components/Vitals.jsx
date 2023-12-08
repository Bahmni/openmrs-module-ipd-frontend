import React, { useEffect } from "react";
import { Column, Row, Tile, SkeletonText, Link } from "carbon-components-react";
import {
  getPatientVitals,
  getPatientVitalsHistory,
  mapVitalsData,
  mapVitalsHistory,
  mapBiometricsHistory,
  vitalsHistoryHeaders,
  biometricsHistoryHeaders,
} from "../utils/VitalsUtils";
import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/Vitals.scss";
import { FormattedMessage } from "react-intl";
import VitalsHistory from "./VitalsHistory";
import BiometricsHistory from "./BiometricsHistory";
import { vitalsHeaders } from "../utils/VitalsUtils";
import { ChevronDown20,ChevronUp20 } from "@carbon/icons-react";

const Vitals = (props) => {
  const { patientId } = props;
  const [showMore, setShowMore] = useState(false);
  const [vitals, setVitals] = useState({});
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [biometricsHistory, setBiometricsHistory] = useState([]);
  const [vitalUnits, setVitalUnits] = useState({});
  const [vitalsDate, setVitalsDate] = useState(null);
  const [vitalsTime, setVitalsTime] = useState(null);
  const [isLoading, updateIsLoading] = useState(true);



  const NoVitalsMessage = (
    <FormattedMessage
      id={"NO_VITALS_MESSAGE"}
      defaultMessage={"No Vitals available for this patient"}
    />
  );

  const vitalsHistoryMessage = (
    <FormattedMessage
      id={"VITALS_HISTORY_MESSAGE"}
      defaultMessage={"Vitals History"}
    />
  );

  const handleShowMore = () => setShowMore(!showMore);
  const handleVitalUnits = (units) => {
    let updatedUnits = {};

    units.forEach((unit) => {
      updatedUnits[unit.name] = unit.units;
    });

    setVitalUnits((oldUnits) => {
      return {
        ...oldUnits,
        ...updatedUnits,
      };
    });
  };

  useEffect(() => {
    const getVitals = async () => {
      const VitalsList = await getPatientVitals(patientId);
      const vitalsHistoryList = await getPatientVitalsHistory(patientId);
      handleVitalUnits(VitalsList.conceptDetails);
      setVitals(mapVitalsData(VitalsList, setVitalsDate, setVitalsTime));
      setVitalsHistory(mapVitalsHistory(vitalsHistoryList));
      setBiometricsHistory(mapBiometricsHistory(vitalsHistoryList));
      updateIsLoading(false);
    };

    getVitals();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonText className="is-loading" data-testid="header-loading" />
      ) : vitals == null || Object.keys(vitals).length === 0 ? (
        <div className="no-vitals-message">{NoVitalsMessage}</div>
      ) : (
        <Tile className="vital-table">
          <div className="vital-date-time">
            {vitalsDate ? vitalsDate : "-"}
            {vitalsTime ? ", " + vitalsTime + "  " : "-"}
           {showMore ? (<Link
              kind="tertiary"
              className="show-more"
              size="sm"
              onClick={handleShowMore}
            >
              {vitalsHistoryMessage}<ChevronUp20/>
            </Link>) : (<Link
              kind="tertiary"
              className="show-more"
              size="sm"
              onClick={handleShowMore}
            >
              {vitalsHistoryMessage}<ChevronDown20/>
            </Link>)}
          </div>
          <Row>
            <Column>
              <Tile
                className={
                  vitals.Temp?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                <span className="vital-headers">
                  {vitalsHeaders.temperature}
                </span>
                <span className="vital-values">
                  {vitals.Temp?.value ? vitals.Temp?.value : "-"}{" "}
                  <span className="vital-units">
                    {vitals.Temp?.value ? vitalUnits.Temperature : " "}
                  </span>{" "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  vitals.SystolicPressure?.abnormal ||
                  vitals.DiastolicPressure?.abnormal
                    ? "abnormal-tiles"
                    : "vital-tiles"
                }
              >
                <span className="vital-headers">
                  {vitalsHeaders.bloodPressure}
                </span>
                <span className="vital-values">
                  {vitals.SystolicPressure?.value ||
                  vitals.DiastolicPressure?.value
                    ? vitals.SystolicPressure?.value +
                      "/" +
                      vitals.DiastolicPressure?.value
                    : "-"}{" "}
                  <span className="vital-units">
                    {vitals.SystolicPressure?.value
                      ? vitalUnits["Diastolic Blood Pressure"]
                      : " "}
                  </span>{" "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  vitals.HeartRate?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                <span className="vital-headers">{vitalsHeaders.heartRate}</span>
                <span className="vital-values">
                  {vitals.HeartRate?.value ? vitals.HeartRate?.value : "-"}{" "}
                  <span className="vital-units">
                    {vitals.HeartRate?.value ? vitalUnits.Pulse : " "}
                  </span>{" "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  vitals.RespiratoryRate?.abnormal
                    ? "abnormal-tiles"
                    : "vital-tiles"
                }
              >
                <span className="vital-headers">
                  {vitalsHeaders.respiratoryRate}
                </span>
                <span className="vital-values">
                  {vitals.RespiratoryRate?.value
                    ? vitals.RespiratoryRate?.value
                    : "-"}{" "}
                  <span className="vital-units">
                    {vitals.RespiratoryRate?.value
                      ? vitalUnits["Respiratory Rate"]
                      : " "}
                  </span>{" "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  vitals.Weight?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                <span className="vital-headers">{vitalsHeaders.weight}</span>
                <span className="vital-values">
                  {vitals.Weight?.value ? vitals.Weight?.value : "-"}{" "}
                  <span className="vital-units">
                    {vitals.Weight?.value ? vitalUnits.WEIGHT : " "}
                  </span>{" "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  vitals.Height?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                <span className="vital-headers">{vitalsHeaders.height}</span>
                <span className="vital-values">
                  {vitals.Height?.value ? vitals.Height?.value : "-"}{" "}
                  <span className="vital-units">
                    {vitals.Height?.value ? vitalUnits.HEIGHT : " "}
                  </span>{" "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  vitals.SpO2?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                <span className="vitsal-headers">{vitalsHeaders.spO2}</span>
                <span className="vital-values">
                  {vitals.SpO2?.value ? vitals.SpO2?.value : "-"}{" "}
                  <span className="vital-units">
                    {vitals.SpO2?.value ? vitalUnits.SpO2 : " "}
                  </span>{" "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  vitals.BMI?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                <span className="vital-headers">{vitalsHeaders.BMI}</span>
                <span className="vital-values">
                  {vitals.BMI?.value ? vitals.BMI?.value : "-"}{" "}
                  <span className="vital-units">
                    {vitals.BMI?.value ? vitalUnits.BMI : " "}
                  </span>{" "}
                </span>
              </Tile>
            </Column>
          </Row>
          {showMore && (
            <Tile className="vitals-biometrics-history">
              <Tile>
                <VitalsHistory
                  vitalsHistory={vitalsHistory}
                  vitalsHistoryHeaders={vitalsHistoryHeaders}
                >
                  {" "}
                </VitalsHistory>
              </Tile>
              <Tile>
                <BiometricsHistory
                  biometricsHistory={biometricsHistory}
                  biometricsHistoryHeaders={biometricsHistoryHeaders}
                >
                  {" "}
                </BiometricsHistory>
              </Tile>
            </Tile>
          )}
        </Tile>
      )}
    </>
  );
};
Vitals.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Vitals;
