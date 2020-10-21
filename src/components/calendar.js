import React, { useState, useEffect, useCallback } from "react";
import {
  getCurrentYear,
  getCurrentMonth,
  getDayNumbers,
  getWeekDay,
} from "../utils";
import "./calender.css";

const Calender = ({ onDaySelect, onMonthChange, highlights = [] }) => {
  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());

  const dayNumbers = getDayNumbers(year, month);
  const weekDayForFirstDay = getWeekDay(year, month, 1);
  const weekDayForLastDay = getWeekDay(year, month, dayNumbers);

  const handlePrevMonth = () => {
    let prevMonth = month - 1;
    let currentYear = year;
    if (prevMonth < 1) {
      currentYear = year - 1;
      setYear(currentYear);
      prevMonth = 12;
    }
    setMonth(prevMonth);
    onMonthChange({ year: currentYear, month: prevMonth });
  };

  const handleNextMonth = () => {
    let nextMonth = month + 1;
    let currentYear = year;
    if (nextMonth > 12) {
      currentYear = year + 1;
      setYear(currentYear);
      nextMonth = 1;
    }
    setMonth(nextMonth);
    onMonthChange({ year: currentYear, month: nextMonth });
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
        year={year}
        month={month}
        dayNumbers={dayNumbers}
        weekDayForFirstDay={weekDayForFirstDay}
        weekDayForLastDay={weekDayForLastDay}
        onDaySelect={onDaySelect}
        highlights={highlights}
      />
    </div>
  );
};

const CalenderHeader = ({ year, month, onPrevMonth, onNextMonth }) => {
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

const CalenderBody = ({
  year,
  month,
  dayNumbers,
  weekDayForFirstDay,
  weekDayForLastDay,
  onDaySelect,
  highlights,
}) => {
  // const calDayPostion = (day, group) => {
  //   let position = "middle";
  //   if (group[0]?.day === day) {
  //     position = "start";
  //   } else if (group[group.length - 1]?.day === day) {
  //     position = "end";
  //   }

  //   return position;
  // };

  const calDayStatus = useCallback(
    (day, highlights) => {
      let dateItem = { no: day };
      for (let i = 0; i < highlights.length; i++) {
        const { group = [], className = "" } = highlights[i];
        if (
          group.find(
            ({ day: itemDay, year: itemYear, month: itemMonth }) =>
              itemDay === day && itemYear === year && itemMonth === month
          )
        ) {
          dateItem = {
            no: day,
            className: className,
            // position: calDayPostion(day, group),
          };
        }
      }

      return dateItem;
    },
    [year, month]
  );

  const fillinList = useCallback(() => {
    const list = Array(weekDayForFirstDay).fill({});

    for (let i = 1; i <= dayNumbers; i++) {
      list.push(calDayStatus(i, highlights));
    }

    return list.concat(Array(6 - weekDayForLastDay).fill({}));
  }, [
    calDayStatus,
    dayNumbers,
    highlights,
    weekDayForFirstDay,
    weekDayForLastDay,
  ]);

  const [list, setList] = useState([]);
  const weekdayNames = ["日", "一", "二", "三", "四", "五", "六"];

  useEffect(() => {
    const fillList = fillinList();
    setList(fillList);
  }, [fillinList]);

  const handleDayClick = (no) => (e) => {
    if (no) {
      onDaySelect(no);
    }
  };

  return (
    <div>
      <div className="container">
        {weekdayNames.map((text) => (
          <div className="item item-text" key={text}>
            {text}
          </div>
        ))}
      </div>
      <div className="container">
        {list.map(({ no, className, position }) => (
          <div
            className={`item ${className}`}
            onClick={handleDayClick(no)}
            key={no}
          >
            <div>{no || ""}</div>
            <div>
              {position === "start" ? ">" : position === "end" ? "=" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calender;
