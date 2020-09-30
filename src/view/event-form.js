import flatpickr from "flatpickr";
import SmartView from "./smart.js";
import {localizeDate} from "../utils/common.js";
import {defineEventCategory} from "../utils/event.js";
import {EventCategory} from "../const.js";
import {
  transferTypes,
  activityTypes,
} from "../mock/event.js";


import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const ErrorMessage = {
  DATE: `Input error! Start date can't be more than end date.`,
  DESTINATION: `Input error! Please, chose destination from dropdown list.`,
  PRICE: `Input error! Price must be a number.`,
  NO_DESTINATION: `Please, set destination for this point!`,
  NO_PRICE: `Please, set price for this point!`
};

const MESSAGE_SHOW_TIME = 1200;

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
    .map((destination) => `<option value="${destination.name}"></option>`)
    .join(`\n`);

  return `<datalist id="destination-list-1">
    ${destinationOptions}
  </datalist>`;
};

const createFavoriteButtonTemplate = (eventId, isFavoriteChecked, isDisabled) => {
  if (eventId || eventId === 0) {
    return `<input
      id="event-favorite-1"
      class="event__favorite-checkbox  visually-hidden"
      type="checkbox"
      name="event-favorite"
      ${isFavoriteChecked}
      ${isDisabled ? `disabled` : ``}
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

const createRollupButtonTemplate = (eventId) => {
  if (eventId || eventId === 0) {
    return (
      `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    );
  }

  return ``;
};

const createOfferTemplate = (offer, chosenOffers, isDisabled) => {
  if (!offer) {
    return ``;
  }

  const {title, price} = offer;
  const isChecked = chosenOffers.some((chosenOffer) => chosenOffer.title === offer.title);
  const checkedAttributeValue = isChecked ? `checked` : ``;
  const disabledAttributeValue = isDisabled ? `disabled` : ``;
  const titleAsHtml = title.toLowerCase().split(` `).join(`-`);

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden" 
        id="event-offer-${titleAsHtml}-1" type="checkbox"    
        name="event-offer-${titleAsHtml}" 
        ${checkedAttributeValue}
        ${disabledAttributeValue}
      >
      <label class="event__offer-label" for="event-offer-${titleAsHtml}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOffersTemplate = (availableOffers, chosenOffers, isDisabled) => {
  if (availableOffers.length === 0) {
    return ``;
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${availableOffers
          .map((availableOffer) => createOfferTemplate(availableOffer, chosenOffers, isDisabled))
          .join(`\n`)}
    </div>
  </section>`;
};

const createDestinationTemplate = (destination) => {
  if (!destination.name) {
    return ``;
  }

  const photosTemplate = destination.photos
    .map((photo) => {
      return `<img class="event__photo" src="${photo.src}" alt="${photo.description}"></img>`;
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

const createDetailsTemplate = (availableOffers, chosenOffers, destination, isDisabled) => {
  const offersTemplate = createOffersTemplate(availableOffers, chosenOffers, isDisabled);
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

const createEventFormTemplate = (draftData, availableOffers, destinations) => {
  const {
    id,
    type,
    destination,
    date: {start, end},
    offers,
    cost,
    isTransferEvent,
    isFavoriteChecked,
    isDisabled,
    isDeleting,
    isSaving
  } = draftData;

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
  const favoriteButtonTemplate = createFavoriteButtonTemplate(id, isFavoriteChecked, isDisabled);
  const rollupButtonTemplate = createRollupButtonTemplate(id);
  const detailsTemplate = createDetailsTemplate(availableOffers, offers, destination, isDisabled);
  const submitingButtonText = isSaving ? `Saving...` : `Save`;
  const deletingButtonText = isDeleting ? `Deleting...` : `Delete`;
  const resetButtonName = id || id === 0 ? deletingButtonText : `Cancel`;
  const disabledAtributeTemplate = isDisabled ? `disabled` : ``;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input
            class="event__type-toggle  visually-hidden"
            id="event-type-toggle-1"
            type="checkbox"
            ${disabledAtributeTemplate}
          >

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
          <input 
            class="event__input  event__input--destination"
            id="event-destination-1" type="text"
            name="event-destination"
            value="${destinationNameTemplate}"
            list="destination-list-1"
            ${disabledAtributeTemplate}
          >
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
            ${disabledAtributeTemplate}
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
            ${disabledAtributeTemplate}
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
            ${disabledAtributeTemplate}
          >
        </div>

        <button
          class="event__save-btn  btn  btn--blue"
          type="submit"
          ${disabledAtributeTemplate}
        >${submitingButtonText}</button>
        <button
          class="event__reset-btn"
          type="reset"
          ${disabledAtributeTemplate}
        >${resetButtonName}</button>

        ${favoriteButtonTemplate}
        ${rollupButtonTemplate}
      </header>
      ${detailsTemplate}
    </form>`
  );
};

export default class EventForm extends SmartView {
  constructor(event, destinations, availableOffers) {
    super();

    this._destinations = destinations;
    this._availableOffers = availableOffers;
    this._draftData = EventForm.parseEventToDraftData(event);
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
    return createEventFormTemplate(this._draftData, this._availableOffers, this._destinations);
  }

  removeElement() {
    this._destroyDatepicker();
    super.removeElement();
  }

  reset(event) {
    this.updateDraftData(EventForm.parseEventToDraftData(event));
  }

  setAvailableOffers(offers) {
    this._availableOffers = offers;
  }

  _destroyDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _destinationChoseHandler(evt) {
    const userDestinationName = evt.target.value;
    const userDestination = this._destinations
      .find((destination) => destination.name === userDestinationName);
    if (userDestination) {
      this.updateDraftData({destination: userDestination});
    } else {
      this._showErrorMessage(ErrorMessage.DESTINATION);
      evt.target.value = ``;
      return;
    }
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
    const newPrice = evt.target.value === `` ? 0 : +evt.target.value;

    if ((typeof +newPrice) !== `number`) {
      this._showErrorMessage(ErrorMessage.PRICE);
      evt.target.value = ``;
      return;
    }

    this.updateDraftData({cost: newPrice}, true);
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.eventTypeChange(evt.target.value);
  }

  setEventTypeChangeHandler(callback) {
    this._callback.eventTypeChange = callback;

    this.getElement()
    .querySelectorAll(`.event__type-group`)
    .forEach((eventTypeGroup) => {
      eventTypeGroup.addEventListener(`change`, this._eventTypeChangeHandler);
    });
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
    this._callback.favoriteButtonClick = callback;

    const favoriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);
    if (!favoriteButton) {
      return;
    }

    favoriteButton.addEventListener(`click`, this._favoriteButtonClickHandler);
  }

  _rollupButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  setRollupButtonClickHandler(callback) {
    const rollupButton = this.getElement().querySelector(`.event__rollup-btn`);
    if (!rollupButton) {
      return;
    }

    this._callback.rollupButtonClick = callback;
    rollupButton.addEventListener(`click`, this._rollupButtonClickHandler);
  }

  _submitHandler(evt) {
    evt.preventDefault();

    if (!this._draftData.destination.name) {
      this._showErrorMessage(ErrorMessage.NO_DESTINATION);
      return;
    }

    if (this._draftData.date.start.getTime() > this._draftData.date.end.getTime()) {
      this._showErrorMessage(ErrorMessage.DATE);
      return;
    }

    if (!this._draftData.cost) {
      this._showErrorMessage(ErrorMessage.NO_PRICE);
      return;
    }

    if (this._availableOffers.length !== 0) {
      const offerButtons = this.getElement().querySelectorAll(`.event__offer-checkbox`);
      this._draftData.offers = [];
      offerButtons.forEach((offerButton, index) => {
        if (offerButton.checked) {
          this._draftData.offers.push(this._availableOffers[index]);
        }
      });
    }

    this._callback.submit(EventForm.parseDraftDataToEvent(this._draftData));
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._submitHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChoseHandler);

    const startDateInput = this.getElement().querySelector(`#event-start-time-1`);
    const endDateInput = this.getElement().querySelector(`#event-end-time-1`);
    const priceField = this.getElement().querySelector(`.event__input--price`);

    startDateInput.addEventListener(`focus`, this._startDateFocusHandler);
    endDateInput.addEventListener(`focus`, this._endDateFocusHandler);
    priceField.addEventListener(`input`, this._priceChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setFavoriteButtonClickHandler(this._callback.favoriteButtonClick);
    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
    this.setEventTypeChangeHandler(this._callback.eventTypeChange);
  }

  _showErrorMessage(message) {
    const errorTemplate = document
      .querySelector(`#error`)
      .content.querySelector(`.error-message__wrap`)
      .cloneNode(true);
    const errorMessageContainer = this.getElement().querySelector(`.event__header`);
    const submitButton = this.getElement().querySelector(`.event__save-btn`);

    errorTemplate.querySelector(`.error-message__text`).textContent = message;
    errorMessageContainer.style.flexWrap = `wrap`;
    submitButton.disabled = true;

    errorMessageContainer.prepend(errorTemplate);

    const removeMessage = () => {
      errorMessageContainer.style.flexWrap = `no-wrap`;
      errorTemplate.remove();
      submitButton.disabled = false;
    };

    setTimeout(removeMessage, MESSAGE_SHOW_TIME);
  }

  static parseEventToDraftData(event) {
    return Object.assign(
        {},
        event,
        {
          isTransferEvent: defineEventCategory(event.type) === EventCategory.TRANSFER,
          isFavoriteChecked: event.isFavorite ? `checked` : ``,
          isDisabled: false,
          isDeleting: false,
          isSaving: false
        }
    );
  }

  static parseDraftDataToEvent(draftData) {
    draftData = Object.assign(
        {},
        draftData
    );

    delete draftData.isTransferEvent;
    delete draftData.isFavoriteChecked;
    delete draftData.isDisabled;
    delete draftData.isDeleting;
    delete draftData.isSaving;

    return draftData;
  }
}
