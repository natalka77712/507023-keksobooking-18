'use strict';

(function () {

  var typeOffer = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var createCard = function (advertisment) {
    var mapMark = cardTemplate.cloneNode(true);
    var photoFragment = document.createDocumentFragment();
    var photoElement = mapMark.querySelector('.popup__photo');
    var photoPart = mapMark.querySelector('.popup__photos');
    var featurePart = mapMark.querySelector('.popup__features');
    mapMark.querySelector('.popup__title').textContent = advertisment.offer.title;
    mapMark.querySelector('.popup__text--address').textContent = advertisment.offer.address;
    mapMark.querySelector('.popup__text--price ').textContent = advertisment.offer.price + '₽/ночь';
    mapMark.querySelector('.popup__type').textContent = typeOffer[advertisment.offer.type];
    mapMark.querySelector('.popup__text--capacity').textContent = advertisment.offer.rooms + ' комнаты для ' + advertisment.offer.guests + ' гостей';
    mapMark.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisment.offer.checkin + ', выезд до ' + advertisment.offer.checkout;
    mapMark.querySelector('.popup__description').textContent = advertisment.offer.description;
    mapMark.querySelector('.popup__avatar').src = advertisment.author.avatar;

    featurePart.innerHTML = '';
    for (var i = 0; i < advertisment.offer.features.length; i++) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add('popup__feature--' + advertisment.offer.features[i]);
      featurePart.append(feature);
    }

    photoPart.innerHTML = '';
    for (var j = 0; j < advertisment.offer.photos.length; j++) {
      var photo = photoElement.cloneNode(true);
      photo.src = advertisment.offer.photos[j];
      photoFragment.appendChild(photo);
    }
    photoPart.appendChild(photoFragment);

    return mapMark;
  };

  window.createCard = createCard;

})();
