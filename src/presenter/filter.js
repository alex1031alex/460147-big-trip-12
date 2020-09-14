import FilterView from "../view/filter.js";
import {render, replace, RenderPosition, remove} from "../utils/render.js";
import {UpdateType} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);

    this._filterModel.addObserver(this._handleModelUpdate);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelUpdate() {
    this.init();
  }
}
