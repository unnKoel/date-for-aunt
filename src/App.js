import React, { useCallback, useEffect, useState } from "react";
import data from "./mock";
import "./App.css";
import { getDayNumbers, getDaysBetween } from "./utils";
import AuntCalender from "./components/aunt-calender";

function App() {
  const [periods, setPeriods] = useState([]);

  const filterRecords = () => {
    const records = [];
    data.forEach((item) => {
      const { yearmonth } = item;
      const year = parseInt(yearmonth.substring(0, 4));
      const month = parseInt(yearmonth.slice(4));
      const totalDays = getDayNumbers(year, month);
      for (let i = 1; i < totalDays + 1; i++) {
        if (!!item[`D${i}`]) {
          records.push({ year, month: month + 1, day: i });
        }
      }
    });

    return records;
  };

  const createSection = (records) => {
    let i = 0;
    const periods = [];
    while (i < records.length) {
      const period = [];
      let j = i;
      let prev = records[j];
      let next = records[j + 1];
      while (
        next &&
        getDaysBetween(
          new Date(prev.year, prev.month - 1, prev.day),
          new Date(next.year, next.month - 1, next.day)
        ) === 1
      ) {
        period.push(prev);
        j++;
        prev = records[j];
        next = records[j + 1];
      }
      period.push(prev);
      periods.push(period);
      i = j + 1;
    }

    return periods;
  };

  const getPeriods = useCallback(() => {
    const records = filterRecords();
    const periods = createSection(records);
    setPeriods(periods.map((period) => ({ className: "red", group: period })));
  }, []);

  useEffect(() => {
    getPeriods();
  }, [getPeriods]);

  const handleMonthChange = ({ year, month }) => {
    console.log(year, month);
  };

  return <AuntCalender periods={periods} onMonthChange={handleMonthChange} />;
}

export default App;
