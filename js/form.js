'use strict';

(function () {

  var PRICES = {
    flat: 1000,
    bungalo: 0,
    house: 100000,
    palace: 10000
  };
  var MAX_VALUE = 100;
  var roomsCapacity = document.querySelector('#room_number');
  var guestsCapacity = document.querySelector('#capacity');
  var adFormType = document.querySelector('#type');
  var adFormPrice = document.querySelector('#price');
  var adFormTimein = document.querySelector('#timein');
  var adFormTimeout = document.querySelector('#timeout');

  var setValidateLengthOfTitle = function () {
    var titleInput = document.querySelector('#title');
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

  var reset = function () {
    window.map.adForm.reset();
    window.map.mapFilters.reset();
  };

  var setValidateInputPrice = function () {
    var setOptions = function (evt) {
      var typeValue = evt.target.value;
      var minPrice = parseInt(PRICES[typeValue], 10);
      adFormPrice.min = minPrice;
      adFormPrice.placeholder = minPrice;
    };

    adFormType.addEventListener('change', setOptions);
    adFormPrice.max = window.utils.MAX_COST;
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
    } else if (numberRoomSelected === MAX_VALUE && numberGuestSelected !== 0) {
      guestsCapacity.setCustomValidity('Данное значение должно соответствовать категории "не для гостей"');
    } else if (numberRoomSelected !== MAX_VALUE && numberGuestSelected === 0) {
      guestsCapacity.setCustomValidity('Категории "не для гостей", должно соответстовать количество комнат равное 100');
    } else {
      guestsCapacity.setCustomValidity('');
    }
  };

  window.map.adForm.addEventListener('change', validateGuestsNumber);

  var validateForm = function () {
    validateGuestsNumber();
    setValidateLengthOfTitle();
    setValidateInputPrice();
  };
  validateForm();

  var onFormSubmitSuccess = function () {
    window.message.showSuccess();
    reset();
    window.map.deactivatePage();
    window.map.resetMainPin();
    window.map.fillInn();
  };

  var onFormSubmitError = function () {
    window.message.onLoad();
  };

  window.map.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(window.map.adForm), onFormSubmitSuccess, onFormSubmitError);
  });
})();
