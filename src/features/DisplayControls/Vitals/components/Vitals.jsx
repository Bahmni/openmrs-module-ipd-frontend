import React, { useEffect } from "react";
import { Column, Row, Tile } from "carbon-components-react";
import { getPatientVitals } from "../utils/VitalsUtils";
import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/Vitals.scss";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { formatDateAsString } from "../../../../utils/DateFormatter";
import { FormattedMessage } from "react-intl";

const Vitals = (props) => {
  const { patientId } = props;
  const [Vitals, setVitals] = useState({});
  const [VitalUnits, setVitalUnits] = useState({});
  const [VitalsDate, setVitalsDate] = useState(null);
  const [VitalsTime, setVitalsTime] = useState(null);

  const vitalsHeaders = {
    header1: <FormattedMessage id={"Temperature"} defaultMessage={"Temp"} />,
    header2: <FormattedMessage id={"BLOOD_PRESSURE"} defaultMessage={"BP"} />,
    header3: (
      <FormattedMessage id={"HEART_RATE"} defaultMessage={"Heart rate"} />
    ),
    header4: (
      <FormattedMessage id={"RESPIRATORY_RATE"} defaultMessage={"R.rate"} />
    ),
    header5: <FormattedMessage id={"WEIGHT"} defaultMessage={"Weight"} />,
    header6: <FormattedMessage id={"HEIGHT"} defaultMessage={"Height"} />,
    header7: <FormattedMessage id={"SPO2"} defaultMessage={"SpO2"} />,
    header8: <FormattedMessage id={"BMI"} defaultMessage={"BMI"} />,
  };

  var latestDate = null;

  const setDateAndTime = (date) => {
    const dateAndTime = formatDate(date).split(" ");
    setVitalsDate(formatDateAsString(new Date(date), "DD/MM/YY"));
    setVitalsTime(dateAndTime.slice(3).join(" "));
  };

  function getLatestDate(tabularData) {
    for (const dateKey in tabularData) {
      if (latestDate === null || dateKey > latestDate) {
        latestDate = dateKey;
      }
    }
  }

  const mapVitalsData = (VitalsList) => {
    var mappedVitals = {};
    if (VitalsList.tabularData) {
      const VitalsValues = VitalsList.tabularData;
      getLatestDate(VitalsValues);
      setDateAndTime(latestDate);
      if (latestDate !== null) {
        mappedVitals = {
          Temp: {
            value: VitalsValues[latestDate].Temperature?.value,
            abnormal: VitalsValues[latestDate].Temperature?.abnormal,
          },
          HeartRate: {
            value: parseInt(VitalsValues[latestDate].Pulse?.value, 10),
            abnormal: VitalsValues[latestDate].Pulse?.abnormal,
          },
          SystolicPressure: {
            value: parseInt(
              VitalsValues[latestDate]["Systolic Blood Pressure"]?.value,
              10
            ),
            abnormal:
              VitalsValues[latestDate]["Systolic Blood Pressure"]?.abnormal,
          },
          DiastolicPressure: {
            value: parseInt(
              VitalsValues[latestDate]["Diastolic Blood Pressure"]?.value,
              10
            ),
            abnormal:
              VitalsValues[latestDate]["Diastolic Blood Pressure"]?.abnormal,
          },
          Height: {
            value: parseInt(VitalsValues[latestDate].HEIGHT?.value, 10),
            abnormal: VitalsValues[latestDate].HEIGHT?.abnormal,
          },
          Weight: {
            value: parseInt(VitalsValues[latestDate].WEIGHT?.value, 10),
            abnormal: VitalsValues[latestDate].WEIGHT?.abnormal,
          },
          RespiratoryRate: {
            value: parseInt(
              VitalsValues[latestDate]["Respiratory Rate"]?.value,
              10
            ),
            abnormal: VitalsValues[latestDate]["Respiratory Rate"]?.abnormal,
          },
          SpO2: {
            value: parseInt(VitalsValues[latestDate].SpO2?.value, 10),
            abnormal: VitalsValues[latestDate].SpO2?.abnormal,
          },
          BMI: {
            value: VitalsValues[latestDate].BMI?.value,
            abnormal: VitalsValues[latestDate].BMI?.abnormal,
          },
        };
      }
    }
    return mappedVitals;
  };

  const handleVitalUnits = (units) => {
    units.forEach((unit) => {
      setVitalUnits((oldUnits) => {
        return {
          ...oldUnits,
          [unit.name]: unit.units,
        };
      });
    });
  };

  useEffect(() => {
    const getVitals = async () => {
      const VitalsList = await getPatientVitals(patientId);
      handleVitalUnits(VitalsList.conceptDetails);
      setVitals(mapVitalsData(VitalsList));
    };

    getVitals();
  }, []);

  return (
    <>
      <br />
      {VitalsDate ? VitalsDate : "-"},{VitalsTime ? VitalsTime : "-"}
      <Row>
        <Column>
          <Tile
            className={Vitals.Temp?.abnormal ? "abnormal-tiles" : "vital-tiles"}
          >
            {vitalsHeaders.header1}
            <br />
            <br />
            {Vitals.Temp?.value ? Vitals.Temp?.value : "-"}{" "}
            {VitalUnits.Temperature ? VitalUnits.Temperature : "-"}
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
            {vitalsHeaders.header2}
            <br />
            <br />
            {Vitals.SystolicPressure?.value && Vitals.DiastolicPressure?.value
              ? Vitals.SystolicPressure?.value +
                "/" +
                Vitals.DiastolicPressure?.value
              : "-"}{" "}
            {VitalUnits["Diastolic Blood Pressure"]
              ? VitalUnits["Diastolic Blood Pressure"]
              : "-"}
          </Tile>
        </Column>
        <Column>
          <Tile
            className={
              Vitals.HeartRate?.abnormal ? "abnormal-tiles" : "vital-tiles"
            }
          >
            {vitalsHeaders.header3}
            <br />
            <br />
            {Vitals.HeartRate?.value ? Vitals.HeartRate?.value : "-"}{" "}
            {VitalUnits.Pulse ? VitalUnits.Pulse : "-"}
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
            {vitalsHeaders.header4}
            <br />
            <br />
            {Vitals.RespiratoryRate?.value
              ? Vitals.RespiratoryRate?.value
              : "-"}{" "}
            {VitalUnits["Respiratory Rate"]
              ? VitalUnits["Respiratory Rate"]
              : "-"}
          </Tile>
        </Column>
        <Column>
          <Tile
            className={
              Vitals.Weight?.abnormal ? "abnormal-tiles" : "vital-tiles"
            }
          >
            {vitalsHeaders.header5}
            <br />
            <br />
            {Vitals.Weight?.value ? Vitals.Weight?.value : "-"}{" "}
            {VitalUnits.WEIGHT ? VitalUnits.WEIGHT : "-"}
          </Tile>
        </Column>
        <Column>
          <Tile
            className={
              Vitals.Height?.abnormal ? "abnormal-tiles" : "vital-tiles"
            }
          >
            {vitalsHeaders.header6}
            <br />
            <br />
            {Vitals.Height?.value ? Vitals.Height?.value : "-"}{" "}
            {VitalUnits.HEIGHT ? VitalUnits.HEIGHT : "-"}
          </Tile>
        </Column>
        <Column>
          <Tile
            className={Vitals.SpO2?.abnormal ? "abnormal-tiles" : "vital-tiles"}
          >
            {vitalsHeaders.header7}
            <br />
            <br />
            {Vitals.SpO2?.value ? Vitals.SpO2?.value : "-"}{" "}
            {VitalUnits.SpO2 ? VitalUnits.SpO2 : "-"}
          </Tile>
        </Column>
        <Column>
          <Tile
            className={Vitals.BMI?.abnormal ? "abnormal-tiles" : "vital-tiles"}
          >
            {vitalsHeaders.header8}
            <br />
            <br />
            {Vitals.BMI?.value ? Vitals.BMI?.value : "-"}{" "}
            {VitalUnits.BMI ? VitalUnits.BMI : "-"}
          </Tile>
        </Column>
      </Row>
    </>
  );
};
Vitals.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Vitals;
