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
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

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

var PRICES = {
  flat: 1000,
  bungalo: 0,
  house: 5000,
  palace: 10000
};

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
var pinList = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var hotelAddress = document.querySelector('#address');
var formFieldset = document.querySelectorAll('fieldset');
var roomsCapacity = adForm.querySelector('#room_number');
var guestsCapacity = adForm.querySelector('#capacity');
var adFormType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');
var adFormTimein = adForm.querySelector('#timein');
var adFormTimeout = adForm.querySelector('#timeout');

var getRandomIntInclusive = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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

var createPin = function (advertisment) {
  var pin = mapPinsTemplate.cloneNode(true);

  pin.style.left = advertisment.location.x - PIN_WIDTH / 2 + 'px';
  pin.style.top = advertisment.location.y - PIN_HEIGHT + 'px';
  pin.querySelector('img').src = advertisment.author.avatar;
  pin.querySelector('img').alt = advertisment.offer.title;

  return pin;
};

var onClickPin = function (element, data) {
  element.addEventListener('click', function () {
    var cardMark = document.querySelector('.map__card');
    if (cardMark) {
      cardMark.remove();
    }
    addCard(data);

    cardMark = document.querySelector('.map__card');
    var cardCloseButton = cardMark.querySelector('.popup__close');

    var closeCard = function () {
      cardCloseButton.removeEventListener('click', clickCardCloseButton);
      document.removeEventListener('keydown', onPinEscPress);
      cardMark.remove();
    };

    var clickCardCloseButton = function (evt) {
      closeCard(evt);
    };

    var onPinEscPress = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeCard();
      }
    };

    cardCloseButton.addEventListener('click', clickCardCloseButton);
    document.addEventListener('keydown', onPinEscPress);
  });
};

var createPins = function (rents) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < rents.length; i++) {
    var pin = createPin(rents[i]);

    onClickPin(pin, rents[i]);

    fragment.appendChild(pin);
  }

  pinList.appendChild(fragment);
};

var createCard = function (advertisment) {
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
};

var addCard = function (advItem) {
  var advertisment = createCard(advItem);
  map.insertBefore(advertisment, mapFiltersContainer);
};

var advArray = createData(NUMBER_OF_ITEMS);

var fillInnAddress = function (activeMode) {
  var top = mapPinMain.offsetTop;
  var x = mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2;
  var y = activeMode ? (top + mapPinMain.offsetHeight) : (top + mapPinMain.offsetHeight / 2);

  hotelAddress.value = Math.round(x) + ', ' + Math.round(y);
};

var setDisabledFieldSet = function (fieldset, isDisabled) {
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].disabled = isDisabled;
  }
};

var onPageEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage();
  }
};

var onMapPinMousedown = function () {
  activatePage();
};

var deactivatePage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  setDisabledFieldSet(formFieldset, true);
  mapPinMain.addEventListener('mousedown', onMapPinMousedown);
  document.addEventListener('keydown', onPageEnterPress);
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setDisabledFieldSet(formFieldset, false);
  createPins(advArray);
  mapPinMain.removeEventListener('mousedown', onMapPinMousedown);
  document.removeEventListener('keydown', onPageEnterPress);
};

var setValidateLengthOfTitle = function () {
  var titleInput = adForm.querySelector('#title');
  titleInput.addEventListener('input', function () {
    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Заголовок должен состоять минимум из 30 символов');
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else {
      titleInput.setCustomValidity('');
    }
  });
};

var setValidateInputPrice = function () {
  var setOptions = function (evt) {
    var typeValue = evt.target.value;
    var minPrice = parseInt(PRICES[typeValue], 10);
    adFormPrice.min = minPrice;
    adFormPrice.placeholder = minPrice;
  };

  adFormType.addEventListener('change', setOptions);
  adFormPrice.max = MAX_COST;
};

adFormTimein.addEventListener('change', function (evt) {
  adFormTimeout.value = evt.target.value;
});
adFormTimeout.addEventListener('change', function (evt) {
  adFormTimein.value = evt.target.value;
});

var validateGuestsNumber = function () {
  var numberRoomSelected = parseInt(roomsCapacity.value, 10);
  var numberGuestSelected = parseInt(guestsCapacity.value, 10);

  if (numberRoomSelected < numberGuestSelected && numberGuestSelected !== 0) {
    guestsCapacity.setCustomValidity('Количество гостей не должно превышать количество комнат');
  } else if (numberRoomSelected === 100 && numberGuestSelected !== 0) {
    guestsCapacity.setCustomValidity('Данное значение должно соответствовать категории "не для гостей"');
  } else if (numberRoomSelected !== 100 && numberGuestSelected === 0) {
    guestsCapacity.setCustomValidity('Категории "не для гостей", должно соответстовать количество комнат равное 100');
  } else {
    guestsCapacity.setCustomValidity('');
  }
};

adForm.addEventListener('change', validateGuestsNumber);

var validateForm = function () {
  validateGuestsNumber();
  setValidateLengthOfTitle();
  setValidateInputPrice();
};
validateForm();

fillInnAddress(false);
deactivatePage();
