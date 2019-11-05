'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var MIN_X = 0;

  var activeMode = false;
  var VALUE_OF_PINS = 5;
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinList = document.querySelector('.map__pins');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adForm = document.querySelector('.ad-form');
  var hotelAddress = document.querySelector('#address');
  var mapFilters = document.querySelector('.map__filters');
  var filterField = mapFilters.querySelectorAll('.map__filter');
  var formFieldset = document.querySelectorAll('fieldset');
  var offers = [];
  var mainPinDefaultCoordinates = {
    x: mapPinMain.style.left,
    y: mapPinMain.style.top,
  };

  var state = {
    isDataLoaded: false,
  };

  var fillInnAddress = function () {
    var top = window.map.mapPinMain.offsetTop;
    var x = window.map.mapPinMain.offsetLeft + window.map.mapPinMain.offsetWidth / 2;
    var y = activeMode ? (top + window.map.mapPinMain.offsetHeight) : (top + window.map.mapPinMain.offsetHeight / 2);

    hotelAddress.value = Math.round(x) + ', ' + Math.round(y);
  };

  var resetMainPinCoordinates = function () {
    mapPinMain.style.left = mainPinDefaultCoordinates.x;
    mapPinMain.style.top = mainPinDefaultCoordinates.y;
  };

  var closeCard = function () {
    var cardMark = document.querySelector('.map__card');

    if (cardMark) {
      cardMark.remove();
      document.removeEventListener('keydown', onPinEscPress);
    }
  };

  var onPinEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeCard();
    }
  };

  var onPinClick = function (element, data) {
    element.addEventListener('click', function () {
      closeCard();
      addCard(data);

      var CardCloseButton = document.querySelector('.popup__close');

      CardCloseButton.addEventListener('click', function () {
        closeCard();
      });

      document.addEventListener('keydown', onPinEscPress);
    });
  };

  var addCard = function (advItem) {
    var advertisment = window.card.createCard(advItem);
    map.insertBefore(advertisment, mapFiltersContainer);
  };

  var onEnterPressEvent = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      if (!state.isDataLoaded) {
        window.backend.load(onLoadSuccess, window.message.onLoadError);
      }
      activatePage();
      fillInnAddress();
    }
  };

  var setDisabledFieldSet = function () {
    adForm.classList.add('ad-form--disabled');
    formFieldset.forEach(function (fieldset) {
      fieldset.disabled = true;
    });
  };

  var setActiveFieldSet = function () {
    adForm.classList.remove('ad-form--disabled');
    formFieldset.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
  };

  var deactivateFilters = function () {
    mapFilters.classList.add('ad-form--disabled');
    filterField.forEach(function (filter) {
      filter.disabled = true;
    });
  };

  var activateFilters = function () {
    mapFilters.classList.remove('ad-form--disabled');
    filterField.forEach(function (filter) {
      filter.disabled = false;
    });
  };

  var deactivatePage = function () {
    map.classList.add('map--faded');
    setDisabledFieldSet();
    deactivateFilters();
    document.addEventListener('keydown', onEnterPressEvent);
    removePins();
    state.isDataLoaded = false;
  };

  var activatePage = function () {
    map.classList.remove('map--faded');
    setActiveFieldSet();
    mapPinMain.removeEventListener('mousedown', onMapPinMousedown);
    document.removeEventListener('keydown', onEnterPressEvent);
  };

  var createPins = function (rents) {
    var fragment = document.createDocumentFragment();
    var valueOfPins = (rents.length >= VALUE_OF_PINS) ? VALUE_OF_PINS : rents.length;

    for (var i = 0; i <= (valueOfPins - 1); i++) {
      var pin = window.pin.createPin(rents[i]);

      onPinClick(pin, rents[i]);

      fragment.appendChild(pin);
    }

    pinList.appendChild(fragment);
  };

  var removePins = function () {
    var pinsCollections = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinsCollections.forEach(function (pin) {
      pin.remove();
    });
  };

  var onMapPinMousedown = function () {
    activatePage();
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentY = mapPinMain.offsetTop - shift.y;
      var currentX = mapPinMain.offsetLeft - shift.x;

      if (currentY >= window.data.MIN_Y && currentY <= window.data.MAX_Y) {
        mapPinMain.style.top = currentY + 'px';
      }

      if (currentX >= MIN_X - window.pin.PIN_WIDTH / 2 && currentX <= map.offsetWidth - window.pin.PIN_WIDTH / 2) {
        mapPinMain.style.left = currentX + 'px';
      }

      fillInnAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!state.isDataLoaded) {
        activatePage();
        window.backend.load(onLoadSuccess, window.message.onLoadError);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      fillInnAddress();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onLoadSuccess = function (pin) {
    offers = pin;
    drawAllPins();
    state.isDataLoaded = true;
    activateFilters();
  };

  var drawAllPins = function () {
    removePins();
    closeCard();
    createPins(window.filters.getFilteredData(offers));
  };

  deactivatePage();

  window.map = {
    createPins: createPins,
    adForm: adForm,
    mapPinMain: mapPinMain,
    ESC_KEYCODE: ESC_KEYCODE,
    deactivatePage: deactivatePage,
    fillInnAddress: fillInnAddress,
    resetMainPinCoordinates: resetMainPinCoordinates,
    mapFilters: mapFilters,
    removePins: removePins,
    drawAllPins: drawAllPins,
  };

})();
