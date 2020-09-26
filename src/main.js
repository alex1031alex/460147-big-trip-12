import MenuView from "./view/menu.js";
import {generateEvent, getDestinations} from "./mock/event.js";
import {generateOffers} from "./mock/offers.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import DestinationsModel from "./model/destinations.js";
import OffersModel from "./model/offers.js";
import FilterPresenter from "./presenter/filter.js";
import {UpdateType} from "./const.js";

const EVENT_COUNT = 20;
const events = [];

for (let i = 0; i < EVENT_COUNT; i++) {
  events.push(generateEvent());
}

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(UpdateType.MINOR, getDestinations());

const offersModel = new OffersModel();
generateOffers().forEach((offer) => {
  offersModel.setOffers(UpdateType.PATCH, offer);
});

const page = document.querySelector(`.page-body`);
const pageMenuWrapper = page.querySelector(`.trip-controls__menu-wrap`);
const controlsContainer = page.querySelector(`.trip-controls`);
const eventsContainer = page.querySelector(`.trip-events`);
const newEventButton = page.querySelector(`.trip-main__event-add-btn`);

const newEventButtonDisableToggle = (isButtonDisabled) => {
  if (isButtonDisabled) {
    newEventButton.disabled = true;
  } else {
    newEventButton.disabled = false;
  }
};

render(pageMenuWrapper, new MenuView(), RenderPosition.AFTERBEGIN);
const filterPresenter = new FilterPresenter(controlsContainer, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(
    eventsContainer,
    eventsModel,
    filterModel,
    destinationsModel,
    offersModel);
tripPresenter.render();

newEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.addNewEvent(newEventButtonDisableToggle);
});
