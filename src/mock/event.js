const MIN_SENTENCE_COUNT = 1;
const MAX_SENTENCE_COUNT = 5;
const MIN_OPTION_COUNT = 0;
const MAX_OPTION_COUNT = 5;

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

const optionNames = [
  `Add luggage`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`,
  `Travel by Train`,
  `Watch moovie`,
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

let currentDate = new Date();
const eventInterval = getRandomInteger(30, 600);
const intervalBetweenEvents = getRandomInteger(20, 200);

const generateDate = () => {
  const startDate = new Date(currentDate);
  startDate.setMinutes(startDate.getMinutes() + intervalBetweenEvents);

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + eventInterval);

  currentDate = new Date(endDate);

  return {
    start: startDate,
    end: endDate,
  };
};

const generateOptions = () => {
  const names = [];
  const optionsCount = getRandomInteger(MIN_OPTION_COUNT, MAX_OPTION_COUNT);

  for (let i = 1; i <= optionsCount; i++) {
    names.push(optionNames[getRandomInteger(0, optionNames.length - 1)]);
  }

  const nonrepeatingNames = Array.from(new Set(names));
  const options = nonrepeatingNames.
    map((name) => {
      return {
        name,
        cost: getRandomInteger(1, 10) * 5,
      };
    });

  return options;
};

const generateEvent = () => {
  const isTransferEvent = getRandomInteger(0, 2) > 0;

  return {
    type: isTransferEvent ? eventTransferTypes[getRandomInteger(0, eventTransferTypes.length - 1)] : eventActivityTypes[getRandomInteger(0, eventActivityTypes.length - 1)],
    destination: isTransferEvent ? {
      name: destinations[getRandomInteger(0, destinations.length)],
      info: generateDestinationInfo(),
      photo: `http://picsum.photos/248/152?r=${Math.random()}`,
    } : null,
    time: generateDate(),
    options: generateOptions(),
    price: getRandomInteger(2, 120) * 5,
  };
};

export {generateEvent};
