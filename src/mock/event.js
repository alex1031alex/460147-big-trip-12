const MIN_SENTENCE_COUNT = 1;
const MAX_SENTENCE_COUNT = 5;
const MIN_OFFER_COUNT = 0;
const MAX_OFFER_COUNT = 5;
const MIN_EVENT_DURATION = 30;
const MAX_EVENT_DURATION = 600;
const MIN_INTERVAL_BETWEEN_EVENTS = 20;
const MAX_INTERVAL_BETWEEN_EVENTS = 200;
const MIN_PHOTO_COUNT = 1;
const MAX_PHOTO_COUNT = 5;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const eventTransferTypes = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
];

const eventActivityTypes = [
  `Check-in`,
  `Sightseeing`,
  `Restaurant`,
];

const destinations = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Paris`,
  `Berlin`,
  `Rome`,
];

const offerSamples = [
  {name: `Add luggage`, title: `luggage`, cost: 0, isChecked: false},
  {name: `Switch to comfort`, title: `comfort`, cost: 0, isChecked: false},
  {name: `Add meal`, title: `meal`, cost: 0, isChecked: false},
  {name: `Choose seats`, title: `seats`, cost: 0, isChecked: false},
  {name: `Travel by Train`, title: `train`, cost: 0, isChecked: false},
  {name: `Watch moovie`, title: `moovie`, cost: 0, isChecked: false},
  {name: `Order Uber`, title: `uber`, cost: 0, isChecked: false},
  {name: `Rent a car`, title: `car`, cost: 0, isChecked: false},
  {name: `Add breakfast`, title: `breakfast`, cost: 0, isChecked: false},
  {name: `Lunch in city`, title: `lunch`, cost: 0, isChecked: false},
];

const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const generateDestinationInfo = () => {
  const sentenceCount = getRandomInteger(MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT);
  const sentences = descriptionText.split(`.`).
    filter(Boolean).
    map((it) => `${it}.`);
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

let currentDate = new Date();
let eventIdCounter = 0;

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

const generateOffers = () => {
  const offers = [];
  const offerCount = getRandomInteger(MIN_OFFER_COUNT, MAX_OFFER_COUNT);

  for (let i = 1; i <= offerCount; i++) {
    offers.push(offerSamples[getRandomInteger(0, offerSamples.length - 1)]);
  }

  const nonrepeatingOffers = Array.from(new Set(offers));

  nonrepeatingOffers.forEach((offer) => {
    offer.cost = getRandomInteger(1, 10) * 5;
    offer.isChecked = Boolean(getRandomInteger(0, 1));
  });

  return offers;
};

const generateEvent = () => {
  const isTransferEvent = getRandomInteger(0, 2) > 0;

  return {
    id: eventIdCounter++,
    type: isTransferEvent ? eventTransferTypes[getRandomInteger(0, eventTransferTypes.length - 1)] : eventActivityTypes[getRandomInteger(0, eventActivityTypes.length - 1)],
    destination: {
      name: destinations[getRandomInteger(0, destinations.length - 1)],
      info: generateDestinationInfo(),
      photos: generateDestinationPhotos(),
    },
    date: generateDate(),
    offers: generateOffers(),
    cost: getRandomInteger(2, 120) * 5,
  };
};

export {generateEvent, eventTransferTypes, eventActivityTypes};
