'use strict';

(function () {

  var MIN_X = 0;
  var PIN_TAIL = 33;
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
    var top = mapPinMain.offsetTop;
    var x = mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2;
    var y = activeMode ? (top + mapPinMain.offsetHeight) : (top + mapPinMain.offsetHeight / 2 - PIN_TAIL);

    hotelAddress.value = Math.round(x) + ', ' + Math.round(y);
  };

  var resetMainPinCoordinates = function () {
    mapPinMain.style.left = mainPinDefaultCoordinates.x;
    mapPinMain.style.top = mainPinDefaultCoordinates.y;
  };

  var closeCard = function () {
    var cardMark = document.querySelector('.map__card');
    var activeMapPin = document.querySelector('.map__pin--active');

    if (cardMark) {
      cardMark.remove();
      activeMapPin .classList.remove('map__pin--active');
      window.removeEventListener('keydown', onWindowKeydown);
    }
  };

  var onWindowKeydown = function (evt) {
    window.utils.onKeyEscPress(evt, closeCard);
  };

  var onPinClick = function (element, data) {
    element.addEventListener('click', function () {
      closeCard();
      addCard(data);
      element.classList.add('map__pin--active');

      var CardCloseButton = document.querySelector('.popup__close');

      CardCloseButton.addEventListener('click', function () {
        closeCard();
      });

      document.addEventListener('keydown', onWindowKeydown);
    });
  };

  var addCard = function (advItem) {
    var advertisment = window.card.create(advItem);
    map.insertBefore(advertisment, mapFiltersContainer);
  };

  var onEnterPressEvent = function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEYCODE) {
      if (!state.isDataLoaded) {
        window.backend.load(onLoadSuccess, window.message.onLoad);
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
    closeCard();
    var pinsCollections = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    map.classList.add('map--faded');
    setDisabledFieldSet();
    deactivateFilters();
    document.addEventListener('keydown', onEnterPressEvent);
    window.avatar.removeItems(pinsCollections);
    window.avatar.reset();
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
      var pin = window.pin.create(rents[i]);

      onPinClick(pin, rents[i]);

      fragment.appendChild(pin);
    }

    pinList.appendChild(fragment);
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

      if (currentY >= window.utils.MIN_Y && currentY <= window.utils.MAX_Y) {
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
        window.backend.load(onLoadSuccess, window.message.onLoad);
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
    closeCard();
    var pinsCollections = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    window.avatar.removeItems(pinsCollections);
    createPins(window.filters.getFiltered(offers));
  };

  deactivatePage();

  window.map = {
    adForm: adForm,
    mapPinMain: mapPinMain,
    deactivatePage: deactivatePage,
    fillInn: fillInnAddress,
    resetMainPin: resetMainPinCoordinates,
    mapFilters: mapFilters,
    draw: drawAllPins,
  };

})();
