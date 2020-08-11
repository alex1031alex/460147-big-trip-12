export const createDayTemplate = (number, date) => {
  return (
    `<li class="trip-days__item  day" data-day="${number}">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime="2019-03-18">${date.toLocaleString(`en-US`, {month: `short`, day: `2-digit`})}</time>
      </div>

      <ul class="trip-events__list">

      </ul>
    </li>`
  );
};
