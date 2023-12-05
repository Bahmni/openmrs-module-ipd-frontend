import React from 'react'
import { Tile, Row, Column} from "carbon-components-react";
import PropTypes from 'prop-types';

const PatientDetails = ({patientDetails, patientDetailsHeaders, contacts, relationships}) => {
  return (
    <Tile className="patient-details">
        <Row>
          <Column>
           <Tile className="details-tile">
             <span className="details-headers">
              {patientDetailsHeaders.address}
             </span>
             <span className="details-value">
                Address : {patientDetails.address !=null ? patientDetails.address : "-"}
             </span>
             <span className="details-value">
                Zone : {patientDetails.zone !=null ? patientDetails.zone : "-"}
             </span>
             <span className="details-value">
                Region : {patientDetails.region !=null ? patientDetails.region : "-"}
             </span>
             <span className="details-value">
                Country : {patientDetails.country !=null ? patientDetails.country : "-"}
             </span>
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