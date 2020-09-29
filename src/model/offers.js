import Observer from "../utils/observer.js";

export default class Offers extends Observer {
  constructor() {
    super();

    this._offers = [];
  }

  setOffers(updateType, offers) {
    this._offers = offers.slice();

    this._notify(updateType, offers);
  }

  getOffers(type) {
    const index = this._offers.findIndex((offer) => type === offer.type);

    if (index !== -1) {
      return this._offers[index].offers;
    }

    return [];
  }
}
