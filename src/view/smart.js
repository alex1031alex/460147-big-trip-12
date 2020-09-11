import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._draftData = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  updateDraftData(update, justDataUpdating = false) {
    if (!update) {
      return;
    }

    this._draftData = Object.assign(
        {},
        this._draftData,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }
}
