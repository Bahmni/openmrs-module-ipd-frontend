import React from 'react'
import { Tile, Row, Column} from "carbon-components-react";
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useEffect } from 'react';





const PatientDetails = ({patientDetails, patientDetailsHeaders, contacts, relationships}) => {
    const [locationComponent, setLocationComponents]= useState([]);
    const locationMapping = ()=> {
        let reveresdAddress = [];
        for (const key in patientDetails.locations) {
            if (patientDetails.locations.hasOwnProperty(key)) {
              let value =  <span className="details-value">
              {key} : {patientDetails.locations[key] !=null ? patientDetails.locations[key] : " "}
           </span>
         setLocationComponents( (locationComponent) => [...locationComponent, value])
            }
    }}
    useEffect(()=>{
        locationMapping();
    },[])
  return (
    <Tile className="patient-details">
        <Row>
          <Column>
           <Tile className="details-tile">
             <span className="details-headers">
              {patientDetailsHeaders.address}
             </span>
           {
            locationComponent.map((location)=>{
             return location
            })
            }
           </Tile>
          </Column>
          <Column>
            <Tile className="details-tile">
                <span className="details-headers">
                    {patientDetailsHeaders.contactDetails}
                </span>
                {contacts.map((contact)=> { 
                    return (
                        <span key={contact.id} className='details-value'>
                            {contact.name} : {contact.value}
                        </span>
                    )
                })}
           </Tile>
          </Column>
          <Column>
            <Tile className="details-tile">
                <span className="details-headers">
                    {patientDetailsHeaders.relationships}
                </span>
                {relationships.map((relationship)=> { 
                    return (
                        <span key={relationship.id} className='details-value'>
                            {relationship.relationshipType} : {relationship.name}
                        </span>
                    )
                })}
           </Tile>
          </Column>
        </Row>
       </Tile>
  )
};

export default PatientDetails

PatientDetails.propTypes = {
    patientDetails: PropTypes.object.isRequired,
    patientDetailsHeaders: PropTypes.object.isRequired,
    contacts: PropTypes.array.isRequired,
    relationships: PropTypes.array.isRequired
    };