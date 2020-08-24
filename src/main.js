import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEventFormTemplate} from "./view/event-form.js";
import {createDaysTemplate} from "./view/days.js";
import {createDayTemplate} from "./view/day.js";
import {createEventTemplate} from "./view/event.js";
import {generateEvent} from "./mock/event.js";

const EVENT_COUNT = 20;
const events = [];

for (let i = 0; i < EVENT_COUNT; i++) {
  events.push(generateEvent());
}

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const page = document.querySelector(`.page-body`);
const pageMenuTitle = page.querySelector(`.trip-controls h2`);
const controlsContainer = page.querySelector(`.trip-controls`);
const eventsContainer = page.querySelector(`.trip-events`);

render(pageMenuTitle, createMenuTemplate(), `afterend`);
render(controlsContainer, createFilterTemplate(), `beforeend`);
render(eventsContainer, createSortingTemplate(), `beforeend`);
render(eventsContainer, createEventFormTemplate(events[0]), `beforeend`);

render(eventsContainer, createDaysTemplate(), `beforeend`);
const dayList = page.querySelector(`.trip-days`);

const eventsByDate = new Map();

events.slice()
  .sort((a, b) => a.date.start - b.date.start)
  .slice(1)
  .forEach((event) => {
    const day = +event.date.start.getDate();


    if (!eventsByDate.has(day)) {
      eventsByDate.set(day, []);
    }

    const dayEvents = eventsByDate.get(day);
    dayEvents.push(event);
  });

Array.from(eventsByDate.entries()).forEach((entry, index) => {
  const [, eventsForDay] = entry;

  if (eventsForDay.length && eventsForDay.length !== 0) {
    const date = eventsForDay[0].date.start;

    const dayNumber = index + 1;

    render(dayList, createDayTemplate(dayNumber, date), `beforeend`);

    const eventsList = page.querySelector(`[data-day="${index + 1}"] .trip-events__list`);

    eventsForDay.forEach((event) => {
      render(eventsList, createEventTemplate(event), `beforeend`);
    });
  }
});
