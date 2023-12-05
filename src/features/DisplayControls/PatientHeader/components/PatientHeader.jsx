import React, { useEffect, useState }  from "react";
import PropTypes from "prop-types";
import { fetchPatientInfo, getGender, mapContact,getConfigsForPatientContactDetails , fetchPatientProfile, mapRelationships } from "../utils/PatientHeaderUtils";
import { Tile, Grid, Row, Column, SkeletonText,Button, Link } from "carbon-components-react";
import { formatDateAsString } from "../../../../utils/DateFormatter";
import { FormattedMessage } from "react-intl";
import { DDMMYYY_DATE_FORMAT } from "../../../../constants";
import "../styles/PatientHeader.scss";
import { ChevronDown20,ChevronUp20 } from "@carbon/icons-react";
import PatientDetails from "./PatientDetails";

export const PatientHeader = (props) => {
  const { patientId } = props;
  const [showPatientDetails,togglePatientDetails] = useState(false);
  const [patientDetails, updatePatientDetails] = useState({});
  const [isLoading, updateIsLoading] = useState(true);
  const[contacts , setMappedContacts] = useState([]);
  const[relationships , setMappedRelationships] = useState([]);

  const years = <FormattedMessage id="YEARS" defaultMessage="Years" />;
  const showDetails = <FormattedMessage id="SHOW_PATIENT_DETAILS" defaultMessage="Show Details" />;
  const hideDetails = <FormattedMessage id="HIDE_PATIENT_DETAILS" defaultMessage="Hide Details" />;
  const patientDetailsHeaders = {
    address: (
      <FormattedMessage id={"Address_HEADER"} defaultMessage={"Address"} />
    ),
    contactDetails: (
      <FormattedMessage id={"CONTACT_DETAILS_HEADER"} defaultMessage={"Contact Details"} />
    ),
    relationships: (
      <FormattedMessage id={"RELATIONSHIPS_HEADER"} defaultMessage={"Relationships"} />
    )
  }

  const getContactDetailsConfigs = async () => {
    const patientContactConfigs = await getConfigsForPatientContactDetails();
    return patientContactConfigs;
  };

  const extractPatientInfo = (patientInfo) => {
    updatePatientDetails({
      fullName: patientInfo?.person?.preferredName.display,
      givenName: patientInfo?.person?.preferredName.givenName,
      familyName: patientInfo?.person?.preferredName.familyName,
      middleName: patientInfo?.person?.preferredName?.middleName,
      age: patientInfo?.person?.age,
      birthDate: formatDateAsString(
        new Date(patientInfo?.person?.birthdate),
        DDMMYYY_DATE_FORMAT
      ),
      attributes: patientInfo?.person?.attributes,
      address: patientInfo?.person?.preferredAddress?.address5,
      region: patientInfo?.person?.preferredAddress?.display,
      zone: patientInfo?.person?.preferredAddress?.address2,
      country: patientInfo?.person?.preferredAddress?.country,
      gender: getGender(patientInfo?.person?.gender),
      identifier: patientInfo?.identifiers[0]?.identifier,
    });
    updateIsLoading(false);
    return(patientInfo?.person?.attributes);
  };

  const extractPatientRelationships = (patientProfile) => {
  return(patientProfile?.relationships);
}
 
  const toggleDetailsView = () => togglePatientDetails(!showPatientDetails);
  useEffect(() => {
    const getPatientInfo = async () => {
      const patientInfo = await fetchPatientInfo(patientId);
     const patientAttributes = extractPatientInfo(patientInfo);
      const contactConfigs = await getContactDetailsConfigs();
      const patientProfile = await fetchPatientProfile(patientId);
      const patientRelatives = extractPatientRelationships(patientProfile);
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
                      <div className="patient-basic-info">
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
                      </div>
                      {showPatientDetails ? (<Link kind="tertiary" className="show-more" size="sm" onClick={toggleDetailsView}>
                          {hideDetails} <ChevronUp20/> </Link>
                      ) : (
                        <Link kind="tertiary" className="show-more" size="sm" onClick={toggleDetailsView}>
                          {showDetails} <ChevronDown20 /> 
                        </Link>)}
                    </div>
                  </Row>
                </Column>
              </Row>
            </Grid>
            {showPatientDetails && 
              <PatientDetails 
              patientDetails={patientDetails}
              patientDetailsHeaders={patientDetailsHeaders}
              contacts={contacts}
              relationships={relationships}/>}
          </>
        )}
      </Tile>
    </>
  );
};

PatientHeader.propTypes = {
  patientId: PropTypes.string.isRequired,
};
