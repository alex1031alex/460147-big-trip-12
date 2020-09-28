import MenuView from "./view/menu.js";
import StatsView from "./view/stats.js";
import {generateEvent, getDestinations} from "./mock/event.js";
import {generateOffers} from "./mock/offers.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import DestinationsModel from "./model/destinations.js";
import OffersModel from "./model/offers.js";
import FilterPresenter from "./presenter/filter.js";
import {UpdateType, MenuItem} from "./const.js";

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

const menuComponent = new MenuView();
let statsComponent = null;

const filterPresenter = new FilterPresenter(controlsContainer, filterModel);
const tripPresenter = new TripPresenter(
    eventsContainer,
    eventsModel,
    filterModel,
    destinationsModel,
    offersModel
);

const newEventButtonDisableToggle = (isButtonDisabled) => {
  newEventButton.disabled = isButtonDisabled;
};

render(pageMenuWrapper, menuComponent, RenderPosition.AFTERBEGIN);

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT: {
      remove(statsComponent);
      menuComponent.resetMenuToDefaultView();
      tripPresenter.render();
      tripPresenter.addNewEvent(newEventButtonDisableToggle);
      break;
    }
    case MenuItem.TABLE: {
      remove(statsComponent);
      tripPresenter.render();
      break;
    }
    case MenuItem.STATS: {
      tripPresenter.destroy();
      statsComponent = new StatsView(eventsModel.getEvents());
      render(eventsContainer, statsComponent, RenderPosition.AFTEREND);
      break;
    }
  }
};

menuComponent.setMenuClickHandler(handleMenuClick);

filterPresenter.init();
tripPresenter.render();

newEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (statsComponent) {
    handleMenuClick(MenuItem.ADD_NEW_EVENT);
  } else {
    tripPresenter.addNewEvent(newEventButtonDisableToggle);
  }
});
