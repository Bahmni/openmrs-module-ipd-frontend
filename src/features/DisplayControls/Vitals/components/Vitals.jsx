import React ,{useEffect} from "react";
import { Grid, Column, ColumnHang, GridSettings, Row } from "carbon-components-react";
import { getPatientVitals } from "../utils/VitalsUtils";
import { useState } from "react";
import PropTypes from "prop-types";

const Vitals = (props) => {
  const { patientId } = props;
  const [Vitals, setVitals] = useState({});

  const getVitals = async () => {
    const VitalsList = await getPatientVitals(patientId);
    setVitals(mapVitalsData(VitalsList));
    console.log(Vitals);
  };

  const mapVitalsData = (VitalsList) => {
    console.log("Vitalslist",VitalsList);
    let mappedVitals ={};
      if (VitalsList.tabularData)
         {const tabularData = VitalsList.tabularData;

          let latestDate = null;
          for (const dateKey in tabularData) {
            if (tabularData.hasOwnProperty(dateKey)) {
              if (latestDate === null || dateKey > latestDate) {
                latestDate = dateKey;
              }
            }
          }
          
          if (latestDate !== null) {
              console.log("dAte",latestDate);
            mappedVitals = {
              Temp: tabularData[latestDate].Temperature.value,
              HeartRate: parseInt(tabularData[latestDate].Pulse.value,10),
              SystolicPressure: parseInt(tabularData[latestDate]['Systolic Blood Pressure'].value,10),
              DiastolicPressure: parseInt(tabularData[latestDate]['Diastolic Blood Pressure'].value,10),
              Height: parseInt(tabularData[latestDate].HEIGHT.value,10),
              Weight: parseInt(tabularData[latestDate].WEIGHT.value,10),
              RespiratoryRate: parseInt(tabularData[latestDate]['Respiratory Rate'].value,10),
              SpO2: parseInt(tabularData[latestDate].SpO2.value,10),
              BMI: tabularData[latestDate].BMI.value
            };
          }};
        return mappedVitals;  
    }    

  useEffect(() => {
    getVitals();
  }, []);


  return (
    <Grid>
      <Row style={{paddingTop:0.5}}>
        <Column>
           Date,Time
        </Column>
      </Row>
      <Row style={{paddingBottom:1}}>
          <Column sm={3} md={2} lg={1}>
          Temp
          </Column>
          <Column sm={3} md={1} lg={2}>
            BP
          </Column>
          <Column sm={3} md={1} lg={1} >
            HeartRate
          </Column>
          <Column sm={3} md={1} lg={1} style={{color:"red"}} >
            R.Rate
          </Column>
          <Column sm={3} md={1} lg={1}>
            Weight
          </Column>
          <Column sm={3} md={1} lg={1}>
            Height
          </Column>
          <Column sm={3} md={1} lg={1}>
            SpO2
          </Column>
          <Column sm={3} md={1} lg={1}>
            BMI
          </Column>
        </Row>
        <Row padding>
          <Column sm={3} md={2} lg={1}>
           {Vitals.Temp}C
          </Column>
          <Column sm={3} md={1} lg={2}>
          {Vitals.SystolicPressure}/{Vitals.DiastolicPressure}mmHg
          </Column>
          <Column sm={3} md={1} lg={1} >
          {Vitals.HeartRate}bpm
          </Column>
          <Column sm={3} md={1} lg={1} style={{color:"red"}}>
          {Vitals.RespiratoryRate}bpm
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.Weight}kg
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.Height}cm
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.SpO2}%
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.BMI}kg/m
          </Column>
        </Row>
    </Grid>
  );
};
Vitals.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Vitals;
