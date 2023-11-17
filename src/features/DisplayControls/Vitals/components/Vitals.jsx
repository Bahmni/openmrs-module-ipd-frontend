import React, { useEffect } from "react";
import { Column, Row, Tile, SkeletonText } from "carbon-components-react";
import { getPatientVitals, mapVitalsData } from "../utils/VitalsUtils";
import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/Vitals.scss";
import { FormattedMessage } from "react-intl";

const Vitals = (props) => {
  const { patientId } = props;
  const [Vitals, setVitals] = useState({});
  const [VitalUnits, setVitalUnits] = useState({});
  const [VitalsDate, setVitalsDate] = useState(null);
  const [VitalsTime, setVitalsTime] = useState(null);
  const [isLoading, updateIsLoading] = useState(true);

  const NoVitalsMessage = (
    <FormattedMessage
      id={"NO_VITALS_MESSAGE"}
      defaultMessage={"No Vitals available for this patient"}
    />
  );

  const vitalsHeaders = {
    temperature: (
      <FormattedMessage id={"Temperature"} defaultMessage={"Temp"} />
    ),
    bloodPressure: (
      <FormattedMessage id={"BLOOD_PRESSURE"} defaultMessage={"BP"} />
    ),
    heartRate: (
      <FormattedMessage id={"HEART_RATE"} defaultMessage={"Heart rate"} />
    ),
    respiratoryRate: (
      <FormattedMessage id={"RESPIRATORY_RATE"} defaultMessage={"R.rate"} />
    ),
    weight: <FormattedMessage id={"WEIGHT"} defaultMessage={"Weight"} />,
    height: <FormattedMessage id={"HEIGHT"} defaultMessage={"Height"} />,
    spO2: <FormattedMessage id={"SPO2"} defaultMessage={"SpO2"} />,
    BMI: <FormattedMessage id={"BMI"} defaultMessage={"BMI"} />,
  };

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
      handleVitalUnits(VitalsList.conceptDetails);
      setVitals(mapVitalsData(VitalsList, setVitalsDate, setVitalsTime));
      updateIsLoading(false);
    };

    getVitals();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonText className="is-loading" data-testid="header-loading" />
      ) : Vitals == null || Object.keys(Vitals).length === 0 ? (
        <div className="no-vitals-message">{NoVitalsMessage}</div>
      ) : (
        <Tile>
          <br />
          <div className="vital-date-time">
            {VitalsDate ? VitalsDate : "-"}
            {VitalsTime ? ", " + VitalsTime : "-"}
          </div>
          <br />
          <br />
          <Row>
            <Column>
              <Tile
                className={
                  Vitals.Temp?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                {vitalsHeaders.temperature}
                <span className="vital-values">
                  {Vitals.Temp?.value ? Vitals.Temp?.value : "-"}{" "}
                  {Vitals.Temp?.value ? VitalUnits.Temperature : " "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.SystolicPressure?.abnormal ||
                  Vitals.DiastolicPressure?.abnormal
                    ? "abnormal-tiles"
                    : "vital-tiles"
                }
              >
                {vitalsHeaders.bloodPressure}
                <span className="vital-values">
                  {Vitals.SystolicPressure?.value &&
                  Vitals.DiastolicPressure?.value
                    ? Vitals.SystolicPressure?.value +
                      "/" +
                      Vitals.DiastolicPressure?.value
                    : "-"}{" "}
                  {Vitals.SystolicPressure?.value
                    ? VitalUnits["Diastolic Blood Pressure"]
                    : " "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.HeartRate?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                {vitalsHeaders.heartRate}
                <span className="vital-values">
                  {Vitals.HeartRate?.value ? Vitals.HeartRate?.value : "-"}{" "}
                  {Vitals.HeartRate?.value ? VitalUnits.Pulse : " "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.RespiratoryRate?.abnormal
                    ? "abnormal-tiles"
                    : "vital-tiles"
                }
              >
                {vitalsHeaders.respiratoryRate}
                <span className="vital-values">
                  {Vitals.RespiratoryRate?.value
                    ? Vitals.RespiratoryRate?.value
                    : "-"}{" "}
                  {Vitals.RespiratoryRate?.value
                    ? VitalUnits["Respiratory Rate"]
                    : " "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.Weight?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                {vitalsHeaders.weight}
                <span className="vital-values">
                  {Vitals.Weight?.value ? Vitals.Weight?.value : "-"}{" "}
                  {Vitals.Weight?.value ? VitalUnits.WEIGHT : " "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.Height?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                {vitalsHeaders.height}
                <span className="vital-values">
                  {Vitals.Height?.value ? Vitals.Height?.value : "-"}{" "}
                  {Vitals.Height?.value ? VitalUnits.HEIGHT : " "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.SpO2?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                {vitalsHeaders.spO2}
                <span className="vital-values">
                  {Vitals.SpO2?.value ? Vitals.SpO2?.value : "-"}{" "}
                  {Vitals.SpO2?.value ? VitalUnits.SpO2 : " "}
                </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.BMI?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                {vitalsHeaders.BMI}
                <span className="vital-values">
                  {Vitals.BMI?.value ? Vitals.BMI?.value : "-"}{" "}
                  {Vitals.BMI?.value ? VitalUnits.BMI : " "}
                </span>
              </Tile>
            </Column>
          </Row>
        </Tile>
      )}
    </>
  );
};
Vitals.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Vitals;
