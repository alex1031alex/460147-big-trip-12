import {render, remove, RenderPosition} from "../utils/render.js";
import EventFormView from "../view/event-form.js";
import {BLANK_EVENT, UserAction, UpdateType} from "../const.js";
import {isEscKey} from "../utils/common.js";

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

  _handleFormSubmit(newEvent) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        newEvent
    );

    remove(this._eventFormComponent);
  }

  _handleCancelButtonClick() {
    remove(this._eventFormComponent);
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      remove(this._eventFormComponent);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _handleDestinationsModelUpdate(destinations) {
    this._destinations = destinations.slice();
    this._eventFormComponent.updateDraftData({destinations: this._destinations});
  }

  destroy() {
    remove(this._eventFormComponent);
  }
}
