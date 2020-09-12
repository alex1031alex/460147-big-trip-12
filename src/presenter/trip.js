import SortingView from "../view/sorting.js";
import NoEventView from "../view/no-event.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortByTime, sortByPrice, groupByDates} from "../utils/event.js";
import {updateItem} from "../utils/common.js";
import {SortType} from "../const.js";
import EventPresenter from "./event.js";

export default class Trip {
  constructor(tripContainer, eventsModel) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._currentSortType = SortType.EVENT;
    this._eventPresenter = {};
    this._days = [];

    this._noEventView = new NoEventView();
    this._sortingView = new SortingView();
    this._dayListView = new DayListView();

    this._eventsContainer = this._dayListView.getElement();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  render(events) {
    this._events = events.slice();
    this._sourcedEvents = events.slice();

    this._renderTrip();
  }

  _getEvents() {
    return this._eventsModel.getEvents();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedEvents = updateItem(this._sourcedEvents, updatedEvent);
    this._clearEventsList();
    this._renderDays();
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._events.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._events.sort(sortByPrice);
        break;
      default:
        this._events = this._sourcedEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _clearEventsList() {
    Object
      .values(this._eventPresenter)
      .forEach((eventPresenter) => eventPresenter.destroy());
    this._eventPresenter = {};

    this._days.forEach((day) => remove(day));
    this._days = [];
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEventsList();
    this._renderDays();
  }

  _renderNoEvents() {
    render(this._tripContainer, this._noEventView, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    render(this._tripContainer, this._sortingView, RenderPosition.BEFOREEND);
    this._sortingView.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderDayList() {
    render(this._tripContainer, this._dayListView, RenderPosition.BEFOREEND);
  }

  _renderDay(dayView) {
    render(this._eventsContainer, dayView, RenderPosition.BEFOREEND);
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container, this._handleEventChange, this._handleModeChange);
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
    if (this._currentSortType === SortType.EVENT) {
      const eventsByDates = groupByDates(this._events);
      this._renderEventsByDates(eventsByDates);

    } else {
      const emptyDayView = new DayView();
      const eventsList = emptyDayView.getEventsList();
      this._days.push(emptyDayView);

      this._renderDay(emptyDayView);
      this._renderEvents(eventsList, this._events);
    }
  }

  _renderTrip() {
    if (this._events.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSorting();
    this._renderDayList();

    this._renderDays();
  }
}
