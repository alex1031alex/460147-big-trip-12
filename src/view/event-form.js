import SmartView from "./smart.js";
import {
  transferTypes,
  activityTypes,
  generateOffers,
  generateDestinationInfo,
  generateDestinationPhotos
} from "../mock/event.js";
import {localizeDate, capitalizeWord} from "../utils/common.js";
import {EventCategory} from "../const.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createEventTypeTemplate = (eventType, isChecked) => {
  const checkedAttributeValue = isChecked ? `checked` : ``;

  return (
    `<div class="event__type-item">
      <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${checkedAttributeValue}>
      <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
    </div>`
  );
};

const createDestinationListTemplate = (destinations) => {
  const destinationOptions = destinations
    .map((destination) => `<option value="${destination}"></option>`)
    .join(`\n`);

  return `<datalist id="destination-list-1">
    ${destinationOptions}
  </datalist>`;
};

const createFavoriteButtonTemplate = (eventId, isFavoriteChecked) => {
  if (eventId || eventId === 0) {
    return `<input
    id="event-favorite-1"
    class="event__favorite-checkbox  visually-hidden"
    type="checkbox"
    name="event-favorite"
    ${isFavoriteChecked}
    >
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`;
  }

  return ``;
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
  if (!destination || destination.name === ``) {
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

const createDetailsTemplate = (offers, destination) => {
  const offersTemplate = createOffersTemplate(offers);
  const destinationTemplate = createDestinationTemplate(destination);

  if (offersTemplate === `` && destinationTemplate === ``) {
    return ``;
  }

  return (
    `<section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>`
  );
};

const createEventFormTemplate = (draftData) => {
  const {id, type, destination, date: {start, end}, offers, cost, isTransferEvent, isFavoriteChecked, destinations} = draftData;
  const localizedStartDate = localizeDate(start);
  const localizedEndDate = localizeDate(end);

  const transferEventTypesTemplate = transferTypes
    .map((it) => createEventTypeTemplate(it, it === type))
    .join(`\n\n`);

  const activityEventTypesTemplate = activityTypes
    .map((it) => createEventTypeTemplate(it, it === type))
    .join(`\n\n`);

  const destinationListTemplate = createDestinationListTemplate(destinations);
  const destinationNameTemplate = !destination ? `` : destination.name;
  const resetButtonName = id || id === 0 ? `Delete` : `Cancel`;
  const favoriteButtonTemplate = createFavoriteButtonTemplate(id, isFavoriteChecked);
  const detailsTemplate = createDetailsTemplate(offers, destination);

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
          ${destinationListTemplate}
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
        <button class="event__reset-btn" type="reset">${resetButtonName}</button>

        ${favoriteButtonTemplate}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      ${detailsTemplate}
    </form>`
  );
};

export default class EventForm extends SmartView {
  constructor(event, destinations) {
    super();

    this._destinations = destinations;
    this._draftData = EventForm.parseEventToDraftData(event, this._destinations);
    this._datepicker = null;

    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChoseHandler = this._destinationChoseHandler.bind(this);
    this._startDateFocusHandler = this._startDateFocusHandler.bind(this);
    this._endDateFocusHandler = this._endDateFocusHandler.bind(this);

    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEventFormTemplate(this._draftData);
  }

  removeElement() {
    this._destroyDatepicker();
    super.removeElement();
  }

  reset(event) {
    this.updateDraftData(EventForm.parseEventToDraftData(event, this._destinations));
  }

  _destroyDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _eventTypeChangeHandler(evt) {
    this.updateDraftData({
      type: capitalizeWord(evt.target.value),
      isTransferEvent: transferTypes.some((it) => it === capitalizeWord(evt.target.value)),
      destination: null,
      offers: generateOffers(false),
    });
  }

  _destinationChoseHandler(evt) {
    const userDestination = evt.target.value;
    const update = {
      destination: {
        info: generateDestinationInfo(),
        photos: generateDestinationPhotos(),
      }
    };

    if (this._draftData.destinations.some((destination) => destination === userDestination)) {
      update.destination.name = userDestination;
    } else {
      update.destination.name = ``;
    }

    this.updateDraftData(update);
  }

  _startDateFocusHandler() {
    this._destroyDatepicker();
    this._datepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._draftData.date.start,
          onChange: ([userDate]) => {
            this.updateDraftData({date: {start: userDate, end: this._draftData.date.end}}, true);
          }
        }
    );
  }

  _endDateFocusHandler() {
    this._destroyDatepicker();
    this._datepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          minDate: this._draftData.date.start,
          defaultDate: this._draftData.date.end,
          onChange: ([userDate]) => {
            this.updateDraftData({date: {start: this._draftData.date.start, end: userDate}}, true);
          }
        }
    );
  }

  _priceChangeHandler(evt) {
    const newPrice = evt.target.value;

    this.updateDraftData({cost: newPrice});
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteButtonClick(EventForm.parseDraftDataToEvent(this._draftData));
  }

  setDeleteButtonClickHandler(callback) {
    this._callback.deleteButtonClick = callback;
    this
      .getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._deleteButtonClickHandler);
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteButtonClick();
  }

  setFavoriteButtonClickHandler(callback) {
    const favoriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);

    if (!favoriteButton) {
      return;
    }

    this._callback.favoriteButtonClick = callback;
    favoriteButton.addEventListener(`click`, this._favoriteButtonClickHandler);
  }

  _rollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollupButtonClickHandler);
  }

  _submitHandler(evt) {
    evt.preventDefault();

    if (this._draftData.date.start > this._draftData.date.end) {
      alert(`Start date can't be more than end date`); //Temporary by alert.WIP
      return;
    }

    this._callback.submit(EventForm.parseDraftDataToEvent(this._draftData));
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._submitHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll(`.event__type-group`)
      .forEach((eventTypeGroup) => {
        eventTypeGroup.addEventListener(`change`, this._eventTypeChangeHandler);
      });

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChoseHandler);

    const startDateInput = this.getElement().querySelector(`#event-start-time-1`);
    const endDateInput = this.getElement().querySelector(`#event-end-time-1`);
    const priceField = this.getElement().querySelector(`.event__input--price`);

    startDateInput.addEventListener(`focus`, this._startDateFocusHandler);
    endDateInput.addEventListener(`focus`, this._endDateFocusHandler);
    priceField.addEventListener(`change`, this._priceChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setFavoriteButtonClickHandler(this._callback.favoriteClick);
    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setDeleteButtonClickHandler(this._callback.deleteClick);
  }

  static parseEventToDraftData(event, destinations) {
    return Object.assign(
        {},
        event,
        {
          isTransferEvent: transferTypes.some((it) => it === event.type),
          isFavoriteChecked: event.isFavorite ? `checked` : ``,
          destinations,
        }
    );
  }

  static parseDraftDataToEvent(draftData) {
    draftData = Object.assign(
        {},
        draftData,
        {
          category: draftData.isTransferEvent ? EventCategory.TRANSFER : EventCategory.ACTIVITY
        });

    delete draftData.isTransferEvent;
    delete draftData.isFavoriteChecked;
    delete draftData.destinations;

    return draftData;
  }
}
