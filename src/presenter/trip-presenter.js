import EmptyListView from '../view/empty-list-view.js';
import EventListView from '../view/event-list-view.js';
import TripFilterView from '../view/trip-filters-view.js';
import EventCreateItemView from '../view/event-create-item-view.js';
import TripTabsView from '../view/trip-tabs-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from './point-presenter';
import { updateItem } from '../tools/random.js';
import {render, RenderPosition} from '../tools/render.js';

export default class TripPresenter {
  #tripMainElement = null;
  #navigationElement = null;
  #filterElement = null;
  #tripEventsElement = null;
  #eventListElement = null;

  #points = [];
  #pointPresenter = new Map();

  constructor() {
    this.#tripMainElement = document.querySelector('.trip-main');
    this.#navigationElement = this.#tripMainElement.querySelector('.trip-controls__navigation');
    this.#filterElement = this.#tripMainElement.querySelector('.trip-controls__filters');
    this.#tripEventsElement = document.querySelector('.trip-events');
  }

  init = (points) => {
    this.#points = [...points];

    render(this.#tripMainElement, new TripInfoView(this.#points), RenderPosition.AFTERBEGIN);
    this.#renderTrip();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #renderNavigation = () => {
    render(this.#navigationElement, new TripTabsView(), RenderPosition.BEFOREEND);
  }

  #renderFilters = () => {
    render(this.#filterElement, new TripFilterView(), RenderPosition.BEFOREEND);
  }

  #renderSort = () => {
    render(this.#tripEventsElement, new TripSortView(), RenderPosition.BEFOREEND);
  }

  #renderEventList = () => {
    render(this.#tripEventsElement, new EventListView(), RenderPosition.BEFOREEND);
  }

  #renderFormCreate = () => {
    render(this.#eventListElement, new EventCreateItemView(this.#points[0]), RenderPosition.AFTERBEGIN);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#eventListElement, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderEmpty = () => {
    const message = 'Click New Event to create your first point';
    render(this.#tripEventsElement, new EmptyListView(message), RenderPosition.BEFOREEND);
  }

  #clearTaskList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderTrip = () => {
    this.#renderNavigation();
    this.#renderFilters();

    if (this.#points?.length > 0) {
      this.#renderSort();
      this.#renderEventList();
    }
    else {
      this.#renderEmpty();
      return;
    }

    this.#eventListElement = this.#tripEventsElement.querySelector('.trip-events__list');
    this.#renderFormCreate();
    this.#renderPoints();
  }
}
