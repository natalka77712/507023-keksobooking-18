'use strict';

(function () {

  var main = document.body.querySelector('main');

  var onLoadError = function (error) {
    var errorTemplate = document.querySelector('#error').content;
    var errorWindow = errorTemplate.cloneNode(true).querySelector('.error');
    var errorMessage = errorWindow.querySelector('.error__message');
    var errorButton = errorWindow.querySelector('.error__button');
    errorMessage.textContent = error;

    main.appendChild(errorWindow);

    var closeErrorWindow = function () {
      errorButton.removeEventListener('click', onMessageClickCloseButton);
      document.removeEventListener('keydown', onMessageErrorEscPress);
      document.removeEventListener('click', onMapClickOpen);
      errorWindow.remove();
    };

    var onMessageClickCloseButton = function (evt) {
      closeErrorWindow(evt);
    };

    var onMapClickOpen = function (evt) {
      closeErrorWindow(evt);
    };

    var onMessageErrorEscPress = function (evt) {
      if (evt.keyCode === window.map.ESC_KEYCODE) {
        closeErrorWindow();
      }
    };

    document.addEventListener('click', onMapClickOpen);
    errorButton.addEventListener('click', onMessageClickCloseButton);
    document.addEventListener('keydown', onMessageErrorEscPress);
  };

  var showSuccessMessage = function () {
    var successWindow = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
    main.appendChild(successWindow);
    var successMessage = main.querySelector('.success');

    main.appendChild(successWindow);

    var closeSuccessWindow = function () {
      successMessage.remove();
      document.removeEventListener('keydown', onMessageSuccessEscPress);
      document.removeEventListener('click', onMapClickActive);
    };

    var onMapClickActive = function (evt) {
      closeSuccessWindow(evt);
    };

    var onMessageSuccessEscPress = function (evt) {
      if (evt.keyCode === window.map.ESC_KEYCODE) {
        closeSuccessWindow();
      }
    };

    document.addEventListener('keydown', onMessageSuccessEscPress);
    document.addEventListener('click', onMapClickActive);
  };

  window.message = {
    onLoadError: onLoadError,
    showSuccessMessage: showSuccessMessage,
  };

})();
