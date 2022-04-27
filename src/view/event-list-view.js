import { createElement } from '../render.js';

const сreateEventListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class EventListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return сreateEventListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
