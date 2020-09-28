import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a
        class="trip-tabs__btn trip-tabs__btn--active"
        href="#"
        data-item="${MenuItem.TABLE}"
      >Table</a>
      <a class="trip-tabs__btn" href="#" data-item="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._activeItem = MenuItem.TABLE;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _toggleMenuItem(item) {
    const tableButton = this
      .getElement()
      .querySelector(`[data-item="${MenuItem.TABLE}"]`);
    const statsButton = this
      .getElement()
      .querySelector(`[data-item="${MenuItem.STATS}"]`);

    switch (item) {
      case MenuItem.TABLE: {
        tableButton.classList.add(ACTIVE_CLASS);
        statsButton.classList.remove(ACTIVE_CLASS);
        this._activeItem = MenuItem.TABLE;
        break;
      }
      case MenuItem.STATS: {
        tableButton.classList.remove(ACTIVE_CLASS);
        statsButton.classList.add(ACTIVE_CLASS);
        this._activeItem = MenuItem.STATS;
        break;
      }
    }
  }

  resetMenuToDefaultView() {
    this._toggleMenuItem(MenuItem.TABLE);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const targetItem = evt.target.dataset.item;

    if (evt.target.tagName !== `A`) {
      return;
    }

    if (targetItem === this._activeItem) {
      return;
    }

    this._toggleMenuItem(targetItem);
    this._callback.menuClick(targetItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
