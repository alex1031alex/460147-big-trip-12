import EventView from "../view/event.js";
import EventFormView from "../view/event-form.js";
import {isEscKey, isDatesEqual} from "../utils/common.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class Event {
  constructor(eventContainer, changeData, changeMode, destinationsModel) {
    this._eventContainer = eventContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationsModel = destinationsModel;
    this._destinations = this._destinationsModel.getDestinations();

    this._eventComponent = null;
    this._eventFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleExpandButtonClick = this._handleExpandButtonClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDestinationsModelUpdate = this._handleDestinationsModelUpdate.bind(this);

    this._destinationsModel.addObserver(this._handleDestinationsModelUpdate);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventFormComponent = this._eventFormComponent;

    this._eventComponent = new EventView(event);
    this._eventComponent.setExpandButtonClickHandler(this._handleExpandButtonClick);

    this._eventFormComponent = new EventFormView(event, this._destinations);

    this._eventFormComponent.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
    this._eventFormComponent.setRollupButtonClickHandler(this._handleRollupButtonClick);
    this._eventFormComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    this._eventFormComponent.setSubmitHandler(this._handleFormSubmit);

    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDIT) {
      replace(this._eventFormComponent, prevEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventFormComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDIT;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleExpandButtonClick() {
    this._replaceEventToForm();
  }

  _handleEscKeyDown(evt) {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this._eventFormComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _handleDeleteButtonClick(deletedEvent) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        deletedEvent
    );
  }

  _handleFavoriteButtonClick() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._event, {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  _handleRollupButtonClick() {
    this._eventFormComponent.reset(this._event);
    this._replaceFormToEvent();
  }

  _handleFormSubmit(updatedEvent) {
    const isMinorUpdate =
    !isDatesEqual(this._event.date.start, updatedEvent.date.start) ||
    !isDatesEqual(this._event.date.end, updatedEvent.date.end);

    this._changeData(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        updatedEvent
    );

    this._replaceFormToEvent();
  }

  _handleDestinationsModelUpdate(destinations) {
    this._destinations = destinations.slice();
    this._eventFormComponent.updateDraftData({destinations: this._destinations});
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }
}
