import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import {FilterType} from "./const.js";

const EVENT_COUNT = 20;
const events = [];

for (let i = 0; i < EVENT_COUNT; i++) {
  events.push(generateEvent());
}

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const page = document.querySelector(`.page-body`);
const pageMenuWrapper = page.querySelector(`.trip-controls__menu-wrap`);
const controlsContainer = page.querySelector(`.trip-controls`);
const eventsContainer = page.querySelector(`.trip-events`);

render(pageMenuWrapper, new MenuView(), RenderPosition.AFTERBEGIN);
const filterPresenter = new FilterPresenter(controlsContainer, filterModel);
filterPresenter.init();
// render(controlsContainer, new FilterView(FilterType.EVERYTHING), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(eventsContainer, eventsModel, filterModel);
tripPresenter.render();
