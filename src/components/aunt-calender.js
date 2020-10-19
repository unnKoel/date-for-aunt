import React, {useState} from 'react';
import Calender from './calendar';
import {
  getCurrentYear,
  getCurrentMonth,
  inOrdecreaseDate,
  getDayNumbers,
  isHistoryMonth,
  getDaysBetween,
  getDiffDate,
} from '../utils';

const now = new Date();

const AuntCalender = ({
  lastPeriodStart,
  duration = 5,
  cycle = 28,
  periods,
  onHistoryMonth = () => {},
}) => {
  // const [year, setYear] = useState(getCurrentYear());
  // const [month, setMonth] = useState(getCurrentMonth());

  const getBasePeriodStart = () => {
    let basePeriodStart;
    const predictStartDate = inOrdecreaseDate(lastPeriodStart, cycle);
    if (predictStartDate.getTime() < now.getTime()) {
      basePeriodStart = now;
    } else {
      basePeriodStart = lastPeriodStart;
    }

    return basePeriodStart;
  };

  const collectMonthStartPeriod = (startRemainder, monthStartDate) => {
    if (startRemainder < duration) {
      const periodDays = duration - startRemainder;
      const endDate = inOrdecreaseDate(monthStartDate, periodDays);
      return getDiffDate(monthStartDate, endDate);
    }

    return [];
  };

  const collectMonthEndPeriod = (
    endRemainder,
    monthStartDate,
    monthDayNumbers
  ) => {
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
  };

  const collectDuringMonthPeriod = (
    basePeriodStart,
    endCycleAmount,
    startCycleAmount
  ) => {
    const diffCycleAmount = endCycleAmount - startCycleAmount - 1;
    const periods = [];

    if (diffCycleAmount >= 1) {
      let periodStart = inOrdecreaseDate(
        basePeriodStart,
        startCycleAmount * cycle
      );

      for (let i = 1; i < diffCycleAmount + 1; i++) {
        periodStart = inOrdecreaseDate(periodStart, i * cycle);
        const periodEnd = inOrdecreaseDate(periodStart, duration);
        periods.push(getDiffDate(periodStart, periodEnd));
      }
    }

    return periods;
  };

  // prdict peroids with month.
  const predictPeriods = ({year, month}) => {
    if (!lastPeriodStart) return;
    const basePeriodStart = getBasePeriodStart();
    const monthDayNumbers = getDayNumbers(year, month);
    const monthStartDate = new Date(year, month - 1, 1);
    const distanceWithStart = getDaysBetween(basePeriodStart, monthStartDate);
    const distanceWithEnd = distanceWithStart + monthDayNumbers;
    // compute the cycle number and remainder during month.
    const startRemainder = distanceWithStart % cycle;
    const startCycleAmount = parseInt(distanceWithStart / cycle);

    const endRemainder = distanceWithEnd % cycle;
    const endCycleAmount = parseInt(distanceWithEnd / cycle);

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
      endCycleAmount,
      startCycleAmount
    );

    return duringMonethPeroids.push(monthStartPeriod).push(monthEndPeriod);
  };

  const handleDaySelect = (no) => {
    console.log(no);
  };

  const handleMonthChange = ({year, month}) => {
    console.log(year, month);
    const historyMonth = isHistoryMonth({year, month});
    // if now or future month, then predict periods.
    // other ways, then request real periods.
    if (!historyMonth) {
      predictPeriods({year, month});
      return;
    }
    onHistoryMonth({year, month});
  };

  const highlights = [
    {className: 'pink', group: [1, 2, 3, 4, 5]},
    {className: 'pink', group: [20, 21, 22, 23, 24]},
  ];

  return (
    <div className="App">
      <Calender
        onDaySelect={handleDaySelect}
        onMonthChange={handleMonthChange}
        highlights={highlights}
      />
    </div>
  );
};

export default AuntCalender;
