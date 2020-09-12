import EventView from "../view/event.js";
import EventFormView from "../view/event-form.js";
import {isEscKey} from "../utils/common.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class Event {
  constructor(eventContainer, changeData, changeMode) {
    this._eventContainer = eventContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
    this._handleExpandButtonClick = this._handleExpandButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventFormComponent = this._eventFormComponent;

    this._eventComponent = new EventView(event);
    this._eventFormComponent = new EventFormView(event);

    this._eventComponent.setExpandButtonClickHandler(this._handleExpandButtonClick);
    this._eventFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventFormComponent.setRollupButtonClickHandler(this._handleRollupButtonClick);

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

  _handleEscKeyDown(evt) {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this._eventFormComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _handleRollupButtonClick() {
    this._eventFormComponent.reset(this._event);
    this._replaceFormToEvent();
  }

  _handleExpandButtonClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(updatedEvent) {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        updatedEvent
    );

    this._replaceFormToEvent();
  }

  _handleFavoriteClick() {
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

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }
}
