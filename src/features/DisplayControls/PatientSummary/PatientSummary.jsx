import React, { useEffect } from "react";

const PatientSummary = () => {
  useEffect(() => {
    console.log("mounting");

    return () => {
      console.log("unmounting");
    };
  }, []);

  return <div style={{ padding: "10px" }}>PatientSummary</div>;
};

export default PatientSummary;
