'use strict';

var NUMBER_OF_ITEMS = 8;
var MAX_ADULTS = 10;
var MIN_COST = 10000;
var MAX_COST = 1000000;
var MAX_SPACE = 5;
var MIN_Y = 130;
var MAX_Y = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var typeOffer = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

var NAME_OF_HOTELS = [
  'Park Hotel Tokyo',
  'Tokyo Prince Hotel',
  'Tokyo Ariake Bay Hotel',
  'Act Hotel Shibuya',
  'Tokyu Stay Aoyama Premier',
  'Belken Hotel Kanda'];

var ADDRESS = [
  'Tokyo, Minato-ku Higashi Shimbashi 1-7-1',
  'Tokyo, Chiyoda-ku Yurakucho 1-2-1',
  'Tokyo, Koto-ku Ariake 3-7-11',
  'Tokyo, Chuo-ku Nihonbashi Kakigara-cho 2-1-1',
  'Tokyo, Minato-ku Akasaka 3-12-5',
  'Tokyo, Shinjuku-ku Yotsuya 2-1'];

var ACCOMODATIONS = [
  'palace',
  'flat',
  'house',
  'bungalow'];

var TIMES = [
  '12:00',
  '13:00',
  '14:00'];

var ACTIVITIES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'];

var INFO = [
  'Потрясающий вид на город, отель удобно расположен в Токио, всего в нескольких шагах от станции метро Shiodome.',
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
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');

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
        address: getRandomArrElement(ADDRESS),
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

function renderCards(advertisment) {
  var mapMark = cardTemplate.cloneNode(true);
  var photoFragment = document.createDocumentFragment();
  var photoElement = mapMark.querySelector('.popup__photo');
  var photoPart = mapMark.querySelector('.popup__photos');
  var featurePart = mapMark.querySelector('.popup__features');
  mapMark.querySelector('.popup__title').textContent = advertisment.offer.title;
  mapMark.querySelector('.popup__text--address').textContent = advertisment.offer.address;
  mapMark.querySelector('.popup__text--price ').textContent = advertisment.offer.price + '₽/ночь';
  mapMark.querySelector('.popup__type').textContent = typeOffer[advertisment.offer.type];
  mapMark.querySelector('.popup__text--capacity').textContent = advertisment.offer.rooms + ' комнаты для ' + advertisment.offer.guests + ' гостей';
  mapMark.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisment.offer.checkin + ', выезд до ' + advertisment.offer.checkout;
  mapMark.querySelector('.popup__description').textContent = advertisment.offer.description;
  mapMark.querySelector('.popup__avatar').src = advertisment.author.avatar;

  featurePart.innerHTML = '';
  for (var i = 0; i < advertisment.offer.features.length; i++) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + advertisment.offer.features[i]);
    featurePart.append(feature);
  }

  photoPart.innerHTML = '';
  for (var j = 0; j < advertisment.offer.photos.length; j++) {
    var photo = photoElement.cloneNode(true);
    photo.src = advertisment.offer.photos[j];
    photoFragment.appendChild(photo);
  }
  photoPart.appendChild(photoFragment);

  return mapMark;
}

var addCard = function (advItem) {
  var advertisment = renderCards(advItem);
  map.insertBefore(advertisment, mapFiltersContainer);
};

var init = function () {
  activateMap();
  var advArray = createData(NUMBER_OF_ITEMS);
  createPins(advArray);
  addCard(advArray[0]);
};

init();
