const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;

const getDayNumbers = (year, month) => new Date(year, month, 0).getDate();
const getWeekDay = (year, month, day) =>
  new Date(year, month - 1, day).getDay();

export {getCurrentYear, getCurrentMonth, getDayNumbers, getWeekDay};
