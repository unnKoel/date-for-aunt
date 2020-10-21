import React, { useState, useCallback, useMemo } from "react";
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
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();

const AuntCalender = ({
  duration = 10,
  cycle = 16,
  periods,
  onMonthChange = () => {},
}) => {
  const [allPeriods, setAllPeriods] = useState([]);
  const lastPeriod = periods.length ? periods[periods.length - 1].group : [];

  const getLastPeriodStart = useCallback(
    (periods) => {
      if (!periods.length) return undefined;

      const { year, month, day } = lastPeriod[0];

      return new Date(year, month - 1, day);
    },
    [lastPeriod]
  );

  const lastPeriodStart = useMemo(() => getLastPeriodStart(periods), [
    getLastPeriodStart,
    periods,
  ]);

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
          periodStart = inOrdecreaseDate(periodStart, cycle);
          const periodEnd = inOrdecreaseDate(periodStart, duration);
          periods.push(getDiffDate(periodStart, periodEnd));
        }
      }

      return periods;
    },
    [cycle, duration]
  );

  // if today in lastPeriod, then cancel current predict
  const cancelCurrentPredict = useCallback(
    (basePeriodStart) => {
      const predictEndDate = inOrdecreaseDate(basePeriodStart, duration);
      if (!lastPeriod.length) return false;

      const lastPeriodEnd = lastPeriod[lastPeriod.length - 1];

      const { year, month, day } = lastPeriodEnd;
      if (
        today.getTime() < predictEndDate.getTime() &&
        today.getTime() > basePeriodStart.getTime() &&
        getDaysBetween(new Date(year, month - 1, day), today) >= 1
      ) {
        return true;
      }
    },
    [duration, lastPeriod]
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

      let predictPeroids = [
        ...duringMonethPeroids,
        monthStartPeriod,
        monthEndPeriod,
      ];

      if (cancelCurrentPredict(basePeriodStart) && false) {
        predictPeroids = predictPeroids.filter((period) => {
          return !period.some(({ year, month, day }) => {
            return (
              year === todayYear && month === todayMonth && day === todayDate
            );
          });
        });
      }

      return predictPeroids
        .filter((item) => !!item.length)
        .map((group) => ({ className: "pink", group }));
    },
    [
      cancelCurrentPredict,
      collectDuringMonthPeriod,
      collectMonthEndPeriod,
      collectMonthStartPeriod,
      cycle,
      getBasePeriodStart,
      lastPeriodStart,
    ]
  );

  const combineWithPeriods = (predictedPeriods, periods) => {
    return [...predictedPeriods, ...periods];
  };

  const handleDaySelect = (no) => {
    console.log(no);
  };

  const handleMonthChange = ({ year, month }) => {
    const historyMonth = isHistoryMonth({ year, month });
    // if now or future month, then predict periods.
    // other ways, then request real periods.
    if (!historyMonth) {
      const predictedPeriods = predictPeriods({ year, month });
      setAllPeriods(combineWithPeriods(predictedPeriods, periods));
    } else {
      setAllPeriods(combineWithPeriods([], periods));
    }

    onMonthChange({ year, month });
  };

  useEffect(() => {
    const currentYear = getCurrentYear();
    const currentMonth = getCurrentMonth();
    const predictedPeriods = predictPeriods({
      year: currentYear,
      month: currentMonth,
    });
    setAllPeriods(combineWithPeriods(predictedPeriods, periods));
  }, [periods, predictPeriods]);

  console.log("allPeriods", allPeriods);

  return (
    <div className="App">
      <Calender
        onDaySelect={handleDaySelect}
        onMonthChange={handleMonthChange}
        highlights={allPeriods}
      />
    </div>
  );
};

export default AuntCalender;
