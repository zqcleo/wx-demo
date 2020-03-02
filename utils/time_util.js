const formatDateAndTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('.')
}

const formatTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}
const formatTimeWithSeconds = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//格式化倒计时
var formatCountDown = function (hour, minute, second) {
  return [hour, minute, second].map(formatNumber).join(':');
}

const countSecondsBetweenTwo = function (time1, time2) {
  var seconds1 = (parseInt(time1.substr(0, 2)))
    * 3600 + (parseInt(time1.substr(3, 5)))
    * 60 + parseInt(time1.substring(6, 8));
  var seconds2 = (parseInt(time2.substr(0, 2)))
    * 3600 + (parseInt(time2.substr(3, 5)))
    * 60 + parseInt(time2.substring(6, 8));

  return seconds2 - seconds1;
}

//将时间戳timestamp转化为时间
var timeStampToTime = function (timeStamp) {
  var ts = timeStamp;
  var newDate = new Date();
  newDate.setTime(ts * 1000);
  return formatTime(newDate);
}

var formatTimeStamp = function (date){
  var time = formatDateAndTime(new Date); 
  return time.replace(/\//g, '-');
}

const formatYear = date => {
  const year = date.getFullYear()

  return year
}
const formatMonth = date => {
  const month = date.getMonth() + 1
  return month;
}
const formatDay = date => {
  const day = date.getDate()
  return day;
}
const chiaFormatWeek = date => {
  const week_num = date.getDay();
  var week = "";
  switch (week_num) {
    case 0:
      week = '周日'
      break;
    case 1:
      week = '周一'
      break;
    case 2:
      week = '周二'
      break;
    case 3:
      week = '周三'
      break;
    case 4:
      week = '周四'
      break;
    case 5:
      week = '周五'
      break;
    case 6:
      week = '周六'
      break;
    default:
      week = '错误'
      break;
  }

  return week;
}

module.exports = {
  formatDateAndTime: formatDateAndTime,
  timeStampToTime: timeStampToTime,
  formatCountDown: formatCountDown,
  formatDate: formatDate,
  formatTime: formatTime,
  formatTimeWithSeconds: formatTimeWithSeconds,
  formatMonth: formatMonth,
  formatDay: formatDay,
  chiaFormatWeek: chiaFormatWeek,
  formatYear: formatYear,
  formatTimeStamp: formatTimeStamp,
  countSecondsBetweenTwo: countSecondsBetweenTwo
}
