import moment from "moment";

const FULL_ESC_KEY = `Escape`;
const SHORT_ESC_KEY = `Esc`;
const MILLISECONDS_IN_DAY = 86340000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MAX_DAYS_IN_MONTH = 31;

const isEscKey = (key) => key === FULL_ESC_KEY || key === SHORT_ESC_KEY;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomItem = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

const getLocalTime = (date) => {
  return date.toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: false});
};

const getTimeInterval = (startDate, endDate) => {
  return endDate.getTime() - startDate.getTime();
};

const formatTimeInterval = (interval) => {
  const totalMinutes = moment.duration(interval).asMinutes();
  if (totalMinutes < MINUTES_IN_HOUR) {
    return moment.utc(interval).format(`mm[m]`);
  }

  const totalHours = moment.duration(interval).asHours();
  if (totalHours < HOURS_IN_DAY) {
    return moment.utc(interval).format(`hh[h] mm[m]`);
  }

  const totalDays = moment.duration(interval).asDays();
  if (totalDays < MAX_DAYS_IN_MONTH) {
    return moment.utc(interval - MILLISECONDS_IN_DAY).format(`D[D] hh[h] mm[m]`);
  }

  const wholeDays = Math.trunc(totalDays);
  const remainingHours = Math.trunc(totalHours - (wholeDays * HOURS_IN_DAY));

  const wholeDaysAsMinutes = wholeDays * HOURS_IN_DAY * MINUTES_IN_HOUR;
  const remainingHoursAsMinutes = remainingHours * MINUTES_IN_HOUR;
  const remainingMinutes = Math.trunc(Math.ceil(totalMinutes - wholeDaysAsMinutes - remainingHoursAsMinutes));

  return `${wholeDays}D ${remainingHours}H ${remainingMinutes}M`;
};

const convertToMachineFormat = (date, isTimeShown = true) => {
  const year = date.getFullYear();
  const month = date.toLocaleString(`en-US`, {month: `2-digit`});
  const day = date.toLocaleString(`en-US`, {day: `2-digit`});
  const time = date.toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`, hour12: false});

  return isTimeShown ? `${year}-${month}-${day}T${time}` : `${year}-${month}-${day}`;
};

const localizeDate = (date) => {
  const year = date.toLocaleString(`en-US`, {year: `2-digit`});
  const month = date.toLocaleString(`en-US`, {month: `2-digit`});
  const day = date.toLocaleString(`en-US`, {day: `2-digit`});
  const time = date.toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: false});

  return `${day}/${month}/${year} ${time}`;
};

const capitalizeWord = (word) => {
  return `${word[0].toUpperCase()}${word.substring(1)}`;
};

const isDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB);
};

export {
  isEscKey,
  getRandomInteger,
  getRandomItem,
  getLocalTime,
  getTimeInterval,
  formatTimeInterval,
  convertToMachineFormat,
  localizeDate,
  capitalizeWord,
  isDatesEqual,
};
