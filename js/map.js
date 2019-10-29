'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var MIN_X = 0;

  var activeMode = false;

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinList = document.querySelector('.map__pins');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adForm = document.querySelector('.ad-form');
  var formFieldset = document.querySelectorAll('fieldset');
  var hotelAddress = document.querySelector('#address');
  var mapFilters = document.querySelector('.map__filters');
  var filterField = mapFilters.querySelectorAll('.map__filter');
  var mainPinDefaultCoordinates = {
    x: mapPinMain.style.left,
    y: mapPinMain.style.top,
  };

  var onLoad = false;

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
        document.removeEventListener('keydown', PinEscPress);
        cardMark.remove();
      };

      var clickCardCloseButton = function (evt) {
        closeCard(evt);
      };

      var PinEscPress = function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          closeCard();
        }
      };

      cardCloseButton.addEventListener('click', clickCardCloseButton);
      document.addEventListener('keydown', PinEscPress);
    });
  };

  var addCard = function (advItem) {
    var advertisment = window.card.createCard(advItem);
    map.insertBefore(advertisment, mapFiltersContainer);
  };

  var setDisabledFieldSet = function (fieldset, isDisabled) {
    for (var i = 0; i < fieldset.length; i++) {
      fieldset[i].disabled = isDisabled;
    }
  };

  var setDisabled = function (element) {
    element.disabled = true;
  };

  var setActive = function (element) {
    element.disabled = false;
  };

  var deactivateFilters = function () {
    filterField.forEach(setDisabled);
  };

  var activateFilters = function () {
    filterField.forEach(setActive);
  };

  var onEnterPressEvent = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage();
      fillInnAddress();
      activateFilters();
      mapFilters.classList.remove('ad-form--disabled');
      window.backend.load(loadSuccessHandler, window.message.loaderrorHandler);
    }
  };

  var onMapPinMousedown = function () {
    activatePage();
  };

  var deactivatePage = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    mapFilters.classList.add('ad-form--disabled');
    setDisabledFieldSet(formFieldset, true);
    deactivateFilters();
    mapPinMain.addEventListener('mousedown', onMapPinMousedown);
    document.addEventListener('keydown', onEnterPressEvent);
    var pinsCollections = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    removePins(pinsCollections);
  };

  var activatePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    setDisabledFieldSet(formFieldset, false);
    mapPinMain.removeEventListener('mousedown', onMapPinMousedown);
    document.removeEventListener('keydown', onEnterPressEvent);
  };

  var createPins = function (rents) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < rents.length; i++) {
      var pin = window.pin.createPin(rents[i]);

      onClickPin(pin, rents[i]);

      fragment.appendChild(pin);
    }

    pinList.appendChild(fragment);
  };

  var removePins = function (pins) {
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
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
      if (!onLoad) {
        activatePage();

        window.backend.load(loadSuccessHandler, window.message.loaderrorHandler);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        mapFilters.classList.remove('ad-form--disabled');
        activateFilters();
        fillInnAddress();
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  var loadSuccessHandler = function (data) {
    createPins(data);
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
  };

})();
