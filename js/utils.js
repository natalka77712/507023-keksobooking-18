'use strict';

(function () {

  var MAX_COST = 1000000;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var onKeyEscPress = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  window.utils = {
    MAX_COST: MAX_COST,
    MIN_Y: MIN_Y,
    MAX_Y: MAX_Y,
    onKeyEscPress: onKeyEscPress,
    ENTER_KEYCODE: ENTER_KEYCODE,
  };

})();
