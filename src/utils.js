const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;

const getDayNumbers = (year, month) => new Date(year, month, 0).getDate();
const getWeekDay = (year, month, day) =>
  new Date(year, month - 1, day).getDay();

/**
 **datestr:形如‘2017-06-12’的字符串
 **return Date 对象
 **/
function getDate(datestr) {
  var temp = datestr.split('-');
  if (temp[1] === '01') {
    temp[0] = parseInt(temp[0], 10) - 1;
    temp[1] = '12';
  } else {
    temp[1] = parseInt(temp[1], 10) - 1;
  }
  //new Date()的月份入参实际都是当前值-1
  var date = new Date(temp[0], temp[1], temp[2]);
  return date;
}
/**
 ***获取两个日期间的所有日期
 ***默认start<end
 **/
function getDiffDate(start, end) {
  var startTime = start;
  var endTime = end;
  var dateArr = [];
  while (endTime.getTime() - startTime.getTime() > 0) {
    var year = startTime.getFullYear();
    var month =
      (startTime.getMonth() + 1).toString().length === 1
        ? parseInt(startTime.getMonth().toString(), 10) + 1
        : startTime.getMonth() + 1;
    var day = startTime.getDate();
    dateArr.push({year, month, day});
    startTime.setDate(startTime.getDate() + 1);
  }
  return dateArr;
}

function inOrdecreaseDate(date, days) {
  const dd = new Date(date);
  dd.setDate(dd.getDate() + days);
  return dd;
}

function formatDate(date) {
  var y = date.getFullYear();
  var m =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

  return y + '-' + m + '-' + d;
}

function isHistoryMonth({year, month}) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return true;
  }

  return false;
}

function getDaysBetween(startDate, endDate) {
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
  return days;
}

function getCurrentDate() {
  const year = getCurrentYear();
  const month = getCurrentMonth();
  const date = new Date().getDate();

  return new Date(year, month - 1, date);
}

export {
  getCurrentYear,
  getCurrentMonth,
  getDayNumbers,
  getWeekDay,
  getDiffDate,
  getDate,
  inOrdecreaseDate,
  formatDate,
  isHistoryMonth,
  getDaysBetween,
  getCurrentDate,
};
