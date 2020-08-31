import {getTimeInterval} from "./common.js";

const sortByTime = (eventA, eventB) => {
  const eventADuration = getTimeInterval(eventA.date.start, eventA.date.end);
  const eventBDuration = getTimeInterval(eventB.date.start, eventB.date.end);

  return eventBDuration - eventADuration;
};

const sortByPrice = (eventA, eventB) => {
  return eventB.cost - eventA.cost;
};

export {sortByPrice, sortByTime};
