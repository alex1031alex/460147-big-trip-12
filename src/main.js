import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import SortingView from "./view/sorting.js";
import EventFormView from "./view/event-form.js";
import DaysView from "./view/days.js";
import DayView from "./view/day.js";
import EventView from "./view/event.js";
import NoEventView from "./view/no-event.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils.js";

const EVENT_COUNT = 20;
const FULL_ESC_KEY = `Escape`;
const SHORT_ESC_KEY = `Esc`;
const events = [];

for (let i = 0; i < EVENT_COUNT; i++) {
  events.push(generateEvent());
}

const page = document.querySelector(`.page-body`);
const pageMenuWrapper = page.querySelector(`.trip-controls__menu-wrap`);
const controlsContainer = page.querySelector(`.trip-controls`);
const eventsContainer = page.querySelector(`.trip-events`);

const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventFormComponent = new EventFormView(event);

  const replaceEventToForm = () => {
    eventListElement.replaceChild(eventFormComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventFormComponent.getElement());
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

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

render(pageMenuWrapper, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
render(controlsContainer, new FilterView().getElement(), RenderPosition.BEFOREEND);

if (events.length === 0) {
  render(eventsContainer, new NoEventView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(eventsContainer, new SortingView().getElement(), RenderPosition.BEFOREEND);
  render(eventsContainer, new DaysView().getElement(), RenderPosition.BEFOREEND);

  const dayList = page.querySelector(`.trip-days`);

  const eventsByDate = new Map();

  events.slice()
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

      render(dayList, new DayView(dayNumber, date).getElement(), RenderPosition.BEFOREEND);

      const eventsList = page.querySelector(`[data-day="${index + 1}"] .trip-events__list`);

      eventsForDay.forEach((event) => {
        renderEvent(eventsList, event);
      });
    }
  });
}
