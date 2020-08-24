import {createElement} from "../utils.js";

export const createDayTemplate = (number, date) => {
  return (
    `<li class="trip-days__item  day" data-day="${number}">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime="${date.getFullYear()}-${date.toLocaleString(`en-US`, {month: `2-digit`})}-${date.toLocaleString(`en-US`, {day: `2-digit`})}">${date.toLocaleString(`en-US`, {month: `short`, day: `2-digit`})}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class DayView {
  constructor(number, date) {
    this._number = number;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._number, this._date);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
