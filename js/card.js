'use strict';

(function () {

  var TypeOffer = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var documentFragment = document.createDocumentFragment();

  var createFeaturesList = function (advertisment) {
    advertisment.offer.features.forEach(function (li, i) {
      li = document.createElement('li');
      li.classList.add('popup__feature', 'popup__feature--' + advertisment.offer.features[i]);
      documentFragment.appendChild(li);
    });
    return documentFragment;
  };

  var createPhotos = function (advertisment) {
    var popupPhoto = popupTemplate.cloneNode(true).querySelector('.popup__photo');
    for (var j = 0; j < advertisment.offer.photos.length; j++) {
      var photo = popupPhoto.cloneNode(true);
      photo.src = advertisment.offer.photos[j];
      documentFragment.appendChild(photo);
    }
    return documentFragment;
  };

  var createCard = function (advertisment) {
    var mapMark = popupTemplate.cloneNode(true);
    mapMark.querySelector('.popup__title').textContent = advertisment.offer.title;
    mapMark.querySelector('.popup__text--address').textContent = advertisment.offer.address;
    mapMark.querySelector('.popup__text--price ').textContent = advertisment.offer.price + '₽/ночь';
    mapMark.querySelector('.popup__type').textContent = TypeOffer[advertisment.offer.type];
    mapMark.querySelector('.popup__text--capacity').textContent = advertisment.offer.rooms + ' комнаты для ' + advertisment.offer.guests + ' гостей';
    mapMark.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisment.offer.checkin + ', выезд до ' + advertisment.offer.checkout;
    mapMark.querySelector('.popup__description').textContent = advertisment.offer.description;
    mapMark.querySelector('.popup__avatar').src = advertisment.author.avatar;
    mapMark.querySelector('.popup__features').innerHTML = '';
    mapMark.querySelector('.popup__features').appendChild(createFeaturesList(advertisment));
    mapMark.querySelector('.popup__photos').innerHTML = '';
    mapMark.querySelector('.popup__photos').appendChild(createPhotos(advertisment));

    return mapMark;
  };

  window.card = {
    create: createCard,
  };
})();
