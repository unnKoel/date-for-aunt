import React, {useState, useEffect, useCallback} from 'react';
import {
  getCurrentYear,
  getCurrentMonth,
  getDayNumbers,
  getWeekDay,
} from '../utils';
import './calender.css';

const Calender = ({onDaySelect, highlights}) => {
  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());

  const dayNumbers = getDayNumbers(year, month);
  const weekDayForFirstDay = getWeekDay(year, month, 1);
  const weekDayForLastDay = getWeekDay(year, month, dayNumbers);

  const handlePrevMonth = () => {
    const prevMonth = month - 1;
    if (prevMonth < 1) {
      setYear((year) => year - 1);
      setMonth(1);
    } else {
      setMonth(prevMonth);
    }
  };

  const handleNextMonth = () => {
    const nextMonth = month + 1;
    if (nextMonth > 12) {
      setYear((year) => year + 1);
      setMonth(1);
    } else {
      setMonth(nextMonth);
    }
  };

  return (
    <div className="calender">
      <CalenderHeader
        year={year}
        month={month}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <CalenderBody
        dayNumbers={dayNumbers}
        weekDayForFirstDay={weekDayForFirstDay}
        weekDayForLastDay={weekDayForLastDay}
      />
    </div>
  );
};

const CalenderHeader = ({year, month, onPrevMonth, onNextMonth}) => {
  return (
    <div className="header">
      <span onClick={onPrevMonth}>≤</span>
      <span>
        {year}年{month}月
      </span>
      <span onClick={onNextMonth}>≥</span>
    </div>
  );
};

const CalenderBody = ({dayNumbers, weekDayForFirstDay, weekDayForLastDay}) => {
  const fillinList = useCallback(() => {
    const list = Array(weekDayForFirstDay).fill({});
    for (let i = 1; i <= dayNumbers; i++) {
      list.push({no: i});
    }

    return list.concat(Array(6 - weekDayForLastDay).fill({}));
  }, [dayNumbers, weekDayForFirstDay, weekDayForLastDay]);

  const [list, setList] = useState([]);
  const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];

  useEffect(() => {
    const fillList = fillinList();
    setList(fillList);
  }, [fillinList]);

  return (
    <div>
      <div className="container">
        {weekdayNames.map((text) => (
          <div className="item item-text">{text}</div>
        ))}
      </div>
      <div className="container">
        {list.map(({no, className}) => (
          <div className={`item ${className}`}>{no || ''}</div>
        ))}
      </div>
    </div>
  );
};

export default Calender;
