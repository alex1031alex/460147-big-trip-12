"use strict";

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const page = document.querySelector(`.page-body`);
const pageMenuTitle = page.querySelector(`.trip-controls h2`);

render(pageMenuTitle, createMenuTemplate(), `afterend`);
