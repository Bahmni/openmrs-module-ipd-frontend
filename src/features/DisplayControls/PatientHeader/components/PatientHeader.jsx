import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchPatientInfo, getGender } from "../utils/PatientHeaderUtils";
import {
  Tile,
  Grid,
  Row,
  Column,
  Button,
  Loading,
} from "carbon-components-react";
import { Image48 } from "@carbon/icons-react";
import "../styles/PatientHeader.scss";
import { formatDate } from "../../../../utils/DateFormatter";
import { FormattedMessage } from "react-intl";

export const PatientHeader = (props) => {
  const { patientId } = props;
  const years = <FormattedMessage id="YEARS" defaultMessage="Years" />;
  const [patientDetails, updatePatientDetails] = useState({});
  const [isLoading, updateIsLoading] = useState(false);

  const extractPatientInfo = (patientInfo) => {
    updatePatientDetails({
      fullName: patientInfo?.person?.preferredName.display,
      givenName: patientInfo?.person?.preferredName.givenName,
      familyName: patientInfo?.person?.preferredName.familyName,
      middleName: patientInfo?.person?.preferredName.middleName,
      age: patientInfo?.person?.age,
      birthDate: formatDate(
        new Date(patientInfo?.person?.birthdate),
        "DD/MM/YYYY"
      ),
      attributes: patientInfo?.person?.attributes,
      addresses: patientInfo?.person?.addresses,
      gender: getGender(patientInfo?.person?.gender),
      identifier: patientInfo?.identifiers[0]?.identifier,
    });
  };

  useEffect(() => {
    const getPatientInfo = async () => {
      const patientInfo = await fetchPatientInfo(patientId);
      extractPatientInfo(patientInfo);
    };

    updateIsLoading(true);
    getPatientInfo();
    updateIsLoading(false);
  }, []);

  return (
    <>
      <Tile className="patient-header">
        {isLoading ? (
          <Loading />
        ) : (
          <Grid>
            <Row>
              <Button
                renderIcon={Image48}
                hasIconOnly
                className="patient-image"
              ></Button>
              <Column>
                <Row>
                  <Column>
                    <h1>{patientDetails?.fullName}</h1>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <h3 className="patient-info">{patientDetails?.gender}</h3>
                  </Column>
                  <Column>
                    <h3 className="patient-info">
                      {patientDetails?.age} {years}
                    </h3>
                  </Column>
                  <Column>
                    <h3 className="patient-info">
                      {patientDetails?.birthDate}
                    </h3>
                  </Column>
                  <Column>
                    <h3 className="patient-info">
                      {patientDetails?.identifier}
                    </h3>
                  </Column>
                  <Column sm={5} md={7} lg={8} />
                </Row>
              </Column>
            </Row>
          </Grid>
        )}
      </Tile>
    </>
  );
};

PatientHeader.propTypes = {
  patientId: PropTypes.string.isRequired,
};
