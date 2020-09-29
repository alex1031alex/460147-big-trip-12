import MenuView from "./view/menu.js";
import StatsView from "./view/stats.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import DestinationsModel from "./model/destinations.js";
import OffersModel from "./model/offers.js";
import FilterPresenter from "./presenter/filter.js";
import {UpdateType, MenuItem} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic hh54vTwSC8ne65liM22a`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const page = document.querySelector(`.page-body`);
const pageMenuWrapper = page.querySelector(`.trip-controls__menu-wrap`);
const controlsContainer = page.querySelector(`.trip-controls`);
const eventsContainer = page.querySelector(`.trip-events`);
const newEventButton = page.querySelector(`.trip-main__event-add-btn`);

const menuComponent = new MenuView();
render(pageMenuWrapper, menuComponent, RenderPosition.AFTERBEGIN);

const activateMenuControls = () => {
  menuComponent.setMenuClickHandler(handleMenuClick);

  newEventButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (statsComponent) {
      handleMenuClick(MenuItem.ADD_NEW_EVENT);
    } else {
      tripPresenter.addNewEvent(newEventButtonDisableToggle);
    }
  });
};

let statsComponent = null;

const api = new Api(END_POINT, AUTHORIZATION);
const filterPresenter = new FilterPresenter(controlsContainer, filterModel);
const tripPresenter = new TripPresenter(
    eventsContainer,
    eventsModel,
    filterModel,
    destinationsModel,
    offersModel,
    api
);

const newEventButtonDisableToggle = (isButtonDisabled) => {
  newEventButton.disabled = isButtonDisabled;
};

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

filterPresenter.init();
tripPresenter.render();

api.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(
        UpdateType.DESTINATIONS_LOADED,
        destinations
    );
  });

api.getOffers()
  .then((offers) => {
    offersModel.setOffers(
        UpdateType.OFFERS_LOADED,
        offers
    );
  });

api.getEvents()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    activateMenuControls();
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    activateMenuControls();
  });
