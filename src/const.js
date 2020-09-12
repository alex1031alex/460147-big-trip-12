const EventCategory = {
  TRANSFER: `transfer`,
  ACTIVITY: `activity`,
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

export {EventCategory, SortType, UserAction, UpdateType};
