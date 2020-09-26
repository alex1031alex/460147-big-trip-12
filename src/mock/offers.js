import {transferTypes, activityTypes} from "./event.js";
import {getRandomInteger, getRandomItem} from "../utils/common.js";

const MIN_OFFER_COUNT = 0;
const MAX_OFFER_COUNT = 5;

const types = [...transferTypes, ...activityTypes];
const offerSamples = [
  {title: `Add luggage`, price: 20},
  {title: `Switch to comfort`, price: 45},
  {title: `Add meal`, price: 100},
  {title: `Choose seats`, price: 50},
  {title: `Travel by Train`, price: 70},
  {title: `Watch moovie`, price: 30},
  {title: `Order Uber`, price: 60},
  {title: `Rent a car`, price: 40},
  {title: `Add breakfast`, price: 10},
  {title: `Lunch in city`, price: 20},
];

const offers = [];

const generateOffers = () => {
  types
    .map((type) => {
      const offerCount = getRandomInteger(MIN_OFFER_COUNT, MAX_OFFER_COUNT);
      const draftOffers = [];

      for (let i = 1; i <= offerCount; i++) {
        draftOffers.push(getRandomItem(offerSamples));
      }

      const updatedOffers = Array.from(new Set(draftOffers));

      offers.push({type, offers: updatedOffers});

    });

  return offers;
};

export {generateOffers};
