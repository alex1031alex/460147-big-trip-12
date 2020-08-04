const MIN_SENTENCE_COUNT = 1;
const MAX_SENTENCE_COUNT = 5;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const eventTransferTypes = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
];

const eventActivityTypes = [
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

const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const generateDestinationInfo = () => {
  const sentenceCount = getRandomInteger(MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT);
  const sentences = descriptionText.split(`.`).
    filter(Boolean).
    map((it) => `${it}.`);
  const destinationInfo = sentences.slice(0, sentenceCount);

  return destinationInfo;
};

const generateEvent = () => {
  const isTransferEvent = getRandomInteger(0, 2) > 0;

  return {
    type: isTransferEvent ? eventTransferTypes[getRandomInteger(0, eventTransferTypes.length - 1)] : eventActivityTypes[getRandomInteger(0, eventActivityTypes.length - 1)],
    destination: isTransferEvent ? {
      name: destinations(getRandomInteger(0, destinations.length)),
      info: generateDestinationInfo(),
    } : null,
    options: [],
  };
};

export {generateEvent};
