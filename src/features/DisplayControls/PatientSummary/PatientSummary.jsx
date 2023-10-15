import React, { useEffect } from "react";

const PatientSummary = () => {
  useEffect(() => {
    console.log("mounting");

    return () => {
      console.log("unmounting");
    };
  }, []);

  return <div>PatientSummary</div>;
};

export default PatientSummary;
