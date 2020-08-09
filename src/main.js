import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEventEditTemplate} from "./view/event-edit.js";
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

events.slice(1).forEach((event) => render(eventsContainer, createEventTemplate(event), `beforeend`));
