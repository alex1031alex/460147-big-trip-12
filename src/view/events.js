import AbstractView from "./abstract.js";

export const createEventsTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class Events extends AbstractView {
  getTemplate() {
    return createEventsTemplate();
  }
}
