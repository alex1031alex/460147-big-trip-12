import {EventCategory} from "../const.js";
import {getRandomInteger, getRandomItem} from "../utils/common.js";

const MIN_SENTENCE_COUNT = 1;
const MAX_SENTENCE_COUNT = 5;
const MIN_EVENT_DURATION = 30;
const MAX_EVENT_DURATION = 600;
const MIN_INTERVAL_BETWEEN_EVENTS = 20;
const MAX_INTERVAL_BETWEEN_EVENTS = 200;
const MIN_PHOTO_COUNT = 1;
const MAX_PHOTO_COUNT = 5;

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

const destinations = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Paris`,
  `Berlin`,
  `Rome`,
];

const getDestinations = () => destinations;

const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const generateDestinationInfo = () => {
  const sentenceCount = getRandomInteger(MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT);
  const sentences = descriptionText.split(`.`)
    .filter(Boolean)
    .map((it) => `${it}.`);
  const destinationInfo = sentences.slice(0, sentenceCount).join(``);

  return destinationInfo;
};

const generateDestinationPhotos = () => {
  const photoCount = getRandomInteger(MIN_PHOTO_COUNT, MAX_PHOTO_COUNT);
  const photos = [];
  for (let i = 1; i <= photoCount; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};

let currentDate = new Date(2020, 8, 11);
let eventIdCounter = 0;

const generateId = () => {
  return eventIdCounter++;
};

const generateDate = () => {
  const startDate = new Date(currentDate);
  startDate.setMinutes(startDate.getMinutes() + getRandomInteger(MIN_INTERVAL_BETWEEN_EVENTS, MAX_INTERVAL_BETWEEN_EVENTS));

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + getRandomInteger(MIN_EVENT_DURATION, MAX_EVENT_DURATION));

  currentDate = new Date(endDate);

  return {
    start: startDate,
    end: endDate,
  };
};

const generateEvent = () => {
  const event = {};
  const category = getRandomInteger(0, 2) > 0 ? EventCategory.TRANSFER : EventCategory.ACTIVITY;

  event.id = generateId();

  if (category === EventCategory.TRANSFER) {
    event.type = getRandomItem(transferTypes);
  } else {
    event.type = getRandomItem(activityTypes);
  }
  event.destination = {
    name: getRandomItem(destinations),
    info: generateDestinationInfo(),
    photos: generateDestinationPhotos(),
  };

  event.offers = [];
  event.date = generateDate();

  event.cost = getRandomInteger(2, 120) * 5;
  event.isFavorite = false;
  return event;
};

export {
  generateId,
  generateEvent,
  generateDestinationInfo,
  generateDestinationPhotos,
  getDestinations,
  transferTypes,
  activityTypes
};
