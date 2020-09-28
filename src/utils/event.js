import {getTimeInterval} from "./common.js";
import {FilterType} from "../const.js";
import {EventCategory, activityTypes} from "../const.js";

const defineEventCategory = (eventType) => {
  if (activityTypes.some((activityType) => activityType === eventType)) {
    return EventCategory.ACTIVITY;
  }

  return EventCategory.TRANSFER;
};

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
  [FilterType.FUTURE]: (events) => {
    const now = new Date();

    return events.filter((event) => event.date.start.getTime() > now.getTime());
  },
  [FilterType.PAST]: (events) => {
    const now = new Date();

    return events.filter((event) => event.date.end.getTime() < now.getTime());
  }
};

export {defineEventCategory, sortByPrice, sortByTime, groupByDates, filter};
