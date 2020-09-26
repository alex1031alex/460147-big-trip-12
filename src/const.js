const EventCategory = {
  TRANSFER: `transfer`,
  ACTIVITY: `activity`,
};

const DEFAULT_EVENT_TYPE = `bus`;
const currentDate = new Date();
const BLANK_EVENT = {
  category: EventCategory.TRANSFER,
  type: DEFAULT_EVENT_TYPE,
  destination: {
    name: ``,
    info: ``,
    photos: []
  },
  date: {
    start: currentDate,
    end: currentDate
  },
  offers: [],
  cost: ``,
  isFavorite: null,
};

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const UserAction = {
  UPDATE_EVENT: `UpdateEvent`,
  ADD_EVENT: `AddEvent`,
  DELETE_EVENT: `DeleteEvent`
};

const UpdateType = {
  PATCH: `Patch`,
  MINOR: `Minor`,
  MAJOR: `Major`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export {BLANK_EVENT, EventCategory, SortType, UserAction, UpdateType, FilterType};
