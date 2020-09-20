import SortingView from "../view/sorting.js";
import NoEventView from "../view/no-event.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortByTime, sortByPrice, groupByDates, filter} from "../utils/event.js";
import {SortType, UserAction, UpdateType, FilterType} from "../const.js";
import EventPresenter from "./event.js";
import EventNewPresenter from "./event-new.js";

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel, destinationsModel) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._currentSortType = SortType.EVENT;
    this._eventPresenter = {};
    this._days = [];

    this._noEventView = new NoEventView();
    this._sortingView = null;
    this._dayListView = new DayListView();

    this._eventsContainer = this._dayListView.getElement();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelUpdate);
    this._filterModel.addObserver(this._handleModelUpdate);

    this._eventNewPresenter = new EventNewPresenter(this._dayListView, this._handleViewAction, destinationsModel);
  }

  render() {
    this._renderTrip();
  }

  addNewEvent() {
    if (this._noEventView) {
      remove(this._noEventView);
    }

    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
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
        this._eventsModel.updateEvent(updateType, update);
        break;
      }
      case UserAction.ADD_EVENT: {
        this._eventsModel.addEvent(updateType, update);
        break;
      }
      case UserAction.DELETE_EVENT: {
        this._eventsModel.deleteEvent(updateType, update);
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
    }
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _clearDayList() {
    Object
      .values(this._eventPresenter)
      .forEach((eventPresenter) => eventPresenter.destroy());
    this._eventPresenter = {};

    this._days.forEach((day) => remove(day));
    this._days = [];
  }

  _clearTripContainer(resetSortType = true) {
    this._clearDayList();

    remove(this._sortingView);

    if (resetSortType) {
      this._currentSortType = SortType.EVENT;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

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

  _renderSorting() {
    if (this._sortingView !== null) {
      this._sortingView = null;
    }

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
        this._destinationsModel
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
    if (this._getEvents().length === 0) {
      this._renderNoEvents();
      return;
    }
    this._renderSorting();
    this._renderDayList();

    this._renderDays();
  }
}
