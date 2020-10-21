import React, { useState, useCallback } from "react";
import Calender from "./calendar";
import {
  getCurrentYear,
  getCurrentMonth,
  inOrdecreaseDate,
  getDayNumbers,
  isHistoryMonth,
  getDaysBetween,
  getDiffDate,
  getCurrentDate,
} from "../utils";
import { useEffect } from "react";

const today = getCurrentDate();

const AuntCalender = ({
  lastPeriodStart,
  duration = 7,
  cycle = 28,
  periods,
  onHistoryMonth = () => {},
}) => {
  const [predictedPeriods, setPredictedPeriods] = useState([]);

  const getBasePeriodStart = useCallback(() => {
    let basePeriodStart;
    const predictStartDate = inOrdecreaseDate(lastPeriodStart, cycle);
    if (predictStartDate.getTime() < today.getTime()) {
      basePeriodStart = today;
    } else {
      basePeriodStart = lastPeriodStart;
    }

    return basePeriodStart;
  }, [cycle, lastPeriodStart]);

  const collectMonthStartPeriod = useCallback(
    (startRemainder, monthStartDate) => {
      if (startRemainder < duration) {
        const periodDays = duration - startRemainder;
        const endDate = inOrdecreaseDate(monthStartDate, periodDays);
        return getDiffDate(monthStartDate, endDate);
      }

      return [];
    },
    [duration]
  );

  const collectMonthEndPeriod = useCallback(
    (endRemainder, monthStartDate, monthDayNumbers) => {
      if (endRemainder < duration) {
        const periodDays = endRemainder;
        const startDate = inOrdecreaseDate(
          monthStartDate,
          monthDayNumbers - periodDays
        );
        const endDate = inOrdecreaseDate(monthStartDate, monthDayNumbers);
        return getDiffDate(startDate, endDate);
      }

      return [];
    },
    [duration]
  );

  const collectDuringMonthPeriod = useCallback(
    (basePeriodStart, endRemainder, endCycleAmount, startCycleAmount) => {
      let distanceCycleAmount = endCycleAmount - startCycleAmount;
      const periods = [];

      if (distanceCycleAmount >= 1) {
        if (endRemainder < duration) {
          distanceCycleAmount = distanceCycleAmount - 1;
        }

        let periodStart = inOrdecreaseDate(
          basePeriodStart,
          startCycleAmount * cycle
        );

        for (let i = 1; i < distanceCycleAmount + 1; i++) {
          periodStart = inOrdecreaseDate(periodStart, i * cycle);
          const periodEnd = inOrdecreaseDate(periodStart, duration);
          periods.push(getDiffDate(periodStart, periodEnd));
        }
      }

      return periods;
    },
    [cycle, duration]
  );

  // prdict peroids with month.
  const predictPeriods = useCallback(
    ({ year, month }) => {
      if (!lastPeriodStart) return [];
      const basePeriodStart = getBasePeriodStart();
      const monthDayNumbers = getDayNumbers(year, month);
      let monthStartDate = new Date(year, month - 1, 1);
      monthStartDate = monthStartDate > today ? monthStartDate : today;
      const distanceWithStart = getDaysBetween(basePeriodStart, monthStartDate);
      // compute the cycle number and remainder during month.
      // debugger;
      const sectionStart = distanceWithStart;
      const sectionEnd = distanceWithStart + monthDayNumbers;

      const startRemainder = sectionStart % cycle;
      const startCycleAmount = parseInt(sectionStart / cycle);

      const endRemainder = sectionEnd % cycle;
      const endCycleAmount = parseInt(sectionEnd / cycle);

      const monthStartPeriod = collectMonthStartPeriod(
        startRemainder,
        monthStartDate
      );

      const monthEndPeriod = collectMonthEndPeriod(
        endRemainder,
        monthStartDate,
        monthDayNumbers
      );

      const duringMonethPeroids = collectDuringMonthPeriod(
        basePeriodStart,
        endRemainder,
        endCycleAmount,
        startCycleAmount
      );

      return [...duringMonethPeroids, monthStartPeriod, monthEndPeriod]
        .filter((item) => !!item.length)
        .map((group) => ({ className: "pink", group }));
    },
    [
      collectDuringMonthPeriod,
      collectMonthEndPeriod,
      collectMonthStartPeriod,
      cycle,
      getBasePeriodStart,
      lastPeriodStart,
    ]
  );

  const handleDaySelect = (no) => {
    console.log(no);
  };

  const handleMonthChange = ({ year, month }) => {
    const historyMonth = isHistoryMonth({ year, month });
    // if now or future month, then predict periods.
    // other ways, then request real periods.
    if (!historyMonth) {
      const predictedPeriods = predictPeriods({ year, month });
      console.log("predictedPeriods", predictedPeriods);
      setPredictedPeriods(predictedPeriods);
      return;
    }
    setPredictedPeriods([]);
    onHistoryMonth({ year, month });
  };

  useEffect(() => {
    const currentYear = getCurrentYear();
    const currentMonth = getCurrentMonth();
    const predictedPeriods = predictPeriods({
      year: currentYear,
      month: currentMonth,
    });
    console.log("predictedPeriods", predictedPeriods);
    setPredictedPeriods(predictedPeriods);
  }, [predictPeriods]);

  return (
    <div className="App">
      <Calender
        onDaySelect={handleDaySelect}
        onMonthChange={handleMonthChange}
        highlights={predictedPeriods}
      />
    </div>
  );
};

export default AuntCalender;
