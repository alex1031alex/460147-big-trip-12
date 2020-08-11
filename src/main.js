import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEventEditTemplate} from "./view/event-edit.js";
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
render(eventsContainer, createEventEditTemplate(events[0]), `beforeend`);

render(eventsContainer, createDaysTemplate(), `beforeend`);
const dayList = page.querySelector(`.trip-days`);

const sortedEventsByDate = events.slice().sort((a, b) => a.date.start - b.date.start);

let showedEventsCount = 0;
let dayNumber = 1;
const currentDate = new Date(sortedEventsByDate[0].date.start);

while (showedEventsCount < sortedEventsByDate.length) {
  const dayEvents = sortedEventsByDate
    .filter((event) => event.date.start.getDate() === (new Date(currentDate).getDate()));

  render(dayList, createDayTemplate(dayNumber, currentDate), `beforeend`);
  const eventsList = page.querySelector(`[data-day="${dayNumber}"] .trip-events__list`);

  dayEvents.forEach((event) => render(eventsList, createEventTemplate(event), `beforeend`));

  showedEventsCount = showedEventsCount + dayEvents.length;
  dayNumber++;
  currentDate.setDate(currentDate.getDate() + 1);
}
