import AbstractView from "./abstract.js";
import {getLocalTime, getTimeInterval, formatTimeInterval, convertToMachineFormat} from "../utils/common.js";
import {EventCategory} from "../const.js";

const MAX_SHOWING_OFFER_COUNT = 3;

const createOfferTemplate = (offer) => {
  if (!offer) {
    return ``;
  }

  const {name, cost} = offer;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${name}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${cost}</span>
    </li>`
  );
};

const createEventTemplate = (event) => {
  const {eventCategory, type, destination, date: {start, end}, offers, cost} = event;

  const isTransferEvent = eventCategory === EventCategory.TRANSFER;
  const destinationTemplate = `${type} ${isTransferEvent ? `to` : `in`} ${destination ? destination.name : ``}`;

  const chosenOffers = offers.filter((offer) => offer.isChecked);
  const offersTemplate = chosenOffers.slice(0, MAX_SHOWING_OFFER_COUNT).map(createOfferTemplate).join(`\n`);

  const eventStartTime = getLocalTime(start);
  const eventEndTime = getLocalTime(end);
  const eventDuration = formatTimeInterval(getTimeInterval(start, end));
  const eventStartDatetime = convertToMachineFormat(start);
  const eventEndDatetime = convertToMachineFormat(end);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${destinationTemplate}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time
              class="event__start-time"
              datetime="${eventStartDatetime}"
            >${eventStartTime}</time>&mdash;
            <time
              class="event__end-time"
              datetime="${eventEndDatetime}"
            >${eventEndTime}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _rollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollupButtonClickHandler);
  }
}
