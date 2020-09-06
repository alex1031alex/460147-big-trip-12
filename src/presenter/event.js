import EventView from "../view/event.js";
import EventFormView from "../view/event-form.js";
import {isEscKey} from "../utils/common.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

export default class Event {
  constructor(eventContainer, changeData) {
    this._eventContainer = eventContainer;
    this._changeData = changeData;

    this._eventComponent = null;
    this._eventFormComponent = null;

    this._handleRollupClick = this._handleRollupClick.bind(this);
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

    this._eventComponent.setRollupClickHandler(this._handleRollupClick);
    this._eventFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._eventContainer.contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._eventContainer.contains(prevEventFormComponent.getElement())) {
      replace(this._eventFormComponent, prevEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  _replaceEventToForm() {
    replace(this._eventFormComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleEscKeyDown(evt) {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._handleEscKeyDown);
    }
  }

  _handleRollupClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(updatedEvent) {
    this._changeData(updatedEvent);
    this._replaceFormToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign({}, this._event, {isFavorite: !this._event.isFavorite}));
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }
}
