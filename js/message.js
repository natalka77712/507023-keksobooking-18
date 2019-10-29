'use strict';

(function () {

  var main = document.body.querySelector('main');

  var loaderrorHandler = function (error) {
    var errorTemplate = document.querySelector('#error').content;
    var errorWindow = errorTemplate.cloneNode(true).querySelector('.error');
    var errorMessage = errorWindow.querySelector('.error__message');
    var errorButton = errorWindow.querySelector('.error__button');
    errorMessage.textContent = error;

    main.appendChild(errorWindow);

    var closeErrorWindow = function () {
      errorButton.removeEventListener('click', clickMessageCloseButton);
      document.removeEventListener('keydown', errowMessageEscPress);
      document.removeEventListener('click', clickMapOpen);
      errorWindow.remove();
    };

    var clickMessageCloseButton = function (evt) {
      closeErrorWindow(evt);
    };

    var clickMapOpen = function (evt) {
      closeErrorWindow(evt);
    };

    var errowMessageEscPress = function (evt) {
      if (evt.keyCode === window.map.ESC_KEYCODE) {
        closeErrorWindow();
      }
    };

    document.addEventListener('click', clickMapOpen);
    errorButton.addEventListener('click', clickMessageCloseButton);
    document.addEventListener('keydown', errowMessageEscPress);
  };

  var showSuccessMessage = function () {
    var successWindow = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
    main.appendChild(successWindow);
    var successMessage = main.querySelector('.success');

    main.appendChild(successWindow);

    var closeSuccessWindow = function () {
      successMessage.remove();
      document.removeEventListener('keydown', successMessageEscPress);
      document.removeEventListener('click', clickMapActive);
    };

    var clickMapActive = function (evt) {
      closeSuccessWindow(evt);
    };

    var successMessageEscPress = function (evt) {
      if (evt.keyCode === window.map.ESC_KEYCODE) {
        closeSuccessWindow();
      }
    };

    document.addEventListener('keydown', successMessageEscPress);
    document.addEventListener('click', clickMapActive);
  };

  window.message = {
    loaderrorHandler: loaderrorHandler,
    showSuccessMessage: showSuccessMessage,
  };

})();
