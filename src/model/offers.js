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
    const filteredOffers = this._offers.filter((offer) => type === offer.type);

    if (filteredOffers || filteredOffers.length === 0) {
      return [];
    }
    return filteredOffers[0].offers;
  }
}
