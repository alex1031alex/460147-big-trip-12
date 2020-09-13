import FilterView from "../view/filter.js";
import {render, RenderPosition} from "../utils/render.js";
import {UpdateType} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    this._filterComponent = new FilterView(this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
