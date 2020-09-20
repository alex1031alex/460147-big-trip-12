import {render, RenderPosition} from "../utils/render.js";
import EventFormView from "../view/event-form.js";
import {BLANK_EVENT} from "../const.js";

export default class EventNew {
  constructor(tripDaysContainer, changeData, destinationsModel) {
    this._tripDaysContainer = tripDaysContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._destinations = destinationsModel.getDestinations();

    this._eventFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelButtonClick = this._handleCancelButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCancelButtonClick = this._handleCancelButtonClick.bind(this);
    this._handleDestinationsModelUpdate = this._handleDestinationsModelUpdate.bind(this);
  }

  init() {
    if (this._eventFormComponent !== null) {
      return;
    }

    this._eventFormComponent = new EventFormView(BLANK_EVENT, this._destinations);
    this._eventFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setDeleteButtonClickHandler(this._handleCancelButtonClick);

    render(this._tripDaysContainer, this._eventFormComponent, RenderPosition.BEFOREBEGIN);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit() {
    return;
  }

  _handleCancelButtonClick() {
    return;
  }

  _escKeyDownHandler() {
    return;
  }

  _handleDestinationsModelUpdate(destinations) {
    this._destinations = destinations.slice();
    this._eventFormComponent.updateDraftData({destinations: this._destinations});
  }
}
