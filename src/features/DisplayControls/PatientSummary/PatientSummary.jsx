import React, { useEffect } from "react";

const PatientSummary = () => {
  useEffect(() => {
    console.log("mounting test");

    return () => {
      console.log("unmounting");
    };
  }, []);

  return <div style={{ padding: "10px" }}>PatientSummary</div>;
};

export default PatientSummary;
