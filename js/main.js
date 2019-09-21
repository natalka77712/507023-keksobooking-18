'use strict';

var MAX_GUEST = 10;
var MIN_PRICE = 10000;
var MAX_PRICE = 1000000;
var MAX_ROOMS = 5;
var MIN_Y = 130;
var MAX_Y = 630;
var NUMBER_OF_ITEMS = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var TITLES = ['Park Hotel Tokyo',
  'Tokyo Prince Hotel',
  'Tokyo Ariake Bay Hotel',
  'Act Hotel Shibuya',
  'Tokyu Stay Aoyama Premier',
  'Belken Hotel Kanda'];

var TYPES = ['palace', 'flat', 'house', 'bungalow'];

var TIMES = ['12:00', '13:00', '14:00'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var DESCRIPTIONS = ['Потрясающий вид на город, отель удобно расположен в Токио, всего в нескольких шагах от станции метро Shiodome.',
  'Отель Tokyo Prince расположен всего в 3 минутах ходьбы от телевизионной башни Токио.',
  'Капсульный отель в 4 минутах ходьбы от железнодорожного вокзала Синономэ на линии Ринкай.',
  'Отель Act Shibuya удобно расположен в районе Мегуро Вард, в 600 м от храма Камимегуро-Хикава, в 800 м от парка Сугекари.',
  'Отель Tokyu Stay Aoyama Premier находится в 2 минутах ходьбы от станции метро Gaienmae.',
  'Отель Belken Kanda расположен в Токио, в 2,1 км от Императорского дворца и в 2,7 км от национального стадиона сумо «Рёгоку Кокугикан.'];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
var mapPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinListElement = document.querySelector('.map__pins');

var hideMap = function () {
  map.classList.remove('map--faded');
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getRandomInt = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

var getRandomArr = function (arr) {
  var randomArr = [];
  var arrayLength = getRandomInt(getRandomIntInclusive(1, 10));
  for (var i = 0; i < arrayLength; i++) {
    randomArr.push(arr[i]);
  }

  return randomArr;
};

var getRandomArrElement = function (array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
};

var createData = function (number) {
  var rents = [];

  for (var i = 1; i < number; i++) {
    rents.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getRandomArrElement(TITLES),
        price: getRandomIntInclusive(MIN_PRICE, MAX_PRICE),
        type: getRandomArrElement(TYPES),
        rooms: getRandomIntInclusive(1, MAX_ROOMS),
        guests: getRandomIntInclusive(1, MAX_GUEST),
        checkin: getRandomArrElement(TIMES),
        checkout: getRandomArrElement(TIMES),
        features: getRandomArr(FEATURES),
        description: getRandomArrElement(DESCRIPTIONS),
        photos: getRandomArr(PHOTOS)
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

var newArray = function () {
  hideMap();
  var advArray = createData(NUMBER_OF_ITEMS);
  createPins(advArray);
};

newArray();

