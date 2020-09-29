import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();

    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          cost: event.base_price,
          date: {
            start: new Date(event.date_from),
            end: new Date(event.date_to)
          },
          destination: {
            name: event.destination.name,
            info: event.destination.description,
            photos: event.destination.pictures
          }
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          "base_price": event.cost,
          "date_from": event.date.start.toISOString(),
          "date_to": event.date.end.toISOString(),
          "destination": {
            name: event.destination.name,
            description: event.destination.info,
            pictures: event.destination.photos
          }
        }
    );

    delete adaptedEvent.cost;
    delete adaptedEvent.date;

    return adaptedEvent;
  }
}
