const EventCategory = {
  TRANSFER: `transfer`,
  ACTIVITY: `activity`,
};

const transferTypes = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
];

const activityTypes = [
  `check-in`,
  `sightseeing`,
  `restaurant`,
];

const DEFAULT_EVENT_TYPE = `bus`;
const currentDate = new Date();
const BLANK_EVENT = {
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
  MAJOR: `Major`,
  INIT: `Init`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const MenuItem = {
  ADD_NEW_EVENT: `add new event`,
  TABLE: `table`,
  STATS: `stats`
};

export {
  BLANK_EVENT,
  EventCategory,
  SortType, UserAction,
  UpdateType,
  FilterType,
  MenuItem,
  transferTypes,
  activityTypes
};
