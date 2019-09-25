'use strict';

var MAX_ADULTS = 10;
var MIN_COST = 10000;
var MAX_COST = 1000000;
var MAX_SPACE = 5;
var MIN_Y = 130;
var MAX_Y = 630;
var NUMBER_OF_ITEMS = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var NAME_OF_HOTELS = ['Park Hotel Tokyo',
  'Tokyo Prince Hotel',
  'Tokyo Ariake Bay Hotel',
  'Act Hotel Shibuya',
  'Tokyu Stay Aoyama Premier',
  'Belken Hotel Kanda'];

var ACCOMODATIONS = ['palace', 'flat', 'house', 'bungalow'];

var TIMES = ['12:00', '13:00', '14:00'];

var ACTIVITIES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var INFO = ['Потрясающий вид на город, отель удобно расположен в Токио, всего в нескольких шагах от станции метро Shiodome.',
  'Отель расположен всего в 3 минутах ходьбы от телевизионной башни Токио.',
  'Капсульный отель в 4 минутах ходьбы от железнодорожного вокзала Синономэ на линии Ринкай.',
  'Отель удобно расположен в районе Мегуро Вард, в 600 м от храма Камимегуро-Хикава, в 800 м от парка Сугекари.',
  'Отель находится в 2 минутах ходьбы от станции метро Gaienmae.',
  'Отель расположен в 2,1 км от Императорского дворца и в 2,7 км от национального стадиона сумо «Рёгоку Кокугикан.'];

var IMAGES = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
var mapPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinListElement = document.querySelector('.map__pins');

var activateMap = function () {
  map.classList.remove('map--faded');
};

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getRandomSubArray = function (array) {
  array.sort(function () {
    return Math.random() - 0.5;
  });
  return array.slice(0, getRandomIntInclusive(1, array.length));
};

var getRandomArrElement = function (array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
};

var createData = function (number) {
  var rents = [];

  for (var i = 1; i <= number; i++) {
    rents.push({
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: getRandomArrElement(NAME_OF_HOTELS),
        price: getRandomIntInclusive(MIN_COST, MAX_COST),
        type: getRandomArrElement(ACCOMODATIONS),
        rooms: getRandomIntInclusive(1, MAX_SPACE),
        guests: getRandomIntInclusive(1, MAX_ADULTS),
        checkin: getRandomArrElement(TIMES),
        checkout: getRandomArrElement(TIMES),
        features: getRandomSubArray(ACTIVITIES),
        description: getRandomArrElement(INFO),
        photos: getRandomSubArray(IMAGES)
      },

      location: {
        x: getRandomIntInclusive(1, map.offsetWidth),
        y: getRandomIntInclusive(MIN_Y, MAX_Y)
      }
    });
  }
  return rents;
};

var renderPin = function (advertisment) {
  var pin = mapPinsTemplate.cloneNode(true);

  pin.style.left = advertisment.location.x - PIN_WIDTH / 2 + 'px';
  pin.style.top = advertisment.location.y - PIN_HEIGHT + 'px';
  pin.querySelector('img').src = advertisment.author.avatar;
  pin.querySelector('img').alt = advertisment.offer.title;

  return pin;
};

var createPins = function (rents) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < rents.length; i++) {
    fragment.appendChild(renderPin(rents[i]));
  }

  pinListElement.appendChild(fragment);
};

var createNewArray = function () {
  activateMap();
  var advArray = createData(NUMBER_OF_ITEMS);
  createPins(advArray);
};

createNewArray();
