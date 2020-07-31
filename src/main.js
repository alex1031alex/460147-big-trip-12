import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEventEditTemplate} from "./view/event-edit.js";
import {createEventTemplate} from "./view/event.js";

const EVENT_COUNT = 3;

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
render(eventsContainer, createEventEditTemplate(), `beforeend`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(eventsContainer, createEventTemplate(), `beforeend`);
}
