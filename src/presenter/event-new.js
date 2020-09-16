import {render, RenderPosition} from "../utils/render.js";
import EventFormView from "../view/event-form.js";

export default class EventNew {
  constructor(tripDaysContainer, changeData) {
    this._tripDaysContainer = tripDaysContainer;
    this._changeData = changeData;

    this._eventFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelButtonClick = this._handleCancelButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCancelButtonClick = this._handleCancelButtonClick.bind(this);
  }

  init() {
    if (this._eventFormComponent !== null) {
      return;
    }

    this._eventFormComponent = new EventFormView();
    this._eventFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setCancelButtonClickHandler(this._handleCancelButtonClick);


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
}
