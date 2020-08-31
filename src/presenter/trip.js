import SortingView from "../view/sorting.js";
import NoEventView from "../view/no-event.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import EventView from "../view/event.js";
import EventFormView from "../view/event-form.js";
import {render, RenderPosition, replace} from "../utils/render.js";
import {isEscKey} from "../utils/common.js";
import {sortByTime, sortByPrice} from "../utils/event.js";
import {SortType} from "../const.js";

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
    this._renderDay();
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

  _renderDay() {
    if (this._currentSortType === SortType.EVENT) {
      const eventsByDate = new Map();

      this._events.slice()
        .sort((a, b) => a.date.start - b.date.start)
        .forEach((event) => {
          const day = +event.date.start.getDate();

          if (!eventsByDate.has(day)) {
            eventsByDate.set(day, []);
          }

          const dayEvents = eventsByDate.get(day);
          dayEvents.push(event);
        });

      Array.from(eventsByDate.entries()).forEach((entry, index) => {
        const [, eventsForDay] = entry;

        if (eventsForDay.length && eventsForDay.length !== 0) {
          const date = eventsForDay[0].date.start;
          const dayNumber = index + 1;
          const dayView = new DayView(dayNumber, date);

          render(this._eventsContainer, dayView, RenderPosition.BEFOREEND);

          const eventsList = dayView.getEventsList();

          eventsForDay.forEach((event) => {
            this._renderEvent(eventsList, event);
          });
        }
      });
    } else {
      const emptyDayView = new DayView();
      const eventsList = emptyDayView.getEventsList();

      render(this._eventsContainer, emptyDayView, RenderPosition.BEFOREEND);
      this._events.forEach((event) => {
        this._renderEvent(eventsList, event);
      });
    }
  }

  _renderEvent(eventListElement, event) {
    const eventComponent = new EventView(event);
    const eventFormComponent = new EventFormView(event);

    const replaceEventToForm = () => {
      replace(eventFormComponent, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventFormComponent);
    };

    const onEscKeyDown = (evt) => {
      if (isEscKey(evt.key)) {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.setRollupButtonClickHandler(() => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventFormComponent.setSubmitHandler(() => {
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(eventListElement, eventComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._events.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSorting();
    this._renderDayList();

    this._renderDay();
  }
}
