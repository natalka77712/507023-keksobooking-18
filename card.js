'use strict';

window.card = (function () {
  var cardTemplate = document
    .querySelector('#card')
    .content.querySelector('.map__card');
  var mapFilterContainer = document.querySelector('.map__filters-container'); // Вставить перед этим блоком блок с карточкой
  var ESC_KEY = 27;

  function drawCard(element) {
    var cardClonedElement = cardTemplate.cloneNode(true); // склонировать все содержимое этого элемента
    cardClonedElement.querySelector('.popup__title').textContent =
      element.offer.title;
    cardClonedElement.querySelector('.popup__text--address').textContent =
      element.offer.address;
    cardClonedElement.querySelector('.popup__text--price').firstChild.nodeValue =
      element.offer.price + ' ₽';
    cardClonedElement.querySelector('.popup__type').textContent = getTypeofAccommodation(element);
    cardClonedElement.querySelector('.popup__text--capacity').textContent =
      element.offer.rooms +
      ' комнаты для ' +
      element.offer.guests +
      ' ' +
      'гостей';
    cardClonedElement.querySelector('.popup__text--time').textContent =
      'Заезд после:' +
      ' ' +
      element.offer.checkin +
      ', ' +
      'Выезд до:' +
      ' ' +
      element.offer.checkout;
    cardClonedElement.querySelector('.popup__photos img').src =
      element.offer.photos;
    cardClonedElement.querySelector('.popup__description').textContent =
      element.offer.description;
    cardClonedElement.querySelector('.popup__avatar').src =
      element.author.avatar;
    cardClonedElement.querySelector('.popup__features').innerHTML = '';

    // находим в карточке кнопку навешиваем обработчик для закрытия.
    var popupClose = cardClonedElement.querySelector('.popup__close');
    var popup = cardClonedElement;

    // функция, которая скрывает попап по нажатию на крестик
    function onPopupCloseButtonClick() {
      popup.remove();
      window.map.hotelAddress.value = '';
    }

    function onPopupEscPress(evt) {
      if (evt.keyCode === ESC_KEY) {
        popup.remove();
      }
    }

    popupClose.addEventListener('click', onPopupCloseButtonClick);
    document.addEventListener('keydown', onPopupEscPress);

    var featuresList = cardClonedElement.querySelector('.popup__features');
    window.data.FEATURES.forEach(function (li, i) {
      li = document.createElement('li');
      featuresList.appendChild(li);
      li.classList.add('popup__feature', 'popup__feature--' + window.data.FEATURES[i]);
    });

    return popup;
  }

  /* function drawAllCards(arr) {
    var fragment = document.createDocumentFragment(); // Создаем фрагмент под отрисовку
    fragment.appendChild(drawCard(arr[0]));
    var newCard = window.map.mapWindow.insertBefore(fragment, mapFilterContainer);
    return newCard;
  } */

  function getTypeofAccommodation(item) {
    var typeOf = item.offer.type;
    if (typeOf === 'flat') {
      typeOf = 'Квартира';
    } else if (typeOf === 'bungalo') {
      typeOf = 'Бунгало';
    } else if (typeOf === 'house') {
      typeOf = 'Дом';
    } else if (typeOf === 'palace') {
      typeOf = 'Дворец';
    }
    return typeOf;
  }

  return {
    drawCard: drawCard,
    // drawAllCards: drawAllCards,
    mapFilterContainer: mapFilterContainer
  };
})();
