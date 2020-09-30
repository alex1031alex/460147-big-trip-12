import SortingView from "../view/sorting.js";
import NoEventView from "../view/no-event.js";
import LoadingView from "../view/loading.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortByTime, sortByPrice, groupByDates, filter} from "../utils/event.js";
import {SortType, UserAction, UpdateType, FilterType} from "../const.js";
import EventPresenter, {State as EventPresenterViewState} from "./event.js";
import EventNewPresenter from "./event-new.js";

const CONTAINER_HIDDEN_CLASS = `trip-events--hidden`;

export default class Trip {
  constructor(
      tripContainer,
      eventsModel,
      filterModel,
      destinationsModel,
      offersModel,
      api
  ) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;
    this._currentSortType = SortType.EVENT;
    this._eventPresenter = {};
    this._days = [];
    this._isLoading = true;
    this._isDestinationsLoaded = false;
    this._isOffersLoaded = false;

    this._noEventView = new NoEventView();
    this._loadingView = new LoadingView();
    this._sortingView = null;
    this._dayListView = new DayListView();

    this._eventsContainer = this._dayListView.getElement();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(
        this._dayListView,
        this._handleViewAction,
        this._destinationsModel,
        this._offersModel
    );
  }

  _showTripContainer() {
    this._tripContainer.classList.remove(CONTAINER_HIDDEN_CLASS);
  }

  _hideTripContainer() {
    this._tripContainer.classList.add(CONTAINER_HIDDEN_CLASS);
  }

  render() {
    this._showTripContainer();
    this._renderTrip();

    this._eventsModel.addObserver(this._handleModelUpdate);
    this._filterModel.addObserver(this._handleModelUpdate);
    this._destinationsModel.addObserver(this._handleModelUpdate);
    this._offersModel.addObserver(this._handleModelUpdate);
  }

  addNewEvent(disableNewEventButton) {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this._noEventView) {
      remove(this._noEventView);
    }

    this._eventNewPresenter.init(disableNewEventButton);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME: {
        return filteredEvents.sort(sortByTime);
      }
      case SortType.PRICE: {
        return filteredEvents.sort(sortByPrice);
      }
      default: {
        return filteredEvents;
      }
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT: {
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => this._eventsModel.updateEvent(updateType, response))
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      }
      case UserAction.ADD_EVENT: {
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      }
      case UserAction.DELETE_EVENT: {
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      }
    }
  }

  _handleModelUpdate(updateType, update) {
    if (this._noEventView) {
      remove(this._noEventView);
    }

    switch (updateType) {
      case UpdateType.PATCH: {
        this._eventPresenter[update.id].init(update);
        break;
      }
      case UpdateType.MINOR: {
        this._clearDayList();
        this._renderDays();
        break;
      }
      case UpdateType.MAJOR: {
        this._clearTripContainer();
        this._renderTrip();
        break;
      }
      case UpdateType.INIT: {
        this._checkLoading();
        break;
      }
      case UpdateType.OFFERS_LOADED: {
        this._isOffersLoaded = true;
        this._checkLoading();
        break;
      }
      case UpdateType.DESTINATIONS_LOADED: {
        this._isDestinationsLoaded = true;
        this._checkLoading();
        break;
      }
    }
  }

  _checkLoading() {
    if (this._isDestinationsLoaded && this._isOffersLoaded) {
      this._isLoading = false;
      remove(this._loadingView);
      this._renderTrip();
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _clearDayList() {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((eventPresenter) => eventPresenter.destroy());
    this._eventPresenter = {};

    this._days.forEach((day) => remove(day));
    this._days = [];
  }

  _clearTripContainer(resetSortType = true) {
    this._clearDayList();

    if (this._sortingView) {
      remove(this._sortingView);
    }

    if (resetSortType) {
      this._currentSortType = SortType.EVENT;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._eventNewPresenter.destroy();

    this._currentSortType = sortType;
    this._clearDayList();
    this._renderDays();
  }

  _renderNoEvents() {
    if (this._noEventView === null) {
      this._noEventView = new NoEventView();
    }

    render(this._tripContainer, this._noEventView, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    if (this._loadingView === null) {
      this._loadingView = new LoadingView();
    }

    render(this._tripContainer, this._loadingView, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    this._sortingView = new SortingView(this._currentSortType);
    this._sortingView.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortingView, RenderPosition.AFTERBEGIN);
  }

  _renderDayList() {
    render(this._tripContainer, this._dayListView, RenderPosition.BEFOREEND);
  }

  _renderDay(dayView) {
    render(this._eventsContainer, dayView, RenderPosition.BEFOREEND);
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(
        container,
        this._handleViewAction,
        this._handleModeChange,
        this._destinationsModel,
        this._offersModel
    );
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(container, events) {
    events.forEach((event)=> {
      this._renderEvent(container, event);
    });
  }

  _renderEventsByDates(eventsByDates) {
    Array.from(eventsByDates.entries()).forEach((entry, index) => {
      const [, eventsForDay] = entry;

      if (eventsForDay.length && eventsForDay.length !== 0) {
        const date = eventsForDay[0].date.start;
        const dayNumber = index + 1;
        const dayView = new DayView(dayNumber, date);
        const eventsList = dayView.getEventsList();
        this._days.push(dayView);

        this._renderDay(dayView);
        this._renderEvents(eventsList, eventsForDay);
      }
    });
  }

  _renderDays() {
    const events = this._getEvents();

    if (this._currentSortType === SortType.EVENT) {
      const eventsByDates = groupByDates(events);
      this._renderEventsByDates(eventsByDates);

    } else {
      const emptyDayView = new DayView();
      const eventsList = emptyDayView.getEventsList();
      this._days.push(emptyDayView);

      this._renderDay(emptyDayView);
      this._renderEvents(eventsList, events);
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length === 0) {
      this._renderDayList();
      this._renderNoEvents();
      return;
    }
    this._renderSorting();
    this._renderDayList();

    this._renderDays();
  }

  destroy() {
    this._clearTripContainer();
    this._hideTripContainer();

    this._eventsModel.removeObserver(this._handleModelUpdate);
    this._filterModel.removeObserver(this._handleModelUpdate);
  }
}
