import React, { useEffect, useState }  from "react";
import PropTypes from "prop-types";
import { fetchPatientInfo, getGender, mapContact,getConfigsForPatientContactDetails , fetchPatientProfile, mapRelationships } from "../utils/PatientHeaderUtils";
import { Tile, Grid, Row, Column, SkeletonText,Button } from "carbon-components-react";
import { formatDateAsString } from "../../../../utils/DateFormatter";
import { FormattedMessage } from "react-intl";
import { DDMMYYY_DATE_FORMAT } from "../../../../constants";
import "../styles/PatientHeader.scss";
import { ChevronDown20,ChevronUp20 } from "@carbon/icons-react";

export const PatientHeader = (props) => {
  const { patientId } = props;
  const [flag,setFlag] =useState(true);
  const [patientDetails, updatePatientDetails] = useState({});
  const [patientRelationships , updatePatienRelationships] = useState({});
  const [isLoading, updateIsLoading] = useState(true);
  const[contacts , setMappedContacts] = useState([]);
  const[relationships , setMappedRelationships] = useState([]);
  const [patientContact, setPatientContactConfig] = useState([]);

  const years = <FormattedMessage id="YEARS" defaultMessage="Years" />;
  const showDetails = <FormattedMessage id="SHOW_DETAILS" defaultMessage="Show Details" />;

  const[buttonLabel, setButtonLabel] =useState("Show details");

  const PatientDetailsHeaders = {
    address: (
      <FormattedMessage id={"Address"} defaultMessage={"Address"} />
    ),
    contactDetails: (
      <FormattedMessage id={"Contact Details"} defaultMessage={"Contact Details"} />
    ),
    relationships: (
      <FormattedMessage id={"Relationships"} defaultMessage={"Relationships"} />
    )
  }

  const getContactDetailsConfigs = async () => {
    const patientContactConfigs = await getConfigsForPatientContactDetails();
    console.log("getcontctdetail",patientContactConfigs.contactDetails);
    setPatientContactConfig(patientContactConfigs.contactDetails);
       return patientContactConfigs;
  };

  const extractPatientInfo = (patientInfo) => {
    updatePatientDetails({
      fullName: patientInfo?.person?.preferredName.display,
      givenName: patientInfo?.person?.preferredName.givenName,
      familyName: patientInfo?.person?.preferredName.familyName,
      middleName: patientInfo?.person?.preferredName.middleName,
      age: patientInfo?.person?.age,
      birthDate: formatDateAsString(
        new Date(patientInfo?.person?.birthdate),
        DDMMYYY_DATE_FORMAT
      ),
      attributes: patientInfo?.person?.attributes,
      address: patientInfo?.person?.preferredAddress.address5,
      region: patientInfo?.person?.preferredAddress.display,
      zone: patientInfo?.person?.preferredAddress.address2,
      woreda: patientInfo?.person?.preferredAddress.address3,
      kebele: patientInfo?.person?.preferredAddress.address4,
      country: patientInfo?.person?.preferredAddress.country,
      gender: getGender(patientInfo?.person?.gender),
      identifier: patientInfo?.identifiers[0]?.identifier,
    });
    updateIsLoading(false);
    return(patientInfo?.person?.attributes);
  };

  const extractPatientRelationships = (patientProfile) => {
    updatePatienRelationships ({
      relationships : patientProfile?.relationships,
  });
  return(patientProfile?.relationships);
}
 
  const handleClick = () =>{
     if( flag === true){
      setFlag(!flag);
     setButtonLabel("Hide Details");}
     else if(flag === false)
      {
        setFlag(!flag);
        setButtonLabel("Show Details");
      }
  }
  useEffect(() => {
    const getPatientInfo = async () => {
      const patientInfo = await fetchPatientInfo(patientId);
     const patientAttributes = extractPatientInfo(patientInfo);
      const contactConfigs = await getContactDetailsConfigs();
      const patientProfile = await fetchPatientProfile(patientId);
      const patientRelatives = extractPatientRelationships(patientProfile);
      console.log("patient relatives", patientRelatives);
      setMappedContacts(mapContact(patientAttributes , contactConfigs.contactDetails));
      setMappedRelationships(mapRelationships(patientRelatives));
    };
    getPatientInfo();
      console.log("contacts",contacts);
  }, []);

  return (
    <>
      <Tile className="patient-header">
        {isLoading ? (
          <SkeletonText className="is-loading" data-testid="header-loading" />
        ) : (
          <>
            <Grid>
              <Row className="patient-image-and-details">
                <div className={"patient-image"} />
                <Column>
                  <Row>
                    <Column>
                      <h1 className="patient-name">
                        {patientDetails?.fullName}
                      </h1>
                    </Column>
                  </Row>
                  <Row>
                    <div className="other-info">
                      <h3 className="patient-info">{patientDetails?.gender}</h3>
                      <h3 className="patient-info">
                        {patientDetails?.age} {years}
                      </h3>
                      <h3 className="patient-info">
                        {patientDetails?.birthDate}
                      </h3>
                      <h3 className="patient-info">
                        {patientDetails?.identifier}
                      </h3>
                      { flag ? (<Button kind="tertiary" className="show-more" size="sm" onClick={handleClick}>{buttonLabel} <ChevronDown20 /> </Button>) : (
                       <Button kind="tertiary" className="show-more" size="sm" onClick={handleClick}>{buttonLabel} <ChevronUp20/> </Button>)}
                    </div>
                  </Row>
                </Column>
              </Row>
              {flag ? "":(
      <Tile className="patient-details">
        <Row>
          <Column>
           <Tile className="details-tile">
             <span className="details-headers">
              {PatientDetailsHeaders.address}
             </span>
             <span className="address-type">
              Address : 
             </span>
             <span className="address-value">
              {patientDetails.address !=null ? patientDetails.address : "-"}
             </span>
             <span className="address-type">
              Zone : 
             </span>
             <span className="address-value">
              {patientDetails.zone !=null ? patientDetails.zone : "-"}
             </span>
             <span className="address-type">
              Region : 
             </span>
             <span className="address-value">
              {patientDetails.region !=null ? patientDetails.region : "-"}
             </span>
             <span className="address-type">
              Country : 
             </span>
             <span className="address-value">
              {patientDetails.country !=null ? patientDetails.country : "-"}
             </span>
           </Tile>
          </Column>
          <Column>
           <Tile className="details-tile">
             <span className="details-headers">
              {PatientDetailsHeaders.contactDetails}
             </span>
              {
                contacts.map((contact)=> { return(
                  <span>{contact.name} : {contact.value}</span>)
                })
              }
           </Tile>
          </Column>
          <Column>
           <Tile className="details-tile">
             <span className="details-headers">
              {PatientDetailsHeaders.relationships}
             </span>
             {
              relationships.map((relationship)=> { return(
                  <span>{relationship.relationshipType} : {relationship.name}</span>)
                })
              }
           </Tile>
          </Column>
        </Row>
       </Tile>
       )}
            </Grid>
          </>
        )}
      </Tile>
    </>
  );
};

PatientHeader.propTypes = {
  patientId: PropTypes.string.isRequired,
};
