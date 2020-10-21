import React from "react";
import "./App.css";
import AuntCalender from "./components/aunt-calender";

const lastPeriodStart = new Date(2020, 9, 17);

function App() {
  return <AuntCalender lastPeriodStart={lastPeriodStart} />;
}

export default App;
