import Observer from "../utils/observer.js";

export default class Destinations extends Observer {
  constructor() {
    super();

    this._destinations = [];
  }

  _notify(payload) {
    this._observers.forEach((observer) => observer(payload));
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations.slice();

    this._notify(updateType, destinations);
  }

  getDestinations() {
    return this._destinations;
  }
}
