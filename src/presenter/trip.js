import SortingView from "../view/sorting.js";
import NoEventView from "../view/no-event.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import {render, RenderPosition} from "../utils/render.js";
import {sortByTime, sortByPrice, groupByDates} from "../utils/event.js";
import {SortType} from "../const.js";
import EventPresenter from "./event.js";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.EVENT;

    this._noEventView = new NoEventView();
    this._sortingView = new SortingView();
    this._dayListView = new DayListView();

    this._eventsContainer = this._dayListView.getElement();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  render(events) {
    this._events = events.slice();
    this._sourcedEvents = events.slice();

    this._renderTrip();
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
    this._eventsContainer.innerHTML = ``;
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

  _renderDays() {
    if (this._currentSortType === SortType.EVENT) {
      const eventsByDates = groupByDates(this._events);

      Array.from(eventsByDates.entries()).forEach((entry, index) => {
        const [, eventsForDay] = entry;

        if (eventsForDay.length && eventsForDay.length !== 0) {
          const date = eventsForDay[0].date.start;
          const dayNumber = index + 1;
          const dayView = new DayView(dayNumber, date);
          const eventsList = dayView.getEventsList();

          render(this._eventsContainer, dayView, RenderPosition.BEFOREEND);
          this._renderEvents(eventsList, eventsForDay);
        }
      });
    } else {
      const emptyDayView = new DayView();
      const eventsList = emptyDayView.getEventsList();

      render(this._eventsContainer, emptyDayView, RenderPosition.BEFOREEND);
      this._renderEvents(eventsList, this._events);
    }
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container);
    eventPresenter.init(event);
  }

  _renderEvents(container, events) {
    events.forEach((event)=> {
      this._renderEvent(container, event);
    });
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
