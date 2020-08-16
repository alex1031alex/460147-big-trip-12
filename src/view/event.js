import {EventCategory} from "../const.js";

const MAX_SHOWING_OFFER_COUNT = 3;

const getLocalTime = (date) => {
  return date.toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: false});
};

const formatTimeInterval = (milliseconds) => {
  const totalSeconds = Math.trunc(milliseconds / 1000);
  if (totalSeconds < 60) {
    return `0M`;
  }

  const totalMinutes = Math.trunc(totalSeconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes}M`;
  }

  const totalHours = Math.trunc(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (totalHours < 24) {
    return `${totalHours}H ${minutes}M`;
  }

  const days = Math.trunc(totalHours / 24);
  const hours = totalHours % 24;

  return `${days}D ${hours}H ${minutes}M`;
};

const convertToMachineFormat = (date) => {
  const year = date.getFullYear();
  const month = date.toLocaleString(`en-US`, {month: `2-digit`});
  const day = date.toLocaleString(`en-US`, {day: `2-digit`});
  const time = date.toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`, hour12: false});

  return `${year}-${month}-${day}T${time}`;
};

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

export const createEventTemplate = (event) => {
  const {category, type, destination, date: {start, end}, offers, cost} = event;

  const isTransferEvent = category === EventCategory.TRANSFER ? true : false;
  const destinationTemplate = `${type} ${isTransferEvent ? `to` : `in`} ${destination ? destination.name : ``}`;

  const chosenOffers = offers.filter((offer) => offer.isChecked);
  const offersTemplate = chosenOffers.slice(0, MAX_SHOWING_OFFER_COUNT).map(createOfferTemplate).join(`\n`);

  const eventStartTime = getLocalTime(start);
  const eventEndTime = getLocalTime(end);
  const eventDuration = formatTimeInterval(end.getTime() - start.getTime());
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
