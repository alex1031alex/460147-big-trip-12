import AbstractView from "./abstract.js";
import {FilterType} from "../const.js";
import {capitalizeWord} from "../utils/common.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const filterName = capitalizeWord(filter);
  const isFilterChecked = filter === currentFilterType ? `checked` : ``;

  return `<div class="trip-filters__filter">
    <input 
      id="filter-${filter}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${filter}"
      ${isFilterChecked}
    />
    <label class="trip-filters__filter-label" for="filter-${filter}">${filterName}</label>
  </div>`;
};

const createFilterTemplate = (currentFilterType) => {
  const filterItemsTemplate = Object
    .values(FilterType)
    .map((filterType) => createFilterItemTemplate(filterType, currentFilterType))
    .join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractView {
  constructor(currentFilterType) {
    super();

    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
