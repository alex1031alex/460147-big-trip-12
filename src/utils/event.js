import {getTimeInterval} from "./common.js";

const sortByTime = (eventA, eventB) => {
  const eventADuration = getTimeInterval(eventA.date.start, eventA.date.end);
  const eventBDuration = getTimeInterval(eventB.date.start, eventB.date.end);

  return eventBDuration - eventADuration;
};

const sortByPrice = (eventA, eventB) => {
  return eventB.cost - eventA.cost;
};

const groupByDates = (events) => {
  const eventsByDates = new Map();

  events.slice()
    .sort((a, b) => a.date.start - b.date.start)
    .forEach((event) => {
      const day = +event.date.start.getDate();

      if (!eventsByDates.has(day)) {
        eventsByDates.set(day, []);
      }

      const dayEvents = eventsByDates.get(day);
      dayEvents.push(event);
    });

  return eventsByDates;
};

export {sortByPrice, sortByTime, groupByDates};
