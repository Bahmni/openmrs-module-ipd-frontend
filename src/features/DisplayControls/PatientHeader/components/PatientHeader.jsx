import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchPatientInfo, getGender } from "../utils/PatientHeaderUtils";
import { Tile, Grid, Row, Column, SkeletonText } from "carbon-components-react";
import { formatDateAsString } from "../../../../utils/DateFormatter";
import { FormattedMessage } from "react-intl";
import { DDMMYYY_DATE_FORMAT } from "../../../../constants";
import "../styles/PatientHeader.scss";

export const PatientHeader = (props) => {
  const { patientId } = props;
  const [patientDetails, updatePatientDetails] = useState({});
  const [isLoading, updateIsLoading] = useState(true);

  const years = <FormattedMessage id="YEARS" defaultMessage="Years" />;
  //   const showDetails = <FormattedMessage id="SHOW_DETAILS" defaultMessage="Show Details" />;

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
      addresses: patientInfo?.person?.addresses,
      gender: getGender(patientInfo?.person?.gender),
      identifier: patientInfo?.identifiers[0]?.identifier,
    });
    updateIsLoading(false);
  };

  useEffect(() => {
    const getPatientInfo = async () => {
      const patientInfo = await fetchPatientInfo(patientId);
      extractPatientInfo(patientInfo);
    };

    getPatientInfo();
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
                    </div>
                  </Row>
                </Column>
              </Row>
            </Grid>
            {/* <Button kind="tertiary" className="show-more">{showDetails} <ChevronDown20 /></Button> */}
          </>
        )}
      </Tile>
    </>
  );
};

PatientHeader.propTypes = {
  patientId: PropTypes.string.isRequired,
};
