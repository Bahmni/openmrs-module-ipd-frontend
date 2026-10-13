import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  FHIR_MEDICATION_REQUEST_URL,
  FHIR_MEDICATION_ADMIN_EMERGENCY_URL,
  ALL_DRUG_ORDERS_URL,
} from "../constants";
import {
  mapMedicationRequestBundleToIpdDrugOrders,
  mapMedicationAdministrationBundleToEmergencyMeds,
} from "../utils/fhirMedicationMapper";
import { IPDContext } from "./IPDContext";

export const AllMedicationsContext = React.createContext({
  getAllDrugOrders: () => {},
});

export const AllMedicationsContextProvider = (props) => {
  const { config } = useContext(IPDContext);
  const enableIpdFhirMigration =
    config?.config?.enableIpdFhirMigration ?? false;

  const getAllDrugOrders = async (visitUuid) => {
    setMedications((prev) => ({ ...prev, isLoading: true }));
    try {
      if (enableIpdFhirMigration) {
        const [medRequestRes, medAdminRes] = await Promise.all([
          axios.get(FHIR_MEDICATION_REQUEST_URL(visitUuid), {
            withCredentials: true,
          }),
          axios.get(FHIR_MEDICATION_ADMIN_EMERGENCY_URL(visitUuid), {
            withCredentials: true,
          }),
        ]);
        const ipdDrugOrders = mapMedicationRequestBundleToIpdDrugOrders(
          medRequestRes.data
        );
        const emergencyMedications =
          mapMedicationAdministrationBundleToEmergencyMeds(medAdminRes.data);
        setMedications((prev) => ({
          ...prev,
          isLoading: false,
          data: { ipdDrugOrders, emergencyMedications },
        }));
      } else {
        const response = await axios.get(ALL_DRUG_ORDERS_URL(visitUuid), {
          withCredentials: true,
        });
        if (response.status !== 200) throw new Error(response.statusText);
        setMedications((prev) => ({
          ...prev,
          isLoading: false,
          data: response.data,
        }));
      }
    } catch (error) {
      setMedications((prev) => ({ ...prev, isLoading: false, error }));
    }
  };

  const initialState = {
    isLoading: false,
    data: null,
    error: null,
    getAllDrugOrders,
  };

  const [medications, setMedications] = useState(initialState);

  return (
    <AllMedicationsContext.Provider value={medications}>
      {props.children}
    </AllMedicationsContext.Provider>
  );
};

AllMedicationsContextProvider.propTypes = {
  children: PropTypes.children,
};
