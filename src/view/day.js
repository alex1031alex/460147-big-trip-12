import AbstractView from "./abstract.js";
import {convertToMachineFormat} from "../utils/common.js";

const createTimeTemplate = (date) => {
  return `<time class="day__date" datetime="${convertToMachineFormat(date, false)}"
    >${date.toLocaleString(`en-US`, {month: `short`, day: `2-digit`})}
  </time>`;
};

export const createDayTemplate = (number, date) => {
  const counterTemplate = number ? `<span class="day__counter">${number}</span>` : ``;
  const timeTemplate = date ? createTimeTemplate(date) : ``;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${counterTemplate}
        ${timeTemplate}
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class DayView extends AbstractView {
  constructor(number, date) {
    super();
    this._number = number;
    this._date = date;
  }

  getTemplate() {
    return createDayTemplate(this._number, this._date);
  }

  getEventsList() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
