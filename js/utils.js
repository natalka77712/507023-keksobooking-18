'use strict';

(function () {

  var getRandomIntInclusive = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomSubArray = function (array) {
    array.sort(function () {
      return Math.random() - 0.5;
    });
    return array.slice(0, getRandomIntInclusive(1, array.length));
  };

  var getRandomArrElement = function (array) {
    var random = array[Math.floor(Math.random() * array.length)];
    return random;
  };

  window.utils = {
    getRandomArrElement: getRandomArrElement,
    getRandomSubArray: getRandomSubArray,
    getRandomIntInclusive: getRandomIntInclusive,
  };

})();
