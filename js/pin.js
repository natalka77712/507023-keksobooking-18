'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var mapPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var createPin = function (advertisment) {
    var pin = mapPinsTemplate.cloneNode(true);

    pin.style.left = advertisment.location.x - PIN_WIDTH / 2 + 'px';
    pin.style.top = advertisment.location.y - PIN_HEIGHT + 'px';
    pin.querySelector('img').src = advertisment.author.avatar;
    pin.querySelector('img').alt = advertisment.offer.title;

    return pin;
  };

  window.pin = {
    create: createPin,
    PIN_WIDTH: PIN_WIDTH,
  };
})();
