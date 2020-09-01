const FULL_ESC_KEY = `Escape`;
const SHORT_ESC_KEY = `Esc`;

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

const formatTimeInterval = (milliseconds) => {
  const totalSeconds = Math.trunc(milliseconds / 1000);
  if (totalSeconds < 60) {
    return `0M`;
  }

  const totalMinutes = Math.trunc(totalSeconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes}M`;
  }

  const totalHours = Math.trunc(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (totalHours < 24) {
    return `${totalHours}H ${minutes}M`;
  }

  const days = Math.trunc(totalHours / 24);
  const hours = totalHours % 24;

  return `${days}D ${hours}H ${minutes}M`;
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

export {isEscKey,
  getRandomInteger,
  getRandomItem,
  getLocalTime,
  getTimeInterval,
  formatTimeInterval,
  convertToMachineFormat,
  localizeDate,
};
