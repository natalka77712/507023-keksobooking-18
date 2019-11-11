'use strict';

(function () {

  var PRICE = {
    MIN: 10000,
    MAX: 50000
  };
  var DEBOUNCE_INTERVAL = 500;
  var DEFAULT_VALUE = 'any';
  var filterByHousingType = window.map.mapFilters.querySelector('[name="housing-type"]');
  var filterByHousingPrice = window.map.mapFilters.querySelector('[name="housing-price"]');
  var filterByHousingRooms = window.map.mapFilters.querySelector('[name="housing-rooms"]');
  var filterByHousingGuests = window.map.mapFilters.querySelector('[name="housing-guests"]');
  var filterByHousingFeatures = document.querySelectorAll('#housing-features input');

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var byTypeFiltered = function (pin) {
    if (filterByHousingType.value !== DEFAULT_VALUE) {
      return pin.offer.type === filterByHousingType.value;
    }
    return true;
  };

  var byPriceFiltered = function (pin) {
    switch (filterByHousingPrice.value) {
      case 'low':
        return pin.offer.price < PRICE.MIN;
      case 'middle':
        return pin.offer.price >= PRICE.MIN && pin.offer.price <= PRICE.MAX;
      case 'high':
        return pin.offer.price > PRICE.MAX;
      default:
        return true;
    }
  };

  var byRoomsFiltered = function (pin) {
    if (filterByHousingRooms.value !== DEFAULT_VALUE) {
      return pin.offer.rooms === parseInt(filterByHousingRooms.value, 10);
    }
    return true;
  };

  var byGuestsFiltered = function (pin) {
    if (filterByHousingGuests.value !== DEFAULT_VALUE) {
      return pin.offer.guests === parseInt(filterByHousingGuests.value, 10);
    }
    return true;
  };

  var byFeaturesFiltered = function (pin) {
    var features = [];

    filterByHousingFeatures.forEach(function (element) {
      if (element.checked) {
        features.push(element.value);
      }
    });

    return features.every(function (el) {
      return pin.offer.features.includes(el);
    });
  };

  var getFilteredData = function (data) {
    return data.filter(function (pin) {
      return byTypeFiltered(pin) &&
      byPriceFiltered(pin) &&
      byRoomsFiltered(pin) &&
      byGuestsFiltered(pin) &&
      byFeaturesFiltered(pin);
    });
  };

  var onfilterChange = debounce(function () {
    window.map.draw();
  });

  window.map.mapFilters.addEventListener('change', onfilterChange);

  window.filters = {
    getFiltered: getFilteredData,
  };
})();
