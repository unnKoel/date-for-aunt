import React, { useEffect, useState } from "react";
import "./switch.css";

const Switch = ({ initStatus }) => {
  const [status, setStatus] = useState(initStatus);

  useEffect(() => {}, []);

  return (
    <div className="switch">
      <div className={`item ${status && "bright"}`}>是</div>
      <div className={`item ${!status && "bright"}`}>否</div>
    </div>
  );
};

export default Switch;
