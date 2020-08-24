import {transferTypes, activityTypes} from "../mock/event.js";
import {FormMode} from "../const.js";

const DEFAULT_EVENT_NAME = `Bus`;

const localizeDate = (date) => {
  const year = date.toLocaleString(`en-US`, {year: `2-digit`});
  const month = date.toLocaleString(`en-US`, {month: `2-digit`});
  const day = date.toLocaleString(`en-US`, {day: `2-digit`});
  const time = date.toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: false});

  return `${day}/${month}/${year} ${time}`;
};

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

export const createEventFormTemplate = (event, mode = FormMode.EDIT) => {

  if (event === null || mode === FormMode.ADD) {
    const transferEventNamesTemplate = transferTypes
      .map((it) => {
        return createEventTypeTemplate(it, it === DEFAULT_EVENT_NAME);
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

  const {isTransferEvent, type, destination, date: {start, end}, offers, cost} = event;
  const localizedStartDate = localizeDate(start);
  const localizedEndDate = localizeDate(end);

  const transferEventTypesTemplate = transferTypes
    .map((it) => createEventTypeTemplate(it, it === name))
    .join(`\n\n`);

  const activityEventTypesTemplate = activityTypes
    .map((it) => createEventTypeTemplate(it, it === name))
    .join(`\n\n`);

  const offersTemplate = offers
    .map(createOfferTemplate)
    .join(`\n`);

  const photosTemplate = destination.photos
    .map((photo) => {
      return `<img class="event__photo" src="${photo}" alt="Event photo"></img>`;
    })
    .join(`\n`);

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
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
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersTemplate}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.info}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photosTemplate}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};
