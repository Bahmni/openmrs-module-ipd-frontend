import React, { useEffect } from "react";
import { Column, Row, Tile, SkeletonText,Button,DataTable, TableCell,
  TableHead,
  TableHeader,
  TableBody,
  Table,
  TableRow,Pagination } from "carbon-components-react";
import { getPatientVitals, getPatientVitalsHistory, mapVitalsData, mapVitalsHistory, mapBiometricsHistory, vitalsHistoryHeaders, biometricsHistoryHeaders } from "../utils/VitalsUtils";
import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/Vitals.scss";
import { FormattedMessage } from "react-intl";

const Vitals = (props) => {
  const { patientId } = props;
  const [flag,setFlag] =useState(true);
  const [Vitals, setVitals] = useState({});
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [biometricsHistory, setBiometricsHistory] = useState([]);
  const [VitalUnits, setVitalUnits] = useState({});
  const [VitalsDate, setVitalsDate] = useState(null);
  const [VitalsTime, setVitalsTime] = useState(null);
  const [isLoading, updateIsLoading] = useState(true);
  const [buttonLabel, setButtonLabel] = useState("Vitals history");
  const [vitalsHistoryPage, setVitalsHistoryPage] = useState(1);
  const [vitalsHistoryPageSize, setVitalsHistoryPageSize] = useState(10);
  const [biometricsHistoryPage, setBiometricsHistoryPage] = useState(1);
  const [biometricsHistoryPageSize, setBiometricsHistoryPageSize] = useState(10);


  const NoVitalsMessage = (
    <FormattedMessage
      id={"NO_VITALS_MESSAGE"}
      defaultMessage={"No Vitals available for this patient"}
    />
  );
  const handleClick = () =>{
    if( flag === true){
     setFlag(!flag);}
    else if(flag === false)
     {
       setFlag(!flag);
     }
 }
 const changeVitalsPaginationState = (pageInfo) =>
 {
   if(vitalsHistoryPage != pageInfo.page){
    setVitalsHistoryPage(pageInfo.page)
   }
   if(vitalsHistoryPageSize != pageInfo.pageSize){
    setVitalsHistoryPageSize(pageInfo.pageSize)
   }
 }
 const changeBiometricsPaginationState = (pageInfo) =>
 {
   if(biometricsHistoryPage != pageInfo.page){
    setBiometricsHistoryPage(pageInfo.page)
   }
   if(biometricsHistoryPageSize != pageInfo.pageSize){
    setBiometricsHistoryPageSize(pageInfo.pageSize)
   }
 }
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
      const vitalsHistoryList = await getPatientVitalsHistory(patientId);
      handleVitalUnits(VitalsList.conceptDetails);
      setVitals(mapVitalsData(VitalsList, setVitalsDate, setVitalsTime));
      setVitalsHistory (mapVitalsHistory(vitalsHistoryList));
      setBiometricsHistory(mapBiometricsHistory(vitalsHistoryList));
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
        <Tile className="vital-table">
          <br />
          <div className="vital-date-time">
            {VitalsDate ? VitalsDate : "-"}
            {VitalsTime ? ", " + VitalsTime+"  ": "-"}
            { flag ? (<Button kind="tertiary" className="show-more" size="sm" onClick={handleClick}>{buttonLabel} </Button>) : (
                       <Button kind="tertiary" className="show-more" size="sm" onClick={handleClick}>{buttonLabel}</Button>)}
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
               <span className="vital-headers">
                 {vitalsHeaders.temperature}
               </span>
               <span className="vital-values">
                  {Vitals.Temp?.value ? Vitals.Temp?.value : "-"}{" "}
               <span className="vital-units">
                  {Vitals.Temp?.value ? VitalUnits.Temperature : " "}
                </span> </span> 
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
                <span className="vital-headers">
                 {vitalsHeaders.bloodPressure} 
                </span>
                <span className="vital-values">
                  {Vitals.SystolicPressure?.value || 
                  Vitals.DiastolicPressure?.value
                    ? Vitals.SystolicPressure?.value +
                      "/" +
                      Vitals.DiastolicPressure?.value
                    : "-"}{" "}
                 <span className="vital-units">
                  {Vitals.SystolicPressure?.value
                    ? VitalUnits["Diastolic Blood Pressure"]
                    : " "}
                </span> </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.HeartRate?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              > 
              <span className="vital-headers">
                {vitalsHeaders.heartRate}
              </span>
              <span className="vital-values">
                  {Vitals.HeartRate?.value ? Vitals.HeartRate?.value : "-"}{" "}
               <span className="vital-units">
                  {Vitals.HeartRate?.value ? VitalUnits.Pulse : " "}
              </span> </span>
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
                <span className="vital-headers">
                 {vitalsHeaders.respiratoryRate}
                </span>
                <span className="vital-values">
                  {Vitals.RespiratoryRate?.value
                    ? Vitals.RespiratoryRate?.value
                    : "-"}{" "}
                 <span className="vital-units">
                  {Vitals.RespiratoryRate?.value
                    ? VitalUnits["Respiratory Rate"]
                    : " "}
                </span> </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.Weight?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                <span className="vital-headers"> 
                 {vitalsHeaders.weight}
                </span>
                <span className="vital-values">
                  {Vitals.Weight?.value ? Vitals.Weight?.value : "-"}{" "}
                 <span className="vital-units">
                  {Vitals.Weight?.value ? VitalUnits.WEIGHT : " "}
                </span> </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.Height?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
                <span className="vital-headers">
                  {vitalsHeaders.height}
                </span>
                <span className="vital-values">
                  {Vitals.Height?.value ? Vitals.Height?.value : "-"}{" "}
               <span className="vital-units">
                  {Vitals.Height?.value ? VitalUnits.HEIGHT : " "}
                </span>  </span> 
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.SpO2?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
               <span className="vitsal-headers"> 
                {vitalsHeaders.spO2}
               </span> 
               <span className="vital-values">
                  {Vitals.SpO2?.value ? Vitals.SpO2?.value : "-"}{" "}
                <span className="vital-units">   
                  {Vitals.SpO2?.value ? VitalUnits.SpO2 : " "}
                </span> </span>
              </Tile>
            </Column>
            <Column>
              <Tile
                className={
                  Vitals.BMI?.abnormal ? "abnormal-tiles" : "vital-tiles"
                }
              >
              <span className="vital-headers">
                {vitalsHeaders.BMI}
              </span>  
                <span className="vital-values">
                  {Vitals.BMI?.value ? Vitals.BMI?.value : "-"}{" "}
                 <span className="vital-units">  
                  {Vitals.BMI?.value ? VitalUnits.BMI : " "}
                </span> </span>
              </Tile>
            </Column>
          </Row>
          {flag ? "":(<Tile className="Vitals-Table-view">
               <Tile>
               <DataTable
                  rows= {vitalsHistory}
                  headers={vitalsHistoryHeaders}
                  useZebraStyles={true} >
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table
              {...getTableProps()}
              useZebraStyles
              data-testid="vitals-datatable"
            >
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.id}
                      {...getHeaderProps({
                        header,
                        isSortable: header.isSortable,
                      })}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice((vitalsHistoryPage - 1)*vitalsHistoryPageSize).slice(0,vitalsHistoryPageSize).map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
        <Pagination
              backwardText="Previous page"
              forwardText="Next page"
              itemsPerPageText="Items per page:"
              onChange={changeVitalsPaginationState}
              page={vitalsHistoryPage}
              pageSize={vitalsHistoryPageSize}
              pageSizes={[
                10,
                20,
                ]}
                   size="md"
                  totalItems={vitalsHistory.length}
        />
      </Tile>
      <Tile>
        <DataTable
          rows= {biometricsHistory}
          headers={biometricsHistoryHeaders}
          useZebraStyles={true} >
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table
              {...getTableProps()}
              useZebraStyles
              data-testid="biometrics-datatable"
            >
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.id}
                      {...getHeaderProps({
                        header,
                        isSortable: header.isSortable,
                      })}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
        <Pagination
              backwardText="Previous page"
              forwardText="Next page"
              itemsPerPageText="Items per page:"
              onChange={changeBiometricsPaginationState}
              page={biometricsHistoryPage}
              pageSize={biometricsHistoryPageSize}
              pageSizes={[
                10,
                20,
                ]}
                   size="md"
                  totalItems={biometricsHistory.length}
        />
       </Tile>
     </Tile>)}
        </Tile>
      )}
    </>
  );
};
Vitals.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Vitals;
