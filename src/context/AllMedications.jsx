import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { ALL_DRUG_ORDERS_URL } from "../constants";

export const AllMedicationsContext = React.createContext({
  getAllDrugOrders: () => {},
});

export const AllMedicationsContextProvider = (props) => {
  const getAllDrugOrders = async (visitUuid) => {
    setMedications((prevState) => ({ ...prevState, isLoading: true }));
    try {
      const response = await axios.get(ALL_DRUG_ORDERS_URL(visitUuid), {
        withCredentials: true,
      });
      if (response.status !== 200) throw new Error(response.statusText);
      setMedications((prevState) => ({
        ...prevState,
        isLoading: false,
        data: response.data,
      }));
    } catch (error) {
      setMedications((prevState) => ({
        ...prevState,
        isLoading: false,
        error,
      }));
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
