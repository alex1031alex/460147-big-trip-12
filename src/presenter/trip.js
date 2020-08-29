import SortingView from "../view/sorting.js";
import NoEventView from "../view/no-event.js";
import DaysView from "../view/days.js";
import DayView from "../view/day.js";
import EventView from "../view/event.js";
import EventFormView from "../view/event-form.js";
import {render, RenderPosition, replace} from "../utils/render.js";

const FULL_ESC_KEY = `Escape`;
const SHORT_ESC_KEY = `Esc`;

export default class Trip {
  constructor(eventsContainer) {
    this._eventsContainer = eventsContainer;

    this._noEventView = new NoEventView();
    this._sortingView = new SortingView();
    this._daysView = new DaysView();
  }

  init(events) {
    this._events = events.slice();
    this._renderTrip();
  }

  _renderNoEvents() {
    render(this._eventsContainer, this._noEventView, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    render(this._eventsContainer, this._sortingView, RenderPosition.BEFOREEND);
  }

  _renderDays() {
    render(this._eventsContainer, this._daysView, RenderPosition.BEFOREEND);
  }

  _renderDay(daysContainer) {
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

        render(daysContainer, dayView, RenderPosition.BEFOREEND);

        const eventsList = this._eventsContainer.querySelector(`[data-day="${index + 1}"] .trip-events__list`);

        eventsForDay.forEach((event) => {
          this._renderEvent(eventsList, event);
        });
      }
    });
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
      if (evt.key === FULL_ESC_KEY || evt.key === SHORT_ESC_KEY) {
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
    this._renderDays();

    const dayList = this._eventsContainer.querySelector(`.trip-days`);
    this._renderDay(dayList);
  }
}
