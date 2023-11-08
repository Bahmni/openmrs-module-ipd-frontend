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
              HeartRate: tabularData[latestDate].Pulse.value,
              SystolicPressure: tabularData[latestDate]['Systolic Blood Pressure'].value,
              DiastolicPressure: tabularData[latestDate]['Diastolic Blood Pressure'].value,
              Height: tabularData[latestDate].HEIGHT.value,
              Weight: tabularData[latestDate].WEIGHT.value,
              RespiratoryRate: tabularData[latestDate]['Respiratory Rate'].value,
              SpO2: tabularData[latestDate].SpO2.value,
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
      <Row>
      </Row>
      <Row>
        <Column>
           Date,Time
        </Column>
      </Row>
      <Row>
    
      </Row>
      <Row>
          <Column sm={3} md={2} lg={1}>
          Temp
          </Column>
          <Column sm={3} md={1} lg={1}>
            BP
          </Column>
          <Column sm={3} md={1} lg={1} >
            HeartRate
          </Column>
          <Column sm={3} md={1} lg={1} >
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
           {Vitals.Temp}
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.SystolicPressure}/{Vitals.DiastolicPressure}
          </Column>
          <Column sm={3} md={1} lg={1} >
          {Vitals.HeartRate}
          </Column>
          <Column sm={3} md={1} lg={1} style={{color:"red"}}>
          {Vitals.RespiratoryRate}
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.Weight}
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.Height}
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.SpO2}
          </Column>
          <Column sm={3} md={1} lg={1}>
          {Vitals.BMI}
          </Column>
        </Row>
    </Grid>
  );
};
Vitals.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Vitals;
