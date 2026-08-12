import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";

const initialMedicationIndicators = {
  regularCount: 0,
  vdpCount: 0,
};

export const MedicationIndicatorsContext = React.createContext({
  ...initialMedicationIndicators,
  setMedicationIndicators: () => {},
});

export const MedicationIndicatorsContextProvider = (props) => {
  const [medicationIndicators, setMedicationIndicatorsState] = useState(
    initialMedicationIndicators
  );

  const setMedicationIndicators = useCallback((indicators) => {
    setMedicationIndicatorsState(indicators);
  }, []);

  const value = useMemo(
    () => ({ ...medicationIndicators, setMedicationIndicators }),
    [medicationIndicators, setMedicationIndicators]
  );

  return (
    <MedicationIndicatorsContext.Provider value={value}>
      {props.children}
    </MedicationIndicatorsContext.Provider>
  );
};

MedicationIndicatorsContextProvider.propTypes = {
  children: PropTypes.node,
};
