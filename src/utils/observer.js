export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers.findIndex(observer);

    this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  _notify(action, payload) {
    this._observers.forEach((observer) => observer(action, payload));
  }
}
