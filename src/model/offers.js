import Observer from "../utils/observer.js";

export default class Offers extends Observer {
  constructor() {
    super();

    this._offers = {};
  }

  setOffers(updateType, offer) {
    this._offers[offer.type] = offer.offers;
    this._notify(updateType, offer);
  }

  getOffers(type) {
    return this._offers[type];
  }
}
