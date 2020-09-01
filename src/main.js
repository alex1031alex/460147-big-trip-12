import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";

const EVENT_COUNT = 20;
const events = [];

for (let i = 0; i < EVENT_COUNT; i++) {
  events.push(generateEvent());
}

const page = document.querySelector(`.page-body`);
const pageMenuWrapper = page.querySelector(`.trip-controls__menu-wrap`);
const controlsContainer = page.querySelector(`.trip-controls`);
const eventsContainer = page.querySelector(`.trip-events`);

render(pageMenuWrapper, new MenuView(), RenderPosition.AFTERBEGIN);
render(controlsContainer, new FilterView(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(eventsContainer);
tripPresenter.render(events);
