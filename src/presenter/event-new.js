import {render, remove, RenderPosition} from "../utils/render.js";
import EventFormView from "../view/event-form.js";
import {BLANK_EVENT, UserAction, UpdateType} from "../const.js";
import {isEscKey} from "../utils/common.js";

export default class EventNew {
  constructor(tripDaysContainer, changeData, destinationsModel, offersModel) {
    this._tripDaysContainer = tripDaysContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._type = BLANK_EVENT.type;
    this._offers = this._offersModel.getOffers(this._type);
    this._eventFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelButtonClick = this._handleCancelButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCancelButtonClick = this._handleCancelButtonClick.bind(this);
    this._handleDestinationsModelUpdate = this._handleDestinationsModelUpdate.bind(this);
    this._handleEventTypeChange = this._handleEventTypeChange.bind(this);
  }

  init(disableNewEventButton) {
    this._disableNewEventButton = disableNewEventButton;

    if (this._eventFormComponent !== null) {
      return;
    }
    const destinations = this._destinationsModel.getDestinations();

    this._eventFormComponent = new EventFormView(BLANK_EVENT, destinations, this._offers);
    this._eventFormComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setDeleteButtonClickHandler(this._handleCancelButtonClick);
    this._eventFormComponent.setEventTypeChangeHandler(this._handleEventTypeChange);

    render(this._tripDaysContainer, this._eventFormComponent, RenderPosition.BEFOREBEGIN);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._disableNewEventButton(true);
  }

  setSaving() {
    this._eventFormComponent.updateDraftData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventFormComponent.updateDraftData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._eventFormComponent.shake(resetFormState);
  }

  _handleFormSubmit(newEvent) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MAJOR,
        newEvent
    );
  }

  _handleCancelButtonClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
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

  _handleDestinationsModelUpdate(destinations) {
    this._destinations = destinations.slice();
    this._eventFormComponent.updateDraftData({destinations: this._destinations});
  }

  destroy() {
    if (this._eventFormComponent !== null) {
      remove(this._eventFormComponent);
      this._eventFormComponent = null;
      this._disableNewEventButton(false);
    }
  }
}
