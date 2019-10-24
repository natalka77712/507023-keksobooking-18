'use strict';

(function () {

  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL__UPLOAD = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;

  var request = function (onLoad, onError, data) {
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
    xhr.send(data);
  };

  window.request = request;
})();
