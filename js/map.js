'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var NUMBER_OF_ITEMS = 8;

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinList = document.querySelector('.map__pins');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adForm = document.querySelector('.ad-form');
  var formFieldset = document.querySelectorAll('fieldset');

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

  var addCard = function (advItem) {
    var advertisment = window.createCard(advItem);
    map.insertBefore(advertisment, mapFiltersContainer);
  };

  var setDisabledFieldSet = function (fieldset, isDisabled) {
    for (var i = 0; i < fieldset.length; i++) {
      fieldset[i].disabled = isDisabled;
    }
  };

  var onEnterPressEvent = function (evt) {
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
    document.addEventListener('keydown', onEnterPressEvent);
  };

  var activatePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    setDisabledFieldSet(formFieldset, false);
    createPins(advArray);
    mapPinMain.removeEventListener('mousedown', onMapPinMousedown);
    document.removeEventListener('keydown', onEnterPressEvent);
  };

  var advArray = window.data.createData(NUMBER_OF_ITEMS);

  var createPins = function (rents) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < rents.length; i++) {
      var pin = window.createPin(rents[i]);

      onClickPin(pin, rents[i]);

      fragment.appendChild(pin);
    }

    pinList.appendChild(fragment);
  };

  deactivatePage();

  window.map = {
    createPins: createPins,
    adForm: adForm,
    mapPinMain: mapPinMain,
  };

})();
