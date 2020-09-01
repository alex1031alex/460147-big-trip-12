import AbstractView from "./abstract.js";

const createDaysTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class DayList extends AbstractView {
  getTemplate() {
    return createDaysTemplate();
  }
}
