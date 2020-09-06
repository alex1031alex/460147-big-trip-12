import AbstractView from "./abstract.js";
import {transferTypes, activityTypes, generateOffers} from "../mock/event.js";
import {localizeDate, capitalizeWord} from "../utils/common.js";
import {EventCategory} from "../const.js";

const DEFAULT_EVENT_TYPE = `Bus`;

const createEventTypeTemplate = (eventType, isChecked) => {
  const checkedAttributeValue = isChecked ? `checked` : ``;

  return (
    `<div class="event__type-item">
      <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${checkedAttributeValue}>
      <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
    </div>`
  );
};

const createOfferTemplate = (offer) => {
  if (!offer) {
    return ``;
  }

  const {name, title, cost, isChecked} = offer;
  const checkedAttributeValue = isChecked ? `checked` : ``;

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden" 
        id="event-offer-${title}-1" type="checkbox"    
        name="event-offer-${title}" 
        ${checkedAttributeValue}
      >
      <label class="event__offer-label" for="event-offer-${title}-1">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${cost}</span>
      </label>
    </div>`
  );
};

const createOffersTemplate = (offers) => {
  if (!offers || offers.length === 0) {
    return ``;
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map(createOfferTemplate).join(`\n`)}
    </div>
  </section>`;
};

const createDestinationTemplate = (destination) => {
  if (destination === null) {
    return ``;
  }

  const photosTemplate = destination.photos
  .map((photo) => {
    return `<img class="event__photo" src="${photo}" alt="Event photo"></img>`;
  })
  .join(`\n`);

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.info}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosTemplate}
              </div>
            </div>
          </section>`;
};

const createEventFormTemplate = (draftData) => {

  if (event === null) {
    const transferEventNamesTemplate = transferTypes
      .map((it) => {
        return createEventTypeTemplate(it, it === DEFAULT_EVENT_TYPE);
      })
      .join(`\n\n`);
    const activityEventNamesTemplate = activityTypes
      .map((it) => createEventTypeTemplate(it, false))
      .join(`\n\n`);

    const initialDate = localizeDate(new Date());

    return (
      `<form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/Bus.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${transferEventNamesTemplate}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${activityEventNamesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              Bus to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="Saint Petersburg"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input
              class="event__input  event__input--time" 
              id="event-start-time-1" 
              type="text" 
              name="event-start-time" 
              value="${initialDate}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input
              class="event__input  event__input--time" 
              id="event-end-time-1" 
              type="text" 
              name="event-end-time" 
              value="${initialDate}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price" 
              id="event-price-1" type="text" 
              name="event-price" 
              value=""
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
      </form>`
    );
  }

  const {type, destination, date: {start, end}, offers, cost, isTransferEvent, isFavoriteChecked} = draftData;
  const localizedStartDate = localizeDate(start);
  const localizedEndDate = localizeDate(end);

  const transferEventTypesTemplate = transferTypes
    .map((it) => createEventTypeTemplate(it, it === type))
    .join(`\n\n`);

  const activityEventTypesTemplate = activityTypes
    .map((it) => createEventTypeTemplate(it, it === type))
    .join(`\n\n`);

  const offersTemplate = createOffersTemplate(offers);

  const destinationTempate = createDestinationTemplate(destination);
  const destinationNameTemplate = !destination ? `` : destination.name;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferEventTypesTemplate}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityEventTypesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type} ${isTransferEvent ? `to` : `in`}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationNameTemplate}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="Saint Petersburg"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input
            class="event__input  event__input--time" 
            id="event-start-time-1" 
            type="text" 
            name="event-start-time" 
            value="${localizedStartDate}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input
            class="event__input  event__input--time" 
            id="event-end-time-1" 
            type="text" 
            name="event-end-time" 
            value="${localizedEndDate}"
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price" 
            id="event-price-1" type="text" 
            name="event-price" 
            value="${cost}"
          >
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavoriteChecked}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${destinationTempate}
      </section>
    </form>`
  );
};

export default class EventForm extends AbstractView {
  constructor(event) {
    super();

    this._draftData = EventForm.parseEventToDraftData(event);
    this._callback = {};
    this._submitHandler = this._submitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEventFormTemplate(this._draftData);
  }

  _eventTypeChangeHandler(evt) {
    this.updateDraftData({
      type: capitalizeWord(evt.target.value),
      destination: null,
      offers: generateOffers(false),
    });
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EventForm.parseDraftDataToEvent(this._draftData));
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _setInnerHandlers() {
    this.getElement()
    .querySelectorAll(`.event__type-group`)
    .forEach((eventTypeGroup) => {
      eventTypeGroup.addEventListener(`change`, this._eventTypeChangeHandler);
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._submitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this
      .getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  updateDraftData(update) {
    if (!update) {
      return;
    }

    this._draftData = Object.assign(
        {},
        this._draftData,
        update
    );

    this.updateElement();
  }

  static parseEventToDraftData(event) {
    return Object.assign(
        {},
        event,
        {
          isTransferEvent: event.category === EventCategory.TRANSFER,
          isFavoriteChecked: event.isFavorite ? `checked` : ``,
        }
    );
  }

  static parseDraftDataToEvent(draftData) {
    draftData = Object.assign({}, draftData);

    delete draftData.isTransferEvent;
    delete draftData.isFavoriteChecked;

    return draftData;
  }
}
