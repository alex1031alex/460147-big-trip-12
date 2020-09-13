import {getTimeInterval} from "./common.js";
import {FilterType} from "../const.js";

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

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => event.date.start > new Date()),
  [FilterType.PAST]: (events) => events.filter((event) => event.date.end < new Date())
};

export {sortByPrice, sortByTime, groupByDates, filter};
