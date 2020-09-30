import EventView from "../view/event.js";
import EventFormView from "../view/event-form.js";
import {isEscKey, isDatesEqual} from "../utils/common.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`
};

export default class Event {
  constructor(
      eventContainer,
      changeData,
      changeMode,
      destinationsModel,
      offersModel
  ) {
    this._eventContainer = eventContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._destinations = this._destinationsModel.getDestinations();
    this._offers = [];

    this._eventComponent = null;
    this._eventFormComponent = null;
    this._eventType = null;
    this._mode = Mode.DEFAULT;

    this._handleExpandButtonClick = this._handleExpandButtonClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEventTypeChange = this._handleEventTypeChange.bind(this);
  }

  init(event) {
    this._event = event;
    const prevEventComponent = this._eventComponent;
    const prevEventFormComponent = this._eventFormComponent;

    this._eventType = this._event.type;
    this._offers = this._offersModel.getOffers(this._eventType);
    this._eventComponent = new EventView(event);
    this._eventComponent.setExpandButtonClickHandler(this._handleExpandButtonClick);

    this._eventFormComponent = new EventFormView(event, this._destinations, this._offers);

    this._eventFormComponent.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
    this._eventFormComponent.setRollupButtonClickHandler(this._handleRollupButtonClick);
    this._eventFormComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    this._eventFormComponent.setEventTypeChangeHandler(this._handleEventTypeChange);
    this._eventFormComponent.setSubmitHandler(this._handleFormSubmit);

    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDIT) {
      replace(this._eventComponent, prevEventFormComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  setViewState(state) {
    switch (state) {
      case State.SAVING: {
        this._eventFormComponent.updateDraftData({
          isSaving: true,
          isDisabled: true
        });
        break;
      }
      case State.DELETING: {
        this._eventFormComponent.updateDraftData({
          isDeleting: true,
          isDisabled: true
        });
      }
    }
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

      const offers = this._offersModel.getOffers(this._event.type);
      this._eventFormComponent.reset(this._event, offers);
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
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  _handleEventTypeChange(chosenType) {
    const updatedOffers = this._offersModel.getOffers(chosenType);
    this._eventFormComponent.setAvailableOffers(updatedOffers);

    this._eventFormComponent.updateDraftData(
        {
          type: chosenType,
          offers: []
        }
    );
  }

  _handleRollupButtonClick() {
    const offers = this._offersModel.getOffers(this._event.type);
    this._eventFormComponent.reset(this._event, offers);
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
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }
}
