'use strict';

(function () {

  var URL_LOAD = 'https://js.dump.academy/keksobooking/data2';
  var URL__UPLOAD = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var TIMELOAD = 1000;

  var loadSuccessHandler = function (data) {
    window.map.createPins(data);
  };

  var loaderrorHandler = function (error) {
    var main = document.body.querySelector('main');
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

  var sendRequest = function (onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    var url = URL_LOAD;
    var requestType = 'GET';

    if (data) {
      requestType = 'POST';
      url = URL__UPLOAD;
    }

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(requestType, url);
    setTimeout(function () {
      xhr.send(data);
    }, TIMELOAD);
  };

  window.backend = {
    sendRequest: sendRequest,
    loadSuccessHandler: loadSuccessHandler,
    loaderrorHandler: loaderrorHandler,
  };
})();
